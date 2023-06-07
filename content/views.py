import random
from uuid import uuid4
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from Astronaut.settings import MEDIA_ROOT
from .models import Feed, Reply, Like, Bookmark, Hashtag, Follow, Image
from user.models import User
import os
import json
from django.http import HttpResponse
from django.db.models import Q


# 메인 페이지를 보여주는 클래스
class Main(APIView):
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        # 05-29 유재우 : 필터링을 위해 추가
        sort = request.GET.get('sort', '')
        # 세션 정보에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장
        email = request.session.get('email', None)
        # 세션에 이메일 정보가 없는경우 -> 로그인을 하지 않고 메인페이지에 접속했다는 뜻 -> 로그인 페이지로 이동시킴
        if email is None:
            return render(request, "user/login.html")

        # 현재 세션 정보의 이메일로 현재 세션 유저의 객체를 뽑아냄 , user_session 과 user와 겹치지 않기 위해서 세션 정보는 user_session에 저장
        user_session = User.objects.filter(email=email).first()
        # 세션에 이메일 정보가 있는데 그 이메일 주소가 우리 회원이 아닌 경우 -> 로그인 페이지로 이동시킴
        if user_session is None:
            return render(request, "user/login.html")

        # feed_list에 담을 정보를 위해서 Feed 테이블에 있는 모든 객체를 가져와서 필터링을 진행할 예정
        feed_object_list = Feed.objects.all().order_by('-id')
        feed_list = []

        # 유저를 검색하기 위해서 유저 정보를 모두 가져옴
        user_object_list = User.objects.all()

        # 아래 반복문은 메인 페이지에 전달할 정보를 각종 여러 테이블의 필터링을 통해서 구하는 과정
        for feed in feed_object_list:
            user = User.objects.filter(email=feed.email).first()
            # 댓글의 2개만 가져온다. -> 나머지 댓글은 더보기로 보여줄 예정, 댓글리스트 생성
            reply_object_list = Reply.objects.filter(feed_id=feed.id)[:2]
            reply_list = []
            # 해당 feed_id에 존재하는 해시태그들을 가져옴 ,해시태그 리스트 생성
            hashtag_object_list = Hashtag.objects.filter(feed_id=feed.id)
            hashtag_list = []
            images_object_list = Image.objects.filter(feed_id=feed.id)
            images_list = []
            # 댓글 리스트에 채울 데이터를 여러 테이블의 필터링을 통해서 채움
            for reply in reply_object_list:
                reply_user = User.objects.filter(email=reply.email).first()
                reply_list.append(dict(reply_content=reply.reply_content,
                                       nickname=reply_user.nickname, profile_image=reply_user.profile_image,
                                       id=reply.id))
            # 해시태그 리스트에 채울 데이터를 여러 테이블의 필터링을 통해서 채움
            for hashtag in hashtag_object_list:
                hashtag_feed = Feed.objects.filter(id=feed.id).first()
                hashtag_list.append(dict(feed_id=hashtag_feed, content=hashtag.content))
            for image in images_object_list:
                images_feed = Feed.objects.filter(id=feed.id).first()
                images_list.append(dict(feed_id=images_feed, image=image.image))
            # 좋아요 수, 좋아요 여부, 북마크 여부
            like_count = Like.objects.filter(feed_id=feed.id).count()
            is_liked = Like.objects.filter(feed_id=feed.id, email=email).exists()
            is_marked = Bookmark.objects.filter(feed_id=feed.id, email=email).exists()
            # 각종 데이터를 feed_list에 담음
            feed_list.append(dict(id=feed.id,
                                  images_list=images_list,
                                  content=feed.content,
                                  like_count=like_count,
                                  profile_image=user.profile_image,
                                  nickname=user.nickname,
                                  reply_list=reply_list,
                                  is_liked=is_liked,
                                  is_marked=is_marked,
                                  create_at=feed.create_at,
                                  hashtag_list=hashtag_list
                                  ))

        # 메인페이지 url을 요청한 사용자에게 메인페이지와 각종 데이터를 전달
        return render(request, "astronaut/main.html",
                      context=dict(feeds=feed_list, user_session=user_session, user_object_list=user_object_list
                                   ))


# 피드 업로드 클래스
class UploadFeed(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 전달된 폼 데이터 객체에서 파일을 꺼냄
        file_length = int(request.data['file_length'])
        content = request.data.get('content')
        email = request.session.get('email', None)
        file = []

        # 서버로 전달된 해시태그 내용을 받고 해당 해시태그의 공백와 줄바꿈을 제거
        hashtags_content = request.data.get('hashtags_content')
        hashtags_content = hashtags_content.replace(" ", "");
        hashtags_content = hashtags_content.replace("\n", "");
        # 해시태그를 #으로 구분
        hashtags_list = hashtags_content.split("#")
        # 만일 첫번째 글자에 #이 안들어 갔을 경우 값을 지움
        if (hashtags_content.find("#") != 0):
            del hashtags_list[0]

        # 해시태그 중복을 제거한 결과를 저장할 해시태그 리스트
        hashtags_lists = []

        # 같은 해시태그의 중복 제거, set-list로 하면 랜덤 배정이 되어 for문으로 바꿈
        for value in hashtags_list:
            if value not in hashtags_lists:
                hashtags_lists.append(value)
        # #으로 구분 했을때 #앞에 아무것 없는 공백이 저장 되는 부분을 삭제
        hashtags_list = list(filter(None, hashtags_lists))
        image = []
        # 피드 테이블에 튜플을 만들고 그 튜플을 feed_id 객체로 저장
        feed_id = Feed.objects.create(content=content, email=email)
        # 이미지는 여러개라 반복문으로 튜플 생성
        for i in range(file_length):
            if i<4:
                print(i)
                file = request.FILES['file'[i]]
            else:
                print(i)
                file = request.FILES['file1'[i]]
            # uuid 값 생성
            uuid_name = uuid4().hex
            # 파일을 어디에 저장할 것 인지 경로를 설정 (미디어 루트 + uuid_name)
            save_path = os.path.join(MEDIA_ROOT, uuid_name)
            # media 폴더에 파일이 저장됨
            with open(save_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            # 폼 데이터객체에서 나머지 일반 데이터(글내용, 작성자 이메일)를 꺼냄
            image =uuid_name
            Image.objects.create(image=uuid_name, feed_id=feed_id.id)

        # 해시태그는 여러개라 반복문으로 테이블 튜플을 생성 ( 해시태그 리스트는 리스트 형태 )
        for hashtags_list in hashtags_list:
            Hashtag.objects.create(content=hashtags_list, feed_id=feed_id.id)

        return Response(status=200)


# 프로필 클래스
class Profile(APIView):
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        # 세션에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장
        email = request.session.get('email', None)

        # 세션에 이메일 정보가 없는경우 -> 로그인을 하지않고 메인페이지에 접속한 경우 -> 로그인 페이지로 이동시킴
        if email is None:
            return render(request, "user/login.html")

        # 현재 세션 정보의 이메일로 현재 세션 유저의 객체를 뽑아냄 , user
        user = User.objects.filter(email=email).first()

        # 세션에 이메일 정보가 있는데 그 이메일 주소가 우리 회원이 아닌경우 -> 로그인 페이지로 이동시킴
        if user is None:
            return render(request, "user/login.html")

        # 사용자가 작성한 피드 수
        user_feed_count = Feed.objects.filter(email=email).count()
        # 사용자가 작성한 피드리스트
        feed_list = Feed.objects.filter(email=email).order_by('-id')
        # 사용자가 좋아요한 피드들의 id 리스트
        like_list = list(Like.objects.filter(email=email).values_list('feed_id', flat=True))
        # 사용자가 좋아요한 피드 리스트
        like_feed_list = Feed.objects.filter(id__in=like_list).order_by('-id')
        # 사용자가 북마크한 피드들의 id 리스트
        bookmark_list = list(Bookmark.objects.filter(email=email).values_list('feed_id', flat=True))
        # 사용자가 북마크한 피드 리스트
        bookmark_feed_list = Feed.objects.filter(id__in=bookmark_list).order_by('-id')
        # 팔로워 팔로잉 수 계산
        follower_count = Follow.objects.filter(follower=email).count()
        following_count = Follow.objects.filter(following=email).count()

        # 사용자가 작성한 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        feed_count_list = []
        for feed in feed_list:
            # 좋아요 수
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            feed_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))

        # 사용자가 좋아요한 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        like_count_list = []
        for feed in like_feed_list:
            # 좋아요 수
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            like_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))
        # 사용자가 북마크한 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        bookmark_count_list = []
        for feed in bookmark_feed_list:
            # 좋아요 수
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            bookmark_count_list.append(dict(id=feed.id,
                                            like_count=like_count,
                                            reply_count=reply_count))

        # 프로필 화면을 요청한 사용자에게 프로필화면과 해당 데이터를 전달
        return render(request, 'content/profile.html', context=dict(feed_list=feed_list,
                                                                    like_feed_list=like_feed_list,
                                                                    bookmark_feed_list=bookmark_feed_list,
                                                                    user_session=user,
                                                                    user=user,
                                                                    feed_count_list=feed_count_list,
                                                                    like_count_list=like_count_list,
                                                                    bookmark_count_list=bookmark_count_list,
                                                                    user_feed_count=user_feed_count,
                                                                    follower_count=follower_count,
                                                                    following_count=following_count))


# 댓글 업로드 클래스
class UploadReply(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 전달된 데이터를 받아서 처리(피드id, 댓글 내용,
        feed_id = request.data.get('feed_id', None)
        reply_content = request.data.get('reply_content', None)

        # 세션에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장 -> 이메일로 세션 유저 객체를 구함
        email = request.session.get('email', None)
        user = User.objects.filter(email=email).first()

        # 서버로 전달된 데이터를 토대로 Reply 테이블에 새로운 튜플을 생성한 뒤 생성된 객체의 id값을 변수 reply_id에 저장
        reply_id = Reply.objects.create(feed_id=feed_id, reply_content=reply_content, email=email).id

        # 성공적으로 전달이 되었다는 응답과 ajax 비동기 처리를 위한 성공 함수 인자인 data에 데이터를 전달하기 위해서 보냄
        return Response(status=200, data=dict(user_nickname=user.nickname,
                                              user_profile_image=user.profile_image,
                                              user_reply_id=reply_id))


# 좋아요 클래스
class ToggleLike(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 사용자가 좋아요시 서버로 전달된 데이터를 받음 (feed_id는 몇번 피드에 좋아요를 눌렀는지 알기 위함 )
        feed_id = request.data.get('feed_id', None)
        # 좋아요 아이콘의 색 여부를 통해서 판별
        favorite_color = request.data.get('favorite_color', True)
        # 세션에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장 -> 이메일로 세션 유저 객체를 구함
        email = request.session.get('email', None)

        # 해당 피드에 현재 세션의 사용자가 좋아요를 누른 정보가 있다면 뽑아서 like에 저장
        like = Like.objects.filter(feed_id=feed_id, email=email).first()

        # 뽑은 객체가 존재 한다면 like객체를 삭제
        if like is not None:
            like.delete()
        # like 객체가 존재하지 않다면 좋아요 테이블에 새로운 튜플을 생성
        else:
            Like.objects.create(feed_id=feed_id, email=email)

        # 비동기 처리를 위한 좋아요 수
        async_like_count = Like.objects.filter(feed_id=feed_id).count()

        # ajax 비동기 처리를 위한 성공 함수 인자인 data에 데이터를 전달하기 위한 과정
        data = {
            'async_like_count': async_like_count
        }

        json_data = json.dumps(data)
        return HttpResponse(json_data, content_type='application/json')


# 북마크 클래스
class ToggleBookmark(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 사용자가 북마크시 서버로 전달된 데이터를 받음 (feed_id는 몇번 피드에 북마크를 눌렀는지 알기 위함 )
        feed_id = request.data.get('feed_id', None)
        # 북마크 아이콘의 색 여부를 통해서 판별
        bookmark_color = request.data.get('bookmark_color', True)
        # 세션에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장 -> 이메일로 세션 유저 객체를 구함
        email = request.session.get('email', None)

        # 해당 피드에 현재 세션의 사용자가 북마크를 누른 정보가 있다면 뽑아서 bookmark에 저장
        bookmark = Bookmark.objects.filter(feed_id=feed_id, email=email).first()

        # 뽑은 객체가 존재 한다면 bookmark객체를 삭제
        if bookmark is not None:
            bookmark.delete()
        # bookmark객체가 존재하지 않다면 북마크 테이블에 새로운 튜플을 생성
        else:
            Bookmark.objects.create(feed_id=feed_id, email=email)

        return Response(status=200)


# 유저 프로필로 이동 클래스
class ReplyProfile(APIView):
    def get(self, request):
        # 서버로 전달된 사용자의 닉네임을 받음
        nickname = request.GET.get('user_nickname')

        # 현재세션 정보를 받아옴. (네비바의 본인 프로필 정보를 위함)
        email_session = request.session.get('email', None)

        # 세션에 이메일 정보가 없는경우 -> 로그인을 하지 않고 메인페이지에 접속했다는 뜻 -> 로그인 페이지로 이동시킴
        if email_session is None:
            return render(request, "user/login.html")

        # 세션 정보를 토대로 User 테이블에서 현재 세션 유저의 객체를 뽑아냄 (user와 구분하기 위해서 user_session에 저장)
        user_session = User.objects.filter(email=email_session).first()

        # 세션에 이메일 정보가 있는데 그 이메일 주소가 우리 회원이 아닌경우 -> 로그인 페이지로 이동시킴
        if user_session is None:
            return render(request, "user/login.html")

        # 전달된 닉네임을 통해서 프로필로 이동할 유저의 객체를 뽑음
        user = User.objects.filter(nickname=nickname).first()
        # 유저의 객체에서 이메일을 구함
        email = user.email

        # 사용자가 작성한 피드 수
        user_feed_count = Feed.objects.filter(email=email).count()
        # 사용자가 작성한 피드리스트
        feed_list = Feed.objects.filter(email=email).order_by('-id')
        # 사용자가 좋아요한 피드들의 id 리스트
        like_list = list(Like.objects.filter(email=email).values_list('feed_id', flat=True))
        # 사용자가 좋아요한 피드 리스트
        like_feed_list = Feed.objects.filter(id__in=like_list).order_by('-id')
        # 사용자가 북마크한 피드들의 id 리스트
        bookmark_list = list(Bookmark.objects.filter(email=email).values_list('feed_id', flat=True))
        # 사용자가 북마크한 피드 리스트
        bookmark_feed_list = Feed.objects.filter(id__in=bookmark_list).order_by('-id')
        # 팔로우 여부
        is_follow = Follow.objects.filter(follower=email_session, following=email).exists()
        # 팔로워 팔로잉 수 계산
        follower_count = Follow.objects.filter(follower=email).count()
        following_count = Follow.objects.filter(following=email).count()

        # 사용자가 작성한 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        feed_count_list = []
        for feed in feed_list:
            # 좋아요 수
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            feed_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))

        # 사용자가 좋아요한 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        like_count_list = []
        for feed in like_feed_list:
            # 좋아요 수
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            like_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))
        # 사용자가 북마크한 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        bookmark_count_list = []
        for feed in bookmark_feed_list:
            # 좋아요 수
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            bookmark_count_list.append(dict(id=feed.id,
                                            like_count=like_count,
                                            reply_count=reply_count))

        # 프로필 화면을 요청한 사용자에게 프로필화면과 해당 데이터를 전달
        return render(request, 'content/profile.html', context=dict(feed_list=feed_list,
                                                                    like_feed_list=like_feed_list,
                                                                    bookmark_feed_list=bookmark_feed_list,
                                                                    user=user,
                                                                    feed_count_list=feed_count_list,
                                                                    like_count_list=like_count_list,
                                                                    bookmark_count_list=bookmark_count_list,
                                                                    user_session=user_session,
                                                                    user_feed_count=user_feed_count,
                                                                    is_follow=is_follow,
                                                                    follower_count=follower_count,
                                                                    following_count=following_count))

    # 팔로우는 내 프로필 페이지가 아닌 다른 사용자의 프로필 페이지에 접속했을 때 가능한 것이므로 ReplyProfile 클래스에 post 함수로 추가
    def post(self, request):
        # 팔로우를 하려는 유저
        user_follower = request.data.get('session_user_email', None)
        # 팔로우를 당하는 유저
        user_following = request.data.get('user_email', None)
        # 팔로우를 한 내 정보와 팔로우를 당한 상대 정보가 Follow 테이블에 있는지 조회
        follow = Follow.objects.filter(follower=user_follower, following=user_following).first()

        # follow 객체가 있다면 삭제
        if follow is not None:
            follow.delete()
        # Follow 객체가 없다면 follow 테이블에 새로운 튜플을 생성
        else:
            Follow.objects.create(follower=user_follower, following=user_following)

        return Response(status=200)


# 피드 삭제 클래스
class RemoveFeed(APIView):
    def post(self, request):
        # 서버로 전달된 데이터를 받아서 처리(피드id, 몇번 피드를 지울 것인지에 대한 정보)
        feed_id = request.data.get('feed_id')

        # 전달된 피드id를 통해서 삭제할 피드 객체를 뽑음
        feeds = Feed.objects.filter(id=feed_id).first()

        # 전달된 피드id를 통해서 작제할 이미지들을 뽑음
        images = Image.objects.filter(feed_id=feed_id)
        images.delete()
        # 전달된 피드id를 통해서 삭제할 댓글 객체를 뽑음
        reply = Reply.objects.filter(feed_id=feed_id)
        reply.delete()
        # 전달된 피드id를 통해서 삭제할 해시태그 객체를 뽑음
        hashtags = Hashtag.objects.filter(feed_id=feeds.id)
        hashtags.delete()
        # 전달된 피드id를 통해서 삭제할 좋아요 북마크 객체를 뽑음
        like = Like.objects.filter(feed_id=feeds.id)
        like.delete()
        bookmark = Bookmark.objects.filter(feed_id=feeds.id)
        bookmark.delete()
        feeds.delete()

        return Response(status=200)


# 검색 클래스
class SearchFeed(APIView):
    def get(self, request):
        # 서버로 전달된 데이터를 받아서 처리(검색 키워드)
        searchKeyword = request.GET.get("search", "")

        # 세션에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장 -> 이메일로 세션 유저 객체를 구함
        email = request.session.get('email', None)
        # 현재 세션 정보의 이메일로 현재 세션 유저의 객체를 뽑아냄 , user
        user_session = User.objects.filter(email=email).first()
        # 만약 검색 키워드가 유저 닉네임중 포함되는 닉네임이 있다면 뽑아냄
        user_object_list = User.objects.filter(nickname__contains=searchKeyword).order_by('-id')
        # 해시태그 검색
        if (searchKeyword.find("#") == 0):
            # 해시태그의 #을 제거
            text = searchKeyword.replace("#", "");
            # 해시태그 테이블에서 검색키워드 텍스트랑 같은게 있다면 해당 객체에서 feed_id만 리스트형태로 반환
            hashtag_content_lists = list(
                Hashtag.objects.filter(content=text).values_list('feed_id', flat=True))

            # 검색결과중 대표 이미지를 뽑아내기 위한 작업 (랜덤으로 뽑아서 보여줌)
            random_feed_id = random.choice(hashtag_content_lists)
            # 메인 대표 이미지를 하나 뽑음 ( 하나만 뽑더라도 first는 필수입니다. )
            feed_main_image = Feed.objects.filter(id=random_feed_id).first()

            # 검색키워드가 포함된 전체 피드 수
            feed_all_count = Hashtag.objects.filter(content=text).count()
            # 검색결과 여부를 판정할 객체 선언
            is_exist_feed = Hashtag.objects.filter(content=text).exists()

            # todo 검새결과가 없을경우 일단 메인 페이지로 이동시킴 나중에 페이지를 만들어서 제공할 예정
            if not is_exist_feed:
                return render(request, 'astronaut/main.html')

            # 피드 리스트와 해당 피드에 좋아요와 댓글수를 저장할 리스트 선언
            feed_search_list = []
            feed_count_list = []
            # 일반순!! feed_id를 토대로 피드 테이블의 객체를 뽑아냄 ( 특정 해시태그가 달린 피드는 여러개가 될 수 있음 -> 반복문 )
            for hashtag_feed_id in hashtag_content_lists:
                feed_hashtag_list = Feed.objects.filter(id=hashtag_feed_id).order_by('-id')
                # 피드 id로 뽑은 피드의 객체들에게서 피드 이미지, 피드수, 댓글 수, 좋아요 수를 뽑아냄
                for feed in feed_hashtag_list:
                    feed_search_list.append(dict(id=feed.id, image=feed.image))
                    # 좋아요 수
                    like_count = Like.objects.filter(feed_id=feed.id).count()
                    # 댓글 수
                    reply_count = Reply.objects.filter(feed_id=feed.id).count()
                    feed_count_list.append(dict(id=feed.id,
                                                like_count=like_count,
                                                reply_count=reply_count))
        # 일반 키워드 검색
        else:
            # 키워드가 포함된 피드 객체를 뽑아냄
            feed_search_list = Feed.objects.filter(content__contains=searchKeyword).order_by('-id')
            # 대표 이미지를 뽑음
            feed_main_image = Feed.objects.filter(content__contains=searchKeyword).first()
            # 검색 키워드가 포함된 피드 개수
            feed_all_count = Feed.objects.filter(content__contains=searchKeyword).count()
            # 검색 키워드가 포함된 피드가 있는지?
            is_exist_feed = Feed.objects.filter(content__contains=searchKeyword).exists()

            # todo 검새결과가 없을경우 일단 메인 페이지로 이동시킴 나중에 페이지를 만들어서 제공할 예정
            if not is_exist_feed:
                return render(request, 'astronaut/main.html')

            # 검색키워드가 포함된 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 데이터를 구하는 과정
            feed_count_list = []
            for feed in feed_search_list:
                # 좋아요 수 확인.
                like_count = Like.objects.filter(feed_id=feed.id).count()
                # 댓글 수 확인.
                reply_count = Reply.objects.filter(feed_id=feed.id).count()
                feed_count_list.append(dict(id=feed.id,
                                            like_count=like_count,
                                            reply_count=reply_count))

        # 검색결과를 검색결과 페이지랑 데이터를 사용자에게 반환
        return render(request, "astronaut/search.html",
                      context=dict(feed_count_list=feed_count_list, user_session=user_session,
                                   user_object_list=user_object_list, feed_search_list=feed_search_list,
                                   searchKeyword=searchKeyword, feed_main_image=feed_main_image,
                                   feed_all_count=feed_all_count))


# 댓글 삭제 클래스
class RemoveReply(APIView):
    def post(self, request):
        # 삭제할 댓글 id
        reply_id = request.data.get('reply_id')
        # 댓글id를 통해 삭제할 댓글 객체를 뽑음
        replys = Reply.objects.filter(id=reply_id)
        # 댓글 삭제
        replys.delete()

        return Response(status=200)


#  피드 수정 클래스
class UpdateFeed(APIView):
    def post(self, request):
        # 수정을 위한 서버로 전달된 데이터 (해시태그, 글내용, 수정될 피드id)
        hashtag_content = request.data.get('hashtag_content')
        content = request.data.get('content')
        feed_id = request.data.get('feed_id')
        # 피드id를 통한 피드에 달린 기존 해시태그들 삭제
        hashtags = Hashtag.objects.filter(feed_id=feed_id)
        hashtags.delete()
        # 전달된 해시태그를 공백과 줄바꿈을 제거
        hashtag_content = hashtag_content.replace(" ", "");
        hashtag_content = hashtag_content.replace("\n", "");
        # 해시태그들을 #으로 구분
        hashtags_list = hashtag_content.split("#")
        # 만일 첫번째 글자에 #이 안들어 갔을 경우 값을 지움
        if (hashtag_content.find("#") != 0):
            del hashtags_list[0]

        # 수정 작업을 거친 해시태그들을 저장할 리스트
        hashtags_lists = []

        # 같은 해시태그의 중복 제거, set-list로 하면 랜덤 배정이 되어 for문으로 바꿈
        for value in hashtags_list:
            if value not in hashtags_lists:
                hashtags_lists.append(value)

        # 맨 앞에 공백을 제거
        hashtags_lists = list(filter(None, hashtags_list))

        # 수정할 해시태그 값들을 해시태그 테이블에 생성
        for hashtags_lists in hashtags_lists:
            Hashtag.objects.create(content=hashtags_lists, feed_id=feed_id)

        # 수정할 피드 객체를 뽑음
        feed = Feed.objects.filter(id=feed_id)
        # 피드 수정
        feed.update(id=feed_id, content=content)

        return Response(status=200)


# 댓글 수정 클래스
class UpdateReply(APIView):
    def post(self, request):
        # 서버로 전달된 데이터를 처리 (수정할 댓글의 아이디와 댓글 내용)
        content = request.data.get('content')
        reply_id = request.data.get('reply_id')
        # 댓글 id를 통해 수정할 댓글 객체를 뽑음
        reply = Reply.objects.filter(id=reply_id)
        # 댓글 수정
        reply.update(id=reply_id, reply_content=content)

        return Response(status=200)


# 피드를 모달창으로 여는 클래스
class FeedModal(APIView):
    def get(self, request):
        # 서버로 전달된 모달로 열 피드 id를 받음
        feed_id = int(request.GET.get('feed_id', None))
        # 세션 정보에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장
        email = request.session.get('email', None)

        # feed_id를 통해 모달로 열 피드의 객체를 뽑음
        feed_modal = Feed.objects.filter(id=feed_id).first()

        # 게시물을 쓴 유저의 객체를 뽑아냄
        feed_modal_writer = User.objects.filter(email=feed_modal.email).first()

        # 게시물에 달린 해시태그들을 뽑아냄
        feed_modal_hashtag_object_list = Hashtag.objects.filter(feed_id=feed_id)
        # 해시태그 내용을 전달하기 위해서 리스트를 선언한 뒤 반복문을 통해 해시태그를 채움
        hashtag_list = []
        for hashtag in feed_modal_hashtag_object_list:
            hashtag_list.append(hashtag.content)

        # 게시물에 달린 댓글 정보
        feed_modal_reply_object_list = Reply.objects.filter(feed_id=feed_id)
        # 댓글 내용을 전달하기 위해서 리스트를 선안한 뒤 반복문을 통해 여러 테이블의 데이터를 채움 (댓글을 쓴 유저의 정보)
        reply_list = []
        for reply in feed_modal_reply_object_list:
            reply_user = User.objects.filter(email=reply.email).first()
            reply_list.append(dict(reply_content=reply.reply_content,
                                   nickname=reply_user.nickname,
                                   profile_image=reply_user.profile_image))
        # 피드의 좋아요 수
        like_count = Like.objects.filter(feed_id=feed_modal.id).count()
        # 피드의 좋아요 여부
        is_liked = Like.objects.filter(feed_id=feed_modal.id, email=email).exists()
        # 피드의 북마크 여부
        is_marked = Bookmark.objects.filter(feed_id=feed_modal.id, email=email).exists()
        # 사용자로 보낼 json 형식의 데이터
        data = {
            'id': feed_modal.id,
            'image': feed_modal.image,
            'feed_content': feed_modal.content,
            'hashtag_list': hashtag_list,

            # 데이터를 JSON 형식으로 변환
            'feed_create_at': feed_modal.create_at.strftime('%b %d, %Y, %I:%M %p'),

            'writer_profile_image': feed_modal_writer.profile_image,
            'writer_nickname': feed_modal_writer.nickname,

            'reply_list': reply_list,

            'is_liked': is_liked,
            'is_marked': is_marked,
            'like_count': like_count
        }

        json_data = json.dumps(data)
        # 응답 repsponse와 동일하지만 약간의 차이가 있음
        return HttpResponse(json_data, content_type='application/json')


# 자동완성 클래스
class Autocomplete(APIView):
    def get(self, request):
        # 서버로 전달된 검색창에 있는 키워드
        search_box_value = request.GET.get('search_box_value', None)

        # 데이터를 저장할 리스트를 선언
        autocomplete_user_list = []
        autocomplete_hashtag_list = []
        prioritize_list = []

        # 만약 검색창에 # 키워드가 있는 경우
        if '#' in search_box_value:
            # 키워드 앞에 붙은 #제거
            search_box_value = search_box_value.replace("#", "")
            # TODO 우선 해시태그 키워드가 포함된 해시태그 내용만 리스트로 뽑아서 저장(10개만 가져옴) 수정 필요
            hashtag_content_lists = Hashtag.objects.filter(content__contains=search_box_value).distinct().values_list(
                'content', flat=True)[:10]

            # 반복문을 통해 특정 해시태그가 달린 게시물 수 와 해시태그를 리스트에 저장
            for hashtag in hashtag_content_lists:
                # 해당 해시태그가 포함된 게시글 수. 같은 게시물에 같은 해시태그는 미포함.
                hashtag_count = Hashtag.objects.filter(content=hashtag).distinct().values_list('feed_id',
                                                                                               flat=True).count()
                autocomplete_hashtag_list.append(dict(content=hashtag,
                                                      hashtag_count=hashtag_count))

            # 해시태그가 달린 게시물 수가 많은 순으로 정렬 람다식 이용
            autocomplete_hashtag_list = sorted(autocomplete_hashtag_list, key=lambda x: x['hashtag_count'],
                                               reverse=True)
        # 만약 유저 검색일 경우
        else:
            # TODO 검색키워드가 닉네임 또는 이름에 포함되는지 객체를 10개만 뽑아냄
            users = User.objects.filter(
                Q(nickname__contains=search_box_value) | Q(name__contains=search_box_value)).order_by('nickname')[:10]
            # users를 그대로 쓰면 이메일만 나온다. 필요한 데이터만 뽑아서 리스트에 저장
            for user in users:
                autocomplete_user_list.append(dict(profile_image=user.profile_image,
                                                   nickname=user.nickname,
                                                   name=user.name))

        # 자동완성에는 해시태그와 유저 둘 다 필요하기 때문에 두 개의 리스트를 더해서 전달 해줌
        prioritize_list = autocomplete_user_list + autocomplete_hashtag_list

        data = {
            'prioritize_list': prioritize_list
        }

        json_data = json.dumps(data)
        return HttpResponse(json_data, content_type='application/json')


# 팔로우 클래스
class FollowerFeed(APIView):
    def get(self, request):
        # 세션유저 이메일
        email = request.session.get('email', None)
        # 세션 유저의 객체
        user_session = User.objects.filter(email=email).first()
        # 팔로우 스위치 버튼 여부
        is_checked = request.GET.get('is_checked', None)

        # 만약 팔로우 스위치 버튼 여부가 checked면 True
        if is_checked == 'checked':
            is_checked = True
        else:
            is_checked = False

        # 내가 팔로우한 유저의 이메일들을 뽑음
        following_email_list = Follow.objects.filter(follower=email)
        feed_list = []

        # 내가 팔로우한 유저의 피드를 가져오기 위한 작업
        for follow in following_email_list:
            # 내가 팔로우한 유저의 이메일을 통해 유저들의 피드 객체들을 가져옴
            follwing_feed = Feed.objects.filter(email=follow.following)
            # 내가 팔로우한 유저의 피드의 정보를 가져오기 위한 작업
            for feed in follwing_feed:
                user = User.objects.filter(email=feed.email).first()
                reply_object_list = Reply.objects.filter(feed_id=feed.id)
                reply_list = []

                # 해당 feed_id에 존재하는 해시태그들을 가져옴 ,해시태그 리스트 생성
                hashtag_object_list = Hashtag.objects.filter(feed_id=feed.id)
                hashtag_list = []

                # 내가 팔로우한 유저의 피드에 달린 댓글을 가져오기 위한 작업
                for reply in reply_object_list:
                    reply_user = User.objects.filter(email=reply.email).first()
                    reply_list.append(dict(reply_content=reply.reply_content,
                                           nickname=reply_user.nickname, profile_image=reply_user.profile_image))

                # 내가 팔로우한 유저의 피드에 달린 해시태그를 가져오기 위한 작업
                for hashtag in hashtag_object_list:
                    hashtag_feed = Feed.objects.filter(id=feed.id).first()
                    hashtag_list.append(dict(feed_id=hashtag_feed, content=hashtag.content))

                # 내가 팔로우한 유저의 피드들의 좋아요 수, 좋아요 여부, 북마크 여부
                like_count = Like.objects.filter(feed_id=feed.id).count()
                is_liked = Like.objects.filter(feed_id=feed.id, email=email).exists()
                is_marked = Bookmark.objects.filter(feed_id=feed.id, email=email).exists()
                feed_list.append(dict(id=feed.id,
                                      image=feed.image,
                                      content=feed.content,
                                      like_count=like_count,
                                      profile_image=user.profile_image,
                                      nickname=user.nickname,
                                      reply_list=reply_list,
                                      is_liked=is_liked,
                                      is_marked=is_marked,
                                      create_at=feed.create_at,
                                      hashtag_list=hashtag_list
                                      ))

        # 팔로우 스위치 버튼 url을 요청한 사용자에게 메인페이지와 각종 데이터를 전달
        return render(request, "astronaut/main.html",
                      context=dict(feeds=feed_list, user_session=user_session, is_checked=is_checked))


# 피드 수정시 이전 정보를 수정창에 불러오는 클래스
class FeedUpdateIMG(APIView):
    def get(self, request):
        # 서버로 전달된 수정될 피드id
        feed_id = int(request.GET.get('feed_id', None))
        # 수정될 피드를 객체로 뽑음
        feed = Feed.objects.filter(id=feed_id).first()
        # 피드 아이디를 통해 피드에 달린 해시태그 내용만 리스트형태로 뽑음
        hashtag_content_lists = list(Hashtag.objects.filter(feed_id=feed_id).values_list('content', flat=True))
        # 공백 제거
        hashtag_content_lists = list(filter(None, hashtag_content_lists))
        # 해시태그를 띄여쓰기로 구분
        hashtag_content = '#' + '#'.join(hashtag_content_lists)

        # 사용자로 보낼 데이터
        data = {
            'id': feed.id,
            'image': feed.image,
            'feed_content': feed.content,
            'hashtag_content': hashtag_content
        }

        json_data = json.dumps(data)
        # ajax를 이용해서 html 추가하거나 변경할려면 이런방식을 써야한다.
        return HttpResponse(json_data, content_type='application/json')
