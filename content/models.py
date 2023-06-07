from django.db import models

# 피드 테이블
class Feed(models.Model):
    content = models.TextField()                            # 글내용
    image = models.TextField()                              # 피드에 업로드되는 이미지
    email = models.EmailField(default='')                   # 이메일
    create_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=20, default='')              # 카테고리 이름

# 좋아요 테이블
class Like(models.Model):
    feed_id = models.IntegerField(default=0)                # Feed id
    email = models.EmailField(default='')                   # 이메일


# 댓글 테이블
class Reply(models.Model):
    feed_id = models.IntegerField(default=0)                # Feed id
    email = models.EmailField(default='')                   # 이메일
    reply_content = models.TextField()                      # 댓글 내용


# 북마크 테이블
class Bookmark(models.Model):
    feed_id = models.IntegerField(default=0)                # Feed id
    email = models.EmailField(default='')                   # 이메일


# 팔로우 테이블
class Follow(models.Model):
    follower = models.EmailField(default='')                 # 팔로우 하는 유저 이메일
    following = models.EmailField(default='')                # 팔로우 당하는 유저 이메일


# 해시태그 테이블
class Hashtag(models.Model):
    feed_id = models.IntegerField(default=0)                   # Feed id
    content = models.TextField()                               # 해시태그 내용

