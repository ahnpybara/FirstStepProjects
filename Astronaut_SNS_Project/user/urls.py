from django.urls import path
from .views import Join, Login, LogOut, UploadProfile, RemoveProfile, ResetProfile, UpdatePassword, Settings, \
    UpdateEmail, UpdateNickname, Profile, ReplyProfile, ChatView, Chatting, AlertAll

# 사용자가 어떤 url를 요청하느냐에 따라 어떤 뷰를 실행할지 결정하는 리스트
urlpatterns = [
    path('join', Join.as_view()),
    path('login', Login.as_view()),
    path('logout', LogOut.as_view()),
    path('profile/upload', UploadProfile.as_view()),
    path('profile/reset', ResetProfile.as_view()),
    path('profile/remove', RemoveProfile.as_view()),
    path('updatepassword', UpdatePassword.as_view()),
    path('profile/setting', Settings.as_view()),
    path('profile/updateemail', UpdateEmail.as_view()),
    path('profile/updatenickname', UpdateNickname.as_view()),
    path('profile/', Profile.as_view()),
    path('reprofile/', ReplyProfile.as_view()),
    path('follow', ReplyProfile.as_view()),
    path('chat', ChatView.as_view()),
    path('chatting', Chatting.as_view()),
    path('alert', AlertAll.as_view()),
]

