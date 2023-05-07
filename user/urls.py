from django.urls import path
from .views import Join, Login, LogOut, UploadProfile

# 사용자가 어떤 url를 요청하느냐에 따라 어떤 뷰를 실행할지 결정하는 리스트
urlpatterns = [
    # 사용자가 특정 url을 요청하면, 해당 url과 매핑된 클래스를 뷰로 실행한다.
    path('join/', Join.as_view()),
    path('login/', Login.as_view()),
    path('logout/', LogOut.as_view()),
    path('profile/upload', UploadProfile.as_view())
]
