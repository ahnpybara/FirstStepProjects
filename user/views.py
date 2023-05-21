import os
from uuid import uuid4

from django.db.models import Q
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from Astronaut.settings import MEDIA_ROOT
from content.models import Feed, Reply, Like, Bookmark, Follow
from .models import User
from django.contrib.auth.hashers import make_password


# Join 클래스는 사용자의 요청 방식에 따라 join.html을 보여주거나,회원가입시 사용자로부터 전달 받은 데이터를 유저 테이블에 저장
class Join(APIView):
    # noinspection PyMethodMayBeStatic
    # 사용자가 단순 url을 get 요청시 join.html 파일을 보여줌
    def get(self, request):
        return render(request, "user/join.html")

    # noinspection PyMethodMayBeStatic
    # 사용자가 회원가입을 통해서 서버로 데이터를 Post 요청
    def post(self, request):
        # Json 형식으로 올라온 파일에서 데이터를 뽑아냄
        email = request.data.get('email', None)
        nickname = request.data.get('nickname', None)
        name = request.data.get('name', None)
        password = request.data.get('password', None)

        # 정유진: User 테이블에 존재하는지 확인
        check_user_email = User.objects.filter(email=email).exists()
        check_user_nickname = User.objects.filter(nickname=nickname).exists()

        # 정유진: 이미 존재하는 경우 출력할 메시지 전달.
        if check_user_email or check_user_nickname:
            if check_user_email:
                return Response(status=200, data=dict(message="이미 가입된 이메일입니다."))
            if check_user_nickname:
                return Response(status=200, data=dict(message="이미 존재하는 닉네임입니다."))
        # 정유진: 존재하지 않는 경우 생성
        else:
            # 전달 받은 데이터를 토대로 유저 테이블에 새로운 튜플을 생성
            User.objects.create(email=email,
                                nickname=nickname,
                                name=name,
                                password=make_password(password),
                                profile_image="default_profile.png")

            # 성공적으로 전달되었다는 응답을 줌
            return Response(status=200)


# Login 클래스는 사용자의 요청 방식에 따라 Login.html을 보여주거나, 로그인시 이메일이나 비밀번호가 일치한지 확인
class Login(APIView):
    # noinspection PyMethodMayBeStatic
    # 사용자가 단순 url을 get 요청시 login.html 파일을 보여줌
    def get(self, request):
        return render(request, "user/login.html")

    # noinspection PyMethodMayBeStatic
    # 사용자가 로그인을 하기 위해 서버에 이메일과 비밀번호를 post 요청 -> 서버는 사용자가 입력한 정보가 일치한지 확인 후 응답
    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        # 사용자가 서버로 전달한 이메일이 User테이블에 있으면 해당 객체를 뽑아서 user변수에 저장
        user = User.objects.filter(email=email).first()

        # 이메일이 일치하지 않을 경우
        if user is None:
            return Response(status=200, data=dict(message="회원정보가 잘못되었습니다."))

        # 이메일이 있을 때 비밀번호가 일치한지 확인
        if user.check_password(password):
            # 세션 정보에 이메일이란 이름으로 이메일 값을 저장해놓는다.
            request.session['email'] = email
            return Response(status=200)
        else:
            return Response(status=200, data=dict(message="회원정보가 잘못되었습니다."))


# 로그아웃을 할 땐 세션을 비워줘야 하며 사용자에게 로그인 페이지로 이동시키는 응답을 줌
class LogOut(APIView):
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        # 세션을 비우고 로그인 페이지로 이동시킴
        request.session.flush()
        return render(request, "user/login.html")


# 사용자가 이미지를 업로드시 업로드한 이미지로 유저 테이블 값을 수정
class UploadProfile(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 올라온 폼 데이터에서 파일과 이메일을 꺼냄
        file = request.FILES['file']
        email = request.data.get('email')

        # 이미지를 media 폴더에 저장하는 작업
        uuid_name = uuid4().hex
        save_path = os.path.join(MEDIA_ROOT, uuid_name)

        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        profile_image = uuid_name

        # 유저 테이블에서 전달 받은 유저의 이메일과 같은 레코드 하나만 뽑아서 user에 저장
        user = User.objects.filter(email=email).first()

        # 해당 유저의 프로필 사진을 post요청으로 받은 사진으로 변경
        user.profile_image = profile_image
        # 변경 사항을 저장함 create할때는 자동으로 저장되지만 수정은 수동으로 save를 해줘야 함
        user.save()

        return Response(status=200)


# 05-07 유재우 : 프로파일 리셋부분
class ResetProfile(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        email = request.data.get('email')

        user = User.objects.filter(email=email).first()

        # 해당 유저의 프로필 사진을 post요청으로 받은 사진으로 변경
        user.profile_image = "default_profile.png"
        # 변경 사항을 저장함 create할때는 자동으로 저장되지만 수정은 수동으로 save를 해줘야 함
        user.save()
        return Response(status=200)


# 05-12 유재우 유저탈퇴 부분
class RemoveProfile(APIView):
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        reply = Reply.objects.filter(email=email)
        reply.delete()
        feeds = Feed.objects.filter(email=email)
        feeds.delete()
        user.delete()
        return render(request, "user/join.html")


# 05-16유재우 : 닉네임 수정
class UpdateNickname(APIView):
    def post(self, request):
        user_email = request.data.get('email')
        user_nickname = request.data.get('nickname')
        # 정유진: 닉네임 중복 확인
        check_nickname = User.objects.filter(Q(email=user_email) & Q(nickname=user_nickname)).exists()
        if check_nickname:
            return Response(status=200, data=dict(message="존재하는 닉네임입니다."))
        else:
            user = User.objects.filter(email=user_email).first()
            user.nickname = user_nickname
            user.save()
            return Response(status=200)


# 05-16유재우 : 비밀번호 수정
class UpdatePassword(APIView):
    def post(self, request):
        user_email = request.data.get('email')
        user_password = request.data.get('password')
        user = User.objects.filter(email=user_email).first()
        user.password = make_password(user_password)
        user.save()

        return Response(status=200)


# 05-09 유재우 : 세팅
class Settings(APIView):
    def get(self, request):
        email = request.session.get('email', None)
        user_session = User.objects.filter(email=email).first()

        return render(request, "content/settings.html", dict(user_session=user_session))


# 05-15 유재우 : 이메일 변경
class UpdateEmail(APIView):
    def post(self, request):
        # 정유진: 바꿀 이메일
        email = request.data.get('email')
        check_email = User.objects.filter(email=email).exists()
        if check_email:
            return Response(status=200, data=dict(message="존재하는 이메일입니다."))
        else:
            # 사용중인 이메일
            user_email = request.data.get('user_email')

            user = User.objects.filter(email=user_email).first()
            reply = Reply.objects.filter(email=user_email)
            feed = Feed.objects.filter(email=user_email)
            # 정유진: 다른 테이블의 이메일 정보도 수정
            like = Like.objects.filter(email=user_email)
            bookmark = Bookmark.objects.filter(email=user_email)
            follower = Follow.objects.filter(follower=user_email)
            following = Follow.objects.filter(following=user_email)

            #TODO 왜 방식이 다른가?
            user.email = email
            request.session['email'] = email
            reply.update(email=email)
            feed.update(email=email)
            # 정유진: 다른 테이블의 이메일 정보도 수정
            like.update(email=email)
            bookmark.update(email=email)
            follower.update(follower=email)
            following.update(following=email)
            user.save()
            return Response(status=200)
