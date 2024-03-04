from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from content.views import Main
from .settings import MEDIA_URL, MEDIA_ROOT
from django.conf.urls.static import static


# 사용자가 어떤 url를 요청하느냐에 따라 어떤 뷰를 실행할지 결정하는 리스트
urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', Main.as_view()),
    path('', Main.as_view()),
    # 아래 정의된 앱 폴더의 url이 요청될 경우 해당 앱 폴더의 urls.py를 가서 읽음
    path('content/', include('content.urls')),
    path('user/', include('user.urls'))
]
# 미디어 폴더에 접근해서 파일들을 조회할 수 있도록 하는 코드입니다.
urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
