from django.urls import path
from .views import UploadFeed, Profile, Main, UploadReply, ToggleLike, ToggleBookmark, ReplyProfile, RemoveFeed

# 사용자가 어떤 url를 요청하느냐에 따라 어떤 뷰를 실행할지 결정하는 리스트
urlpatterns = [
    # 사용자가 특정 url을 요청하면, 해당 url과 매핑된 클래스를 뷰로 실행한다.
    path('upload', UploadFeed.as_view()),
    path('reply', UploadReply.as_view()),
    path('like', ToggleLike.as_view()),
    path('bookmark', ToggleBookmark.as_view()),
    path('profile/', Profile.as_view()),
    path('main/', Main.as_view()),
    path('reprofile/', ReplyProfile.as_view()),
    path('removefeed', RemoveFeed.as_view())
]
