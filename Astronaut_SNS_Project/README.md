# Astronaut_SNS_Project : 편의성이 보완된 인스타그램

프로젝트에 대한 상세한 내용은 [여기에서 프로젝트 PPT를 확인](https://drive.google.com/file/d/1Gmdw3Ck8y76JJo2a4wKFJAAaWwMUcd3Q/view?usp=sharing)하세요.

---

## 실행

python 3.7 이상 버전 설치 후

```
# 가상환경 생성 
python -m venv venv

# 가상환경 실행
source ./venv/Scripts/activate

# 필요 package 설치
pip install -r requirements.txt

# migrate 명령어로 DB 생성
python manage.py makemigrations
python manage.py migrate

# 서버 실행
python manage.py runserver

# 브라우져로 접속
http://127.0.0.1:8000/main/
```
