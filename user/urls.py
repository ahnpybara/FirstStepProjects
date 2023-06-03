from django.urls import path
from .views import Join, Login, LogOut, UploadProfile, RemoveProfile, ResetProfile, UpdatePassword, Settings, \
    UpdateEmail, UpdateNickname

# 사용자가 어떤 url를 요청하느냐에 따라 어떤 뷰를 실행할지 결정하는 리스트
urlpatterns = [
    # 사용자가 특정 url을 요청하면, 해당 url과 매핑된 클래스를 뷰로 실행한다.
    path('join', Join.as_view()),
    path('login', Login.as_view()),
    path('logout', LogOut.as_view()),
    path('profile/upload', UploadProfile.as_view()),
    # 05-07 유재우 : 프로파일 이미지 리셋,제거, 계정정보 변경,삭제 추가
    path('profile/reset', ResetProfile.as_view()),
    path('profile/remove', RemoveProfile.as_view()),
    path('updatepassword', UpdatePassword.as_view()),
    path('profile/setting', Settings.as_view()),
    path('profile/updateemail', UpdateEmail.as_view()),
    path('profile/updatenickname', UpdateNickname.as_view())
]
