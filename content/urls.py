from django.urls import path
from .views import UploadFeed, Profile, Main, UploadReply, ToggleLike, ToggleBookmark, ReplyProfile, RemoveFeed, \
    SearchFeed, RemoveReply, UpdateFeed, UpdateReply, FeedModal, Autocomplete, FollowerFeed

app_name = 'content'

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
    path('removefeed', RemoveFeed.as_view()),
    path('search/', SearchFeed.as_view(), name='feed_search'),
    # 05-12 유재우 : 회원탈퇴,  댓글 삭제를 위해추가
    path('removereply', RemoveReply.as_view()),
    path('updatefeed', UpdateFeed.as_view()),
    path('updatereply', UpdateReply.as_view()),
    path('feedmodal/', FeedModal.as_view()),
    path('autocomplete/', Autocomplete.as_view()),
    path('follow', ReplyProfile.as_view()),
    path('follower', FollowerFeed.as_view())
]