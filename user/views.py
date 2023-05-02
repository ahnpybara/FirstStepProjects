import os
from uuid import uuid4

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from Astronaut.settings import MEDIA_ROOT
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
            return Response(status=400, data=dict(message="회원정보가 잘못되었습니다."))

        # 이메일이 있을 때 비밀번호가 일치한지 확인
        if user.check_password(password):
            # 세션 정보에 이메일이란 이름으로 이메일 값을 저장해놓는다.
            request.session['email'] = email
            return Response(status=200)
        else:
            return Response(status=400, data=dict(message="회원정보가 잘못되었습니다."))


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
