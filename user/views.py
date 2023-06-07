import os
from datetime import datetime
from uuid import uuid4
from django.db.models import Q
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from Astronaut.settings import MEDIA_ROOT
from content.models import Feed, Reply, Hashtag, Follow, Like, Bookmark, Image
from .models import User
from django.contrib.auth.hashers import make_password


# 회원가입 클래스
class Join(APIView):
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        return render(request, "user/join.html")

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 전달된 데이터를 받음 (회원가입시 사용자가 입력한 정보)
        email = request.data.get('email', None)
        nickname = request.data.get('nickname', None)
        name = request.data.get('name', None)
        password = request.data.get('password', None)

        # 사용자가 입력한 정보가 User 테이블에 존재하는지 확인
        check_user_email = User.objects.filter(email=email).exists()
        check_user_nickname = User.objects.filter(nickname=nickname).exists()

        # 이미 존재하는 경우 출력할 메시지 전달.
        if check_user_email or check_user_nickname:
            if check_user_email:
                return Response(status=200, data=dict(message="이미 가입된 이메일입니다."))
            if check_user_nickname:
                return Response(status=200, data=dict(message="이미 존재하는 닉네임입니다."))
        # 존재하지 않는 경우 유저 테이블에 새로운 객체를 생성
        else:
            # 전달 받은 데이터를 토대로 유저 테이블에 새로운 객체를 생성
            User.objects.create(email=email,
                                nickname=nickname,
                                name=name,
                                password=make_password(password),
                                profile_image="default_profile.png")

            # 성공적으로 전달되었다는 응답을 줌
            return Response(status=200)


# 로그인 클래스
class Login(APIView):
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        return render(request, "user/login.html")

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 전달된 데이터를 받음 (로그인시 사용자가 입력한 정보)
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        # 사용자가 입력한 정보가 User 테이블에 존재하는지 확인
        user = User.objects.filter(email=email).first()

        # 이메일이 일치하지 않을 경우
        if user is None:
            return Response(status=200, data=dict(message="회원정보가 잘못되었습니다."))

        # 이메일은 올바르지만 비밀번호가 일치한지 확인
        if user.check_password(password):
            # 비밀번호가 일치하면 로그인 성공으로 세션 정보에 이메일이란 이름으로 이메일 값을 저장해놓는다.
            request.session['email'] = email
            # 해당 유저가 마지막으로 로그인한 시점을 업데이트 한다
            user.last_login = datetime.now()
            user.save()
            return Response(status=200)
        # 비밀번호가 일치하지 않은 경우 알림
        else:
            return Response(status=200, data=dict(message="회원정보가 잘못되었습니다."))


# 로그아웃 클래스
class LogOut(APIView):
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        # 세션을 비우고 로그인 페이지로 이동시킴
        request.session.flush()
        return render(request, "user/login.html")


# 프로필 사진 변경 클래스
class UploadProfile(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 전달된 이메일과 폼 데이터객체에서 파일을 꺼냄
        file = request.FILES['file']
        email = request.data.get('email')

        # 전달된 이미지 이름을 uuid로 설정
        uuid_name = uuid4().hex
        # 이미지가 저장될 경로를 설정 ( 미디어 경로 + 변경된 이미지 이름 )
        save_path = os.path.join(MEDIA_ROOT, uuid_name)
        # 이미지를 실제 media 폴더에 저장하는 과정
        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        # 변수에 변경할 이미지 이름을 저장
        profile_image = uuid_name

        # 프로필 이미지를 변경할 유저객체를 뽑음
        user = User.objects.filter(email=email).first()
        # 해당 유저의 프로필 사진을 변경
        user.profile_image = profile_image
        # 변경 사항을 저장함
        user.save()

        return Response(status=200)


# 프로필 리셋 클래스
class ResetProfile(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 부터 전달된 프로필을 리셋할 유저의 이메일
        email = request.data.get('email')
        # 프로필을 리셋할 유저 객체
        user = User.objects.filter(email=email).first()

        # 해당 유저의 프로필 사진을 기본값으로 변경
        user.profile_image = "default_profile.png"
        # 변경 사항을 저장
        user.save()
        return Response(status=200)


# 유저 탈퇴 클래스
class RemoveProfile(APIView):
    def post(self, request):
        # 서버로 전달된 탈퇴할 유저의 이메일을 받음
        email = request.data.get('email')
        # 탈퇴할 유저의 객체를 구함
        user = User.objects.filter(email=email).first()
        # 해당 유저가 작성한 댓글 객체를 가져옴
        reply = Reply.objects.filter(email=email)
        # 댓글 객체 삭제
        reply.delete()
        # 해당 유저가 작성한 피드 객체를 가져옴
        feeds = Feed.objects.filter(email=email)
        for feeds in feeds:
            # 해당 유저가 작성한 피드에 달린 해시태그와 좋아요 북마크를 삭제
            hashtags = Hashtag.objects.filter(feed_id=feeds.id)
            hashtags.delete()
            likes = Like.objects.filter(feed_id=feeds.id)
            likes.delete()
            bookmark = Bookmark.objects.filter(feed_id=feeds.id)
            bookmark.delete()
            # 이미지 삭제 추가
            images = Image.objects.filter(feed_id=feeds.id)
            images.delete()

        # 해당 유저가 다른 피드에 좋아요, 북마크한 정보를 삭제
        likes = Like.objects.filter(email=email)
        likes.delete()
        bookmark = Bookmark.objects.filter(email=email)
        bookmark.delete()

        # 해당유저가 팔로우한 정보와 해당 유저를 팔로잉한 정보를 삭제
        follower = Follow.objects.filter(follower=email)
        follower.delete()
        following = Follow.objects.filter(following=email)
        following.delete()

        # 삭제할 피드 객체를 다시 불러옴 ( 반복문으로 인해서 인덱스 값을 잃어버림)
        feeds = Feed.objects.filter(email=email)
        # 피드 객체 삭제
        feeds.delete()
        # 유저 객체 삭제
        user.delete()
        # 세션 정보 비움
        request.session.flush()
        # 로그아웃 페이지로 이동
        return render(request, "user/join.html")


# 닉네임 수정 클래스
class UpdateNickname(APIView):
    def post(self, request):
        # 서버로 전달된 닉네임을 수정할 유저의 이메일과 수정하고 싶은 닉네임
        user_email = request.data.get('email')
        user_nickname = request.data.get('nickname')
        # 수정하고 싶은 닉네임이 중복인지 확인
        check_nickname = User.objects.filter(Q(email=user_email) & Q(nickname=user_nickname)).exists()
        # 이미 있는 경우 알림
        if check_nickname:
            return Response(status=200, data=dict(message="존재하는 닉네임입니다."))
        # 없는 경우 유저의 닉네임을 요청된 닉네임으로 수정
        else:
            user = User.objects.filter(email=user_email).first()
            user.nickname = user_nickname
            user.save()
            return Response(status=200)


# 비밀번호 수정 클래스
class UpdatePassword(APIView):
    def post(self, request):
        # 서버로 전달된 비밀번호를 수정할 유저의 이메일과 수정할 비밀번호
        user_email = request.data.get('email')
        user_password = request.data.get('password')

        # 수정할 유저의 객체를 뽑음
        user = User.objects.filter(email=user_email).first()
        # 수정할 비밀번호가 만약 이전 비밀번호와 동일하면 알림
        if user.check_password(user_password):
            return Response(status=200, data=dict(message="동일한 비밀번호입니다"))
        # 그렇지 않다면 암호화를 한 뒤 저장
        else:
            user.password = make_password(user_password)
            user.save()
            # 비밀번호가 수정 되었으니 세션을 비워주고 다시 로그인을 하게 함
            request.session.flush()
            return Response(status=200)


# 설정 클래스
class Settings(APIView):
    def get(self, request):
        # 세션정보에서 이메일을 가져옴
        email = request.session.get('email', None)
        # 세션 유저의 객체를 가져옴
        user_session = User.objects.filter(email=email).first()
        # 설정 페이지와 세션 유저의 객체를 전달
        return render(request, "content/settings.html", dict(user_session=user_session))


# 이메일 변경 클래스
class UpdateEmail(APIView):
    def post(self, request):
        # 서버로 전달된 수정할 이메일
        email = request.data.get('email')
        # 수정할 이메일이 이미 유저 테이블에 존재하는지 확인
        check_email = User.objects.filter(email=email).exists()
        # 이미 존재한다면 알림
        if check_email:
            return Response(status=200, data=dict(message="존재하는 이메일입니다."))
        # 그렇지 않다면 서버로 전달된 유저가 사용중인 이메일을 받음
        else:
            # 현재 사용중인 이메일
            user_email = request.data.get('user_email')
            # 이메일을 변경할 유저의 객체를 구함
            user = User.objects.filter(email=user_email).first()
            # 해당 유저가 작성한 댓글 객체를 구함
            reply = Reply.objects.filter(email=user_email)
            # 해당 유저가 작성한 피드 객체를 구함
            feed = Feed.objects.filter(email=user_email)
            # 해당 유저가 좋아요, 북마크, 팔로워, 팔로잉한 객체를 구함
            like = Like.objects.filter(email=user_email)
            bookmark = Bookmark.objects.filter(email=user_email)
            follower = Follow.objects.filter(follower=user_email)
            following = Follow.objects.filter(following=user_email)
            # 각 객체의 이메일을 수정할 이메일로 변경
            user.email = email
            request.session['email'] = email
            reply.update(email=email)
            feed.update(email=email)
            like.update(email=email)
            bookmark.update(email=email)
            follower.update(follower=email)
            following.update(following=email)
            user.save()
            return Response(status=200)
