from uuid import uuid4
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from Astronaut.settings import MEDIA_ROOT
from .models import Feed, Reply, Like, Bookmark, Hashtag, Follow
from user.models import User
import os

import json
from django.http import HttpResponse

from django.db.models import Q


# Main 클래스는 여러 테이블에서 데이터를 가져와 피드리스트 변수에 저장하고 main.html과
# main.html에서 피드를 사용자에게 보여주는데 필요한 피드리스트와 user 정보를 브라우저에게 보내는 클래스입니다.
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
        feed_list = []
        # 세션정보가 저장된 이메일을 필터링 조건으로 대입해서 유저테이블을 필터링을 진행 -> 결과를 user_session 변수에 저장
        user_session = User.objects.filter(email=email).first()
        # 세션에 이메일 정보가 있는데 그 이메일 주소가 우리 회원이 아닌경우 -> 로그인 페이지로 이동시킴
        if user_session is None:
            return render(request, "user/login.html")

        # 노션에 정리된 글 참고, 요약 main.html로 보낼 피드 리스트와 user 정보를 처리
        feed_object_list = Feed.objects.all().order_by('-id')

        # 05-29 유재우 : 필터링을 위해 추가(좋아요 순)
        if sort == 'likes':
            user_object_list = User.objects.all()
            like_count_list = []
            for feed in feed_object_list:
                like_count = Like.objects.filter(feed_id=feed.id).count()
                like_count_list.append([feed.id, like_count])
            like_count_list.sort(key=lambda x: (-x[1], x[0]))
            like_count_list = [i[0] for i in like_count_list]

            for like_count_list in like_count_list:
                feed_search_list = Feed.objects.filter(id=like_count_list)
                for feed in feed_search_list:
                    user = User.objects.filter(email=feed.email).first()
                    reply_object_list = Reply.objects.filter(feed_id=feed.id)
                    reply_list = []
                    for reply in reply_object_list:
                        reply_user = User.objects.filter(email=reply.email).first()
                        reply_list.append(dict(reply_content=reply.reply_content,
                                               nickname=reply_user.nickname, profile_image=reply_user.profile_image))
                    like_count = Like.objects.filter(feed_id=feed.id).count()
                    is_liked = Like.objects.filter(feed_id=feed.id, email=email).exists()
                    is_marked = Bookmark.objects.filter(feed_id=feed.id, email=email).exists()
                    hashtag_list = Hashtag.objects.filter(feed_id=feed.id)
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
        # 05-29 유재우 : 필터링 댓글 순
        elif sort == 'raply':
            user_object_list = User.objects.all()
            raply_count_list = []
            for feed in feed_object_list:
                raply_count = Reply.objects.filter(feed_id=feed.id).count()
                raply_count_list.append([feed.id, raply_count])
            raply_count_list.sort(key=lambda x: (-x[1], x[0]))
            raply_count_list = [i[0] for i in raply_count_list]

            for raply_count_list in raply_count_list:
                feed_search_list = Feed.objects.filter(id=raply_count_list)
                for feed in feed_search_list:
                    user = User.objects.filter(email=feed.email).first()
                    reply_object_list = Reply.objects.filter(feed_id=feed.id)
                    reply_list = []
                    for reply in reply_object_list:
                        reply_user = User.objects.filter(email=reply.email).first()
                        reply_list.append(dict(reply_content=reply.reply_content,
                                               nickname=reply_user.nickname, profile_image=reply_user.profile_image))
                    like_count = Like.objects.filter(feed_id=feed.id).count()
                    is_liked = Like.objects.filter(feed_id=feed.id, email=email).exists()
                    is_marked = Bookmark.objects.filter(feed_id=feed.id, email=email).exists()
                    hashtag_list = Hashtag.objects.filter(feed_id=feed.id)
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


        else:
            user_object_list = User.objects.all()

            for feed in feed_object_list:
                user = User.objects.filter(email=feed.email).first()
                # 정유진: 댓글의 2개만 가져온다.
                reply_object_list = Reply.objects.filter(feed_id=feed.id)[:2]
                reply_list = []
                hashtag_object_list = Hashtag.objects.filter(feed_id=feed.id)
                hashtag_list = []
                for reply in reply_object_list:
                    reply_user = User.objects.filter(email=reply.email).first()
                    reply_list.append(dict(reply_content=reply.reply_content,
                                           nickname=reply_user.nickname, profile_image=reply_user.profile_image,
                                           id=reply.id))
                    # 05-20 유재우 : 해시태그 추가
                for hashtag in hashtag_object_list:
                    hashtag_feed = Feed.objects.filter(id=feed.id).first()
                    hashtag_list.append(dict(feed_id=hashtag_feed, content=hashtag.content))
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

        # 안치윤 : 필터링을 거쳐서 나온 세션의 유저 정보가 담긴 user_session와 피드 리스트가 담긴 feed_list를 사전 형태로 클라이언트에게 보냄
        # 유재우 : 댓글삭제 및 수정을 위해 댓글 정보가 담긴 reply를 클라이언트에게 보냄
        return render(request, "astronaut/main.html",
                      context=dict(feeds=feed_list, user_session=user_session, user_object_list=user_object_list
                                   ))


# 피드를 업로드 할 때 서버로 넘어오는 데이터를 받아서 각 변수에 저장 후 출력
class UploadFeed(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 올라온 폼 데이터에서 파일을 꺼냄
        file = request.FILES['file']
        # uuid 값 생성
        uuid_name = uuid4().hex
        # 파일을 어디에 저장할 것 인지 설정
        save_path = os.path.join(MEDIA_ROOT, uuid_name)
        # 아래 작업을 거치면 media 폴더에 파일이 저장됨
        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        # 폼 데이터에서 파일을 제외한 나머지 일반 데이터를 꺼냄
        uuid_name = uuid_name
        content = request.data.get('content')
        email = request.session.get('email', None)

        # 05-21 유재우 : 해시태그
        hashtags_content = request.data.get('hashtags_content')
        hashtags_content = hashtags_content.replace(" ", "");
        hashtags_content = hashtags_content.replace("\n", "");
        # 05-21 유재우 : 해시태그를 띄여쓰기로 구분
        hashtags_list = hashtags_content.split("#")
        # 만일 첫번째 글자에 #이 안들어 갔을 경우 값을 지움
        if (hashtags_content.find("#") != 0):
            del hashtags_list[0]

        hashtags_lists = []

        # 05-21 유재우 : 중복 제거
        # 05-25 유재우 : set-list로하면 랜덤 배정이 되어 for문으로 바꿈
        for value in hashtags_list:
            if value not in hashtags_lists:
                hashtags_lists.append(value)

        # 05-21 유재우 : #으로 구분 하였기에 #앞에 아무것도 없는데 저장 되어서 그걸 삭제 하는 부분
        hashtags_list = list(filter(None, hashtags_lists))

        # 05-21 유재우 : 저장 되는 feedid값을 강제하기 위해 추가
        if (Feed.objects.count() == 0):
            feed_Max_id = 1
        else:
            feed_Max = Feed.objects.order_by('-id').first()
            feed_Max_id = feed_Max.id + 1

        # 전달 받은 데이터를 기반으로 Feed 테이블에 새로운 튜플 생성
        Feed.objects.create(image=uuid_name, content=content, email=email, id=feed_Max_id)

        for hashtags_list in hashtags_list:
            Hashtag.objects.create(content=hashtags_list, feed_id=feed_Max_id)
        # 성공적으로 전달 되었다는 응답을 보냄
        return Response(status=200)


# 사용자에게 프로필을 보여주기 위한 profile.html과 profile.html에 필요한 user 정보를 보내주는 클래스
class Profile(APIView):
    # noinspection PyMethodMayBeStatic
    def get(self, request):
        # 세션에 저장된 이메일을 request 요청으로 가져와서 변수 email에 저장
        email = request.session.get('email', None)

        # 세션에 이메일 정보가 없는경우 -> 로그인을 하지않고 메인페이지에 접속한 경우 -> 로그인 페이지로 이동시킴
        if email is None:
            return render(request, "user/login.html")

        # 세션정보가 저장된 이메일을 필터링 조건으로 대입해서 유저테이블을 필터링을 진행 -> 결과를 user 변수에 저장
        user = User.objects.filter(email=email).first()

        # 세션에 이메일 정보가 있는데 그 이메일 주소가 우리 회원이 아닌경우 -> 로그인 페이지로 이동시킴
        if user is None:
            return render(request, "user/login.html")

        # 프로필 화면에서 게시글 조회할 때 필요한 리스트를 구하는 과정 (노션참고)
        # 최근에 올린 게시물이 앞에 가도록 정렬기능 추가
        # 안치윤 : 작성 게시물 개수 추가
        user_feed_count = Feed.objects.filter(email=email).count()
        feed_list = Feed.objects.filter(email=email).order_by('-id')
        # !!!
        like_list = list(Like.objects.filter(email=email).values_list('feed_id', flat=True))
        like_feed_list = Feed.objects.filter(id__in=like_list).order_by('-id')
        bookmark_list = list(Bookmark.objects.filter(email=email).values_list('feed_id', flat=True))
        bookmark_feed_list = Feed.objects.filter(id__in=bookmark_list).order_by('-id')
        # 안치윤 : 팔로우 숫자 추가
        follower_count = Follow.objects.filter(follower=email).count()
        following_count = Follow.objects.filter(following=email).count()

        # 내 게시물의 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        feed_count_list = []
        for feed in feed_list:
            # 좋아요 수 확인.
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수 확인.
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            feed_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))

        # 좋아요의 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        like_count_list = []
        for feed in like_feed_list:
            # 좋아요 수 확인.
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수 확인.
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            like_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))
        # 북마크의 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        bookmark_count_list = []
        for feed in bookmark_feed_list:
            # 좋아요 수 확인.
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수 확인.
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            bookmark_count_list.append(dict(id=feed.id,
                                            like_count=like_count,
                                            reply_count=reply_count))

        # 프로플 화면에서 게시글을 조회할 때 필요한 리스트들을 profile.html로 전달
        # 전달할 카운트 리스트(count_list) 추가.
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


# 서버로 전달된 댓글 내용과 댓글을 입력한 사용자의 이메일 받아서 각 변수에 넣고 댓글 테이블에 저장
class UploadReply(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        # 서버로 전달된 Json 형식의 파일에서 데이터를 꺼내서 각 변수에 저장
        feed_id = request.data.get('feed_id', None)
        reply_content = request.data.get('reply_content', None)
        # 댓글은 여러 사람이 작성하므로 댓글을 게시한 사용자들이 누군지 구분이 필요하기 때문에 세션 정보에 저장된 이메일을 이용해야 합니다.
        email = request.session.get('email', None)
        user = User.objects.filter(email=email).first()

        # 서버로 전달된 데이터를 토대로 Reply 테이블에 새로운 튜플을 생성
        reply_id = Reply.objects.create(feed_id=feed_id, reply_content=reply_content, email=email).id

        # 성공적으로 전달이 되었다는 응답을 줌
        return Response(status=200, data=dict(user_nickname=user.nickname,
                                              user_profile_image=user.profile_image,
                                              user_reply_id=reply_id))


# 특정 피드에 좋아요가 되면 좋아요 여부와 피드id를 받아서 변수에 넣고 간단한 조건문을 실행 후 좋아요 테이블에 저장
class ToggleLike(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        feed_id = request.data.get('feed_id', None)
        favorite_color = request.data.get('favorite_color', True)
        email = request.session.get('email', None)

        # 해당 피드에 현재 세션의 사용자가 좋아요를 누른 정보가 있다면 뽑아서 like에 저장
        like = Like.objects.filter(feed_id=feed_id, email=email).first()

        # 뽑은 레코드의 is_like 필드 값을 토글시키고 저장
        if like is not None:
            like.delete()
        # 현재 세션의 사용자가 해당 피드에 좋아요를 한 흔적이 없다면 이 사용자가 해당 피드에는 좋아요를 눌렀다는 정보를 테이블에 추가
        else:
            Like.objects.create(feed_id=feed_id, email=email)

        # 비동기 좋아요 수
        async_like_count = Like.objects.filter(feed_id=feed_id).count()
        print(async_like_count)

        data = {
            'async_like_count': async_like_count
        }

        json_data = json.dumps(data)
        return HttpResponse(json_data, content_type='application/json')


# 특정 피드가 북마크 되면 북마크 여부와 피드id를 받아서 변수에 넣고 간단한 조건문을 실행 후 북마크 테이블에 저장
class ToggleBookmark(APIView):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        feed_id = request.data.get('feed_id', None)
        bookmark_color = request.data.get('bookmark_color', True)
        email = request.session.get('email', None)

        # 현재 세션의 사용자가 해당 피드에 북마크를 누른 정보가 있다면 뽑아서 bookmark에 저장
        bookmark = Bookmark.objects.filter(feed_id=feed_id, email=email).first()

        # 뽑은 레코드의 is_marked 필드 값을 토글시키고 저장
        if bookmark is not None:
            bookmark.delete()
        # 현재 세션의 사용자가 해당 피드에 북마크를 한 흔적이 없다면 이 사용자가 해당 피드에는 북마크를 눌렀다는 정보를 테이블에 추가
        else:
            Bookmark.objects.create(feed_id=feed_id, email=email)

        return Response(status=200)


# 안치윤 : 댓글에서 닉네임 클릭시 해당 사용자의 프로필로 이동 api
class ReplyProfile(APIView):
    def get(self, request):
        # 사용자의 닉네임을 받아옴
        nickname = request.GET.get('user_nickname')

        # 사용자 세션을 받아옴. nav부분의 프로필 사진을 얻기 위해서.
        email_session = request.session.get('email', None)

        # 세션에 이메일 정보가 없는경우 -> 로그인을 하지 않고 메인페이지에 접속했다는 뜻 -> 로그인 페이지로 이동시킴
        if email_session is None:
            return render(request, "user/login.html")

        # 세션정보가 저장된 이메일을 필터링 조건으로 대입해서 유저테이블을 필터링을 진행 -> 결과를 user_session 변수에 저장
        user_session = User.objects.filter(email=email_session).first()
        # 세션에 이메일 정보가 있는데 그 이메일 주소가 우리 회원이 아닌경우 -> 로그인 페이지로 이동시킴
        if user_session is None:
            return render(request, "user/login.html")

        # 닉네임을 가지고 유저 테이블에서 필터링한 결과를 user에 저장
        user = User.objects.filter(nickname=nickname).first()
        # 프로플 화면에서 게시글을 조회할 때 필요한 리스트들을 profile.html로 전달
        email = user.email
        # 최근에 올린 게시물이 앞에 가도록 정렬기능 추가
        # 안치윤 : 내가 작성한 게시글의 숫자
        user_feed_count = Feed.objects.filter(email=email).count()
        feed_list = Feed.objects.filter(email=email).order_by('-id')
        like_list = list(Like.objects.filter(email=email).values_list('feed_id', flat=True))
        like_feed_list = Feed.objects.filter(id__in=like_list).order_by('-id')
        bookmark_list = list(Bookmark.objects.filter(email=email).values_list('feed_id', flat=True))
        bookmark_feed_list = Feed.objects.filter(id__in=bookmark_list).order_by('-id')
        is_follow = Follow.objects.filter(follower=email_session, following=email).exists()
        # 안치윤 : 팔로우 숫자 구함
        follower_count = Follow.objects.filter(follower=email).count()
        following_count = Follow.objects.filter(following=email).count()

        # 내 게시물의 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        feed_count_list = []
        for feed in feed_list:
            # 좋아요 수 확인.
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수 확인.
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            feed_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))

        # 좋아요의 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        like_count_list = []
        for feed in like_feed_list:
            # 좋아요 수 확인.
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수 확인.
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            like_count_list.append(dict(id=feed.id,
                                        like_count=like_count,
                                        reply_count=reply_count))
        # 북마크의 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
        bookmark_count_list = []
        for feed in bookmark_feed_list:
            # 좋아요 수 확인.
            like_count = Like.objects.filter(feed_id=feed.id).count()
            # 댓글 수 확인.
            reply_count = Reply.objects.filter(feed_id=feed.id).count()
            bookmark_count_list.append(dict(id=feed.id,
                                            like_count=like_count,
                                            reply_count=reply_count))

        # 프로플 화면에서 게시글을 조회할 때 필요한 리스트들을 profile.html로 전달
        # 전달할 카운트 리스트(count_list) 추가.
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

    # 안치윤 : 팔로우는 내 프로필 페이지가 아닌 다른 사용자의 프로필 페이지에 접속했을 때 가능한 것이므로 ReplyProfile 클래스에 post 함수로 추가
    def post(self, request):
        # 팔로우를 하려는 유저
        user_follower = request.data.get('session_user_email', None)
        # 팔로우를 당하는 유저
        user_following = request.data.get('user_email', None)
        # 팔로우를 한 내 정보와 팔로우를 당한 상대 정보가 Follow 테이블에 있는지 조회
        follow = Follow.objects.filter(follower=user_follower, following=user_following).first()

        if follow is not None:
            follow.delete()
        else:
            Follow.objects.create(follower=user_follower, following=user_following)

        return Response(status=200)


# 05-09 유재우 : 피드지우기
class RemoveFeed(APIView):
    def post(self, request):
        feed_id = request.data.get('feed_id')
        feeds = Feed.objects.filter(id=feed_id).first()

        reply = Reply.objects.filter(feed_id=feed_id)
        reply.delete()
        hashtags = Hashtag.objects.filter(feed_id=feeds.id)
        hashtags.delete()
        # 정유진: 좋아요, 북마크 테이블에서 삭제
        like = Like.objects.filter(feed_id=feeds.id)
        like.delete()
        bookmark = Bookmark.objects.filter(feed_id=feeds.id)
        bookmark.delete()
        feeds.delete()

        return Response(status=200)


# 안치윤 : 검색기능
class SearchFeed(APIView):
    def get(self, request):
        searchKeyword = request.GET.get("search", "")
        print(searchKeyword)
        email = request.session.get('email', None)
        user_session = User.objects.filter(email=email).first()
        user_object_list = User.objects.filter(nickname__contains=searchKeyword).order_by('-id')
        # 해시태그 검색
        if (searchKeyword.find("#") == 0):
            text = searchKeyword.replace("#", "");

            hashtag_content_lists = list(
                Hashtag.objects.filter(content=text).values_list('feed_id', flat=True))

            feed_all_count = Hashtag.objects.filter(content=text).count()

            is_exist_feed = Hashtag.objects.filter(content=text).exists()

            # todo 검새결과가 없을경우 일단 메인 페이지로 이동시킴 나중에 페이지를 만들어서 제공할 예정
            if not is_exist_feed:
                return render(request, 'astronaut/main.html')

            feed_main_image = 1
            feed_search_list = []
            feed_count_list = []
            for hashtag_feed_id in hashtag_content_lists:
                feed_hashtag_list = Feed.objects.filter(id=hashtag_feed_id)
                # TODO 불필요한 반복문이 발생 하지만 방법이 생각이 안남... 아래 한줄
                feed_main_image = Feed.objects.filter(id=hashtag_feed_id).first()
                for feed in feed_hashtag_list:
                    feed_search_list.append(dict(id=feed.id, image=feed.image))
                    like_count = Like.objects.filter(feed_id=feed.id).count()

                    # 댓글 수 확인.
                    reply_count = Reply.objects.filter(feed_id=feed.id).count()
                    feed_count_list.append(dict(id=feed.id,
                                                like_count=like_count,
                                                reply_count=reply_count))
        else:
            feed_search_list = Feed.objects.filter(content__contains=searchKeyword).order_by('-id')
            feed_main_image = Feed.objects.filter(content__contains=searchKeyword).first()

            feed_all_count = Feed.objects.filter(content__contains=searchKeyword).count()

            is_exist_feed = Feed.objects.filter(content__contains=searchKeyword).exists()

            # todo 검새결과가 없을경우 일단 메인 페이지로 이동시킴 나중에 페이지를 만들어서 제공할 예정
            if not is_exist_feed:
                return render(request, 'astronaut/main.html')

            # 내 게시물의 각 게시물들의 좋아요와 댓글 수를 조회할 때 필요한 리스트를 구하는 과정
            feed_count_list = []
            for feed in feed_search_list:
                # 좋아요 수 확인.
                like_count = Like.objects.filter(feed_id=feed.id).count()
                # 댓글 수 확인.
                reply_count = Reply.objects.filter(feed_id=feed.id).count()
                feed_count_list.append(dict(id=feed.id,
                                            like_count=like_count,
                                            reply_count=reply_count))

        # 안치윤 : 필터링을 거쳐서 나온 세션의 유저 정보가 담긴 user_session와 피드 리스트가 담긴 feed_list를 사전 형태로 클라이언트에게 보냄
        return render(request, "astronaut/search.html",
                      context=dict(feed_count_list=feed_count_list, user_session=user_session,
                                   user_object_list=user_object_list, feed_search_list=feed_search_list,
                                   searchKeyword=searchKeyword, feed_main_image=feed_main_image,
                                   feed_all_count=feed_all_count))


# 05-12 유재우 : 댓글 지우기
class RemoveReply(APIView):
    def post(self, request):
        reply_id = request.data.get('reply_id')

        replys = Reply.objects.filter(id=reply_id)

        replys.delete()

        return Response(status=200)


# 05-12 유재우 : 피드 수정
# 05-23 유재우 : 해시태그도 수정 가능하게 수정
class UpdateFeed(APIView):
    def post(self, request):
        hashtag_content = request.data.get('hashtag_content')
        content = request.data.get('content')
        feed_id = request.data.get('feed_id')
        # 05-21 유재우 : 해시태그
        hashtags = Hashtag.objects.filter(feed_id=feed_id)
        hashtags.delete()
        hashtag_content = hashtag_content.replace(" ", "");
        hashtag_content = hashtag_content.replace("\n", "");
        # 05-21 유재우 : 해시태그를 #으로 구분
        hashtags_list = hashtag_content.split("#")
        # 만일 첫번째 글자에 #이 안들어 갔을 경우 값을 지움
        if (hashtag_content.find("#") != 0):
            del hashtags_list[0]

        # 05-21 유재우 : 중복 제거
        hashtags_list = set(hashtags_list)
        hashtags_list = list(hashtags_list)

        # 05-21 유재우 : 공백 제거
        hashtags_list = list(filter(None, hashtags_list))

        for hashtags_list in hashtags_list:
            Hashtag.objects.create(content=hashtags_list, feed_id=feed_id)

        feed = Feed.objects.filter(id=feed_id)

        feed.update(id=feed_id, content=content)

        return Response(status=200)


# 05-12 유재우 : 댓글 수정
class UpdateReply(APIView):
    def post(self, request):
        content = request.data.get('content')
        reply_id = request.data.get('reply_id')

        reply = Reply.objects.filter(id=reply_id)

        reply.update(id=reply_id, reply_content=content)

        return Response(status=200)


# 정유진" 하나의 게시물을 모달로 띄워줄 때 필요한 데이터들을 보내준다.
class FeedModal(APIView):
    def get(self, request):
        # 받은 값은 문자열이니 정수로 변환
        feed_id = int(request.GET.get('feed_id', None))
        email = request.session.get('email', None)

        # 정유진: 해당 피드의 정보. 게시물의 이미지,
        feed_modal = Feed.objects.filter(id=feed_id).first()

        # 정유진: 게시물 작성자 정보. 이메일. 닉네임. 프로필 이미지.
        feed_modal_writer = User.objects.filter(email=feed_modal.email).first()

        # 정유진 : 해시테그
        feed_modal_hashtag_object_list = Hashtag.objects.filter(feed_id=feed_id)
        hashtag_list = []
        for hashtag in feed_modal_hashtag_object_list:
            hashtag_list.append(hashtag.content)

        # 정유진: 게시물 댓글 리스트 정보. 이메일. 프로필 이미지
        feed_modal_reply_object_list = Reply.objects.filter(feed_id=feed_id)

        reply_list = []
        for reply in feed_modal_reply_object_list:
            reply_user = User.objects.filter(email=reply.email).first()
            reply_list.append(dict(reply_content=reply.reply_content,
                                   nickname=reply_user.nickname,
                                   profile_image=reply_user.profile_image))
        like_count = Like.objects.filter(feed_id=feed_modal.id).count()
        is_liked = Like.objects.filter(feed_id=feed_modal.id, email=email).exists()
        is_marked = Bookmark.objects.filter(feed_id=feed_modal.id, email=email).exists()
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
        # ajax를 이용해서 html 추가하거나 변경할려면 이런방식을 써야한다.
        return HttpResponse(json_data, content_type='application/json')


# 정유진: 자동완성 기능에 필요한 데이터를 찾아서 보내준다.
class Autocomplete(APIView):
    def get(self, request):
        search_box_value = request.GET.get('search_box_value', None)

        autocomplete_user_list = []
        autocomplete_hashtag_list = []
        prioritize_list = []

        if '#' in search_box_value:
            search_box_value = search_box_value.replace("#", "")
            hashtag_content_lists = Hashtag.objects.filter(content__contains=search_box_value).distinct().values_list(
                'content', flat=True)[:10]

            for hashtag in hashtag_content_lists:
                # 정유진: 해당 해시태그가 포함된 게시글 수. 같은 게시물에 같은 해시태그는 미포함.
                hashtag_count = Hashtag.objects.filter(content=hashtag).distinct().values_list('feed_id',
                                                                                               flat=True).count()
                autocomplete_hashtag_list.append(dict(content=hashtag,
                                                      hashtag_count=hashtag_count))

            # 정유진: 게시물 수로 정렬.
            autocomplete_hashtag_list = sorted(autocomplete_hashtag_list, key=lambda x: x['hashtag_count'],
                                               reverse=True)
        else:
            users = User.objects.filter(
                Q(nickname__contains=search_box_value) | Q(name__contains=search_box_value)).order_by('nickname')[:10]
            # 정유진: users를 그대로 쓰면 이메일만 나온다. 필요한 데이터만 뽑아서 리스트에 저장
            for user in users:
                autocomplete_user_list.append(dict(profile_image=user.profile_image,
                                                   nickname=user.nickname,
                                                   name=user.name))

        prioritize_list = autocomplete_user_list + autocomplete_hashtag_list

        data = {
            'prioritize_list': prioritize_list
        }

        json_data = json.dumps(data)
        return HttpResponse(json_data, content_type='application/json')


# 팔로우한 유저들의 게시글을 보여주기 위한 뷰
class FollowerFeed(APIView):
    def get(self, request):
        # 세션유저 이메일
        email = request.session.get('email', None)
        user_session = User.objects.filter(email=email).first()
        is_checked = request.GET.get('is_checked', None)

        if is_checked == 'checked':
            is_checked = True
        else:
            is_checked = False

        following_email_list = Follow.objects.filter(follower=email)
        feed_list = []

        for follow in following_email_list:
            follwing_feed = Feed.objects.filter(email=follow.following)
            for feed in follwing_feed:
                user = User.objects.filter(email=feed.email).first()
                reply_object_list = Reply.objects.filter(feed_id=feed.id)
                reply_list = []
                for reply in reply_object_list:
                    reply_user = User.objects.filter(email=reply.email).first()
                    reply_list.append(dict(reply_content=reply.reply_content,
                                           nickname=reply_user.nickname, profile_image=reply_user.profile_image))
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
                                      create_at=feed.create_at
                                      ))

        return render(request, "astronaut/main.html",
                      context=dict(feeds=feed_list, user_session=user_session, is_checked=is_checked))


# 05-23 유재우 : 피스수정시 이미지 보이게 하는 부분
class FeedUpdateIMG(APIView):
    def get(self, request):
        feed_id = int(request.GET.get('feed_id', None))
        feed_modal = Feed.objects.filter(id=feed_id).first()
        hashtag_content_lists = list(Hashtag.objects.filter(feed_id=feed_id).values_list('content', flat=True))
        hashtag_content_lists = list(filter(None, hashtag_content_lists))
        # 05-21 유재우 : 해시태그를 띄여쓰기로 구분
        hashtag_content = '#' + '#'.join(hashtag_content_lists)

        data = {
            'id': feed_modal.id,
            'image': feed_modal.image,
            'feed_content': feed_modal.content,
            'hashtag_content': hashtag_content
        }

        json_data = json.dumps(data)
        # ajax를 이용해서 html 추가하거나 변경할려면 이런방식을 써야한다.
        return HttpResponse(json_data, content_type='application/json')
