<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>로그인</title>
<!-- 사용자 정의 css -->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/account/login_join.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/same_all.css">
<!-- 부트스트랩을 사용하기 위한 선언 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
</head>
<body>
	<!-- 배치를 위한 최상위 영역 -->
	<div id="root_div">
		<!-- 회원 가입 외부 테두리 -->
		<div class="login_border_outline">
			<!-- 로고 -->
			<img class="join_login_logo" src="${pageContext.request.contextPath}/server_images/maums.jpg"
				alt="로고">
			<!-- 설명란 -->
			<div class="greetings">친구들의 소식을 보려면 로그인하세요.</div>
			<!-- 회원가입시 유저 정보 전달 폼 -->
			<form action="/maums/login" method="post">
			<!-- 이메일 입력란 -->
            <div class="input_userData_area form-floating mb-3">
                <input id="input_eamil" type="text" name="email" class="input_userData form-control" placeholder="name@example.com">
				<label id="text_floating_label" for="input_eamil">이메일주소</label>
			</div>
			<!-- 비밀번호 입력란 -->
            <div class="input_userData_area form-floating mb-3">
                <input id="input_password" type="password" name="password" class="input_userData form-control" placeholder="password">
				<label id="text_floating_label" for="input_password">비밀번호</label>
			</div>
			
			<!-- 로그인 버튼 -->
        	<input class="log_join_btn" type="submit" value="로그인">
	</form>
		<!-- 회원가입 페이지로 이동 -->
		<div>계정이 없으신가요? <a href="join.jsp"><b>회원가입</b></a></div>
		</div>
	</div>
	
<!-- 부트스트랩을 사용하기 위한 선언 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
</body>
</html>