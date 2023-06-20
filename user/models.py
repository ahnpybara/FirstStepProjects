from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models


# 커스텀 유저 모델을 위한 헬퍼 클래스를 선언
class UserManager(BaseUserManager):
    # 일반 유저의 필수로 필요한 데이터를 선언
    def create_user(self, email, name, nickname, password):
        if not name:
            raise ValueError('Users must have an username')
        user = self.model(
            email=email,
            name=name,
            nickname=nickname,
            password=password
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    # python manage.py createsuperuser 사용 시 해당 함수가 사용됨
    def create_superuser(self, email, nickname, name, password):
        user = self.create_user(
            email=email,
            name=name,
            nickname=nickname,
            password=password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


# 유저 테이블
class User(AbstractBaseUser):
    """
        profile_image  ->  프로필 이미지
        nickname       ->  닉네임
        name           ->  실제 사용자 이름
        email          ->  회원가입할때 사용하는 아이디
        유저 비밀번호    ->  암호화를 위해 view에서 처리
        last_login     ->  마지막으로 로그인한 시간
        is_active      ->  유저의 활성화 여부
        is_admin       ->  유저가 슈퍼유저인지 여부
    """
    profile_image = models.TextField()
    nickname = models.CharField(max_length=24, unique=True)
    name = models.CharField(max_length=24)
    email = models.EmailField(unique=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    # 실제로 사용자를 식별하기 위한 필드를 설정
    USERNAME_FIELD = 'email'

    objects = UserManager()

    # 사용자 생성 시 반드시 입력되어야 하는 필드들을 설정
    REQUIRED_FIELDS = ['nickname', 'name']

    # 어드민 페이지에서 데이터를 제목을 어떻게 붙여줄 것인지 지정
    def __Str__(self):
        return f"{self.name} / {self.email} 님의 계정입니다"

    # 로그인 사용자의 특정 테이블의 crud 권한을 설정, perm table의 crud 권한이 들어간다.
    # admin일 경우 항상 True, 비활성 사용자(is_active=False)의 경우 항상 False
    # 일반적으로 선언만 해두고 건들지않는다
    def has_perm(self, perm, obj=None):
        return True

    # 로그인 사용자의 특정 app에 접근 가능 여부를 설정, app_label에는 app 이름이 들어간다.
    # admin일 경우 항상 True, 비활성 사용자(is_active=False)의 경우 항상 False
    # 일반적으로 선언만 해두고 건들지않는다
    def has_module_perms(self, app_label):
        return True

    # admin 권한 설정
    # 유저의 admin 사이트 접근 허용 여부를 판단하기 위함 기본값 default
    @property
    def is_staff(self):
        return self.is_admin

    # 테이블 명을 따로 설정
    class Meta:
        db_table = "User"
