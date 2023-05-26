from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models


# custom user model 사용 시 UserManager 클래스와 create_user, create_superuser 함수가 정의되어 있어야 함
class UserManager(BaseUserManager):
    # 필수로 필요한 데이터를 선언
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


# Create your models here.
class User(AbstractBaseUser):
    """
        유저 프로파일 사진
        유저 닉네임     -> 화면에 표기되는 이름
        유저 이름       -> 실제 사용자 이름
        유저 이메일주소 -> 회원가입할때 사용하는 아이디
        유저 비밀번호 -> 디폴트 쓰자
    """
    profile_image = models.TextField()  # 프로필 이미지
    nickname = models.CharField(max_length=24, unique=True)
    name = models.CharField(max_length=24)
    email = models.EmailField(unique=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    # 실제로 유저를 선택하면 그 유저의 이름을 어떤 필드로 쓸거냐? -> 닉네임으로 설정
    USERNAME_FIELD = 'email'

    objects = UserManager()

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
    @property
    def is_staff(self):
        return self.is_admin

    # 테이블 명을 따로 설정
    class Meta:
        db_table = "User"
