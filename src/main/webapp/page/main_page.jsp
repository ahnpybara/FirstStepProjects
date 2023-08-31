<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="dto.AccountDTO"%>
<%@ page import="java.util.List"%>
<%@ page import="dto.FeedListDTO"%>

<%
//세션 유저 객체 가져오기
AccountDTO user = (AccountDTO) session.getAttribute("sessionUser");
if (user == null) {
	response.sendRedirect("/maums/page/account/login.jsp");
}

// 메인에 가져올 피드 리스트 가져오기
List<FeedListDTO> list = (List<FeedListDTO>) request.getAttribute("feed_list");
%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>메인화면</title>

<!-- 사용자 정의 css -->
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/css/main_page/main_feed.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/css/main_page/main_follow_recommend.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/css/same_all.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/css/main_page/feed_upload_modal.css">

<!-- 부트스트랩을 사용하기 위한 선언 -->
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
	crossorigin="anonymous">

<!-- 구글 머리티얼 심볼 -->
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

</head>
<body>
	<!-- 네비바 -->
	<div class="side_navbar">
		<!-- 로고 -->
		<img class="navbar_logo"
			src="${pageContext.request.contextPath}/server_images/maums.jpg"
			alt="로고">
		<!-- 네비바 메뉴들 -->
		<a href="#home">
			<div class="navbar_menu_pos">
				<span class="material-symbols-outlined">home</span>
				<div class="navbar_menu_text">홈</div>
			</div>
		</a> 
		<a href="#search">
			<div class="navbar_menu_pos">
				<span class="material-symbols-outlined">search</span>
				<div class="navbar_menu_text">검색</div>
			</div>
		</a> 
		<a href="#send">
			<div class="navbar_menu_pos">
				<span class="material-symbols-outlined">send</span>
				<div class="navbar_menu_text">메시지</div>
			</div>
		</a> 
		<a id="feed_upload_menu" href="#add">
			<div class="navbar_menu_pos">
				<span class="material-symbols-outlined">add_box</span>
				<div class="navbar_menu_text">피드추가</div>
			</div>
		</a> 
		<a href="#settings">
			<div class="navbar_menu_pos">
				<span class="material-symbols-outlined">settings</span>
				<div class="navbar_menu_text">설정</div>
			</div>
		</a> 
		<a href="#favorite">
			<div class="navbar_menu_pos">
				<span class="material-symbols-outlined">favorite</span>
				<div class="navbar_menu_text">좋아요</div>
			</div>
		</a> 
		<a href="#logout">
			<div class="navbar_menu_pos">
				<span class="material-symbols-outlined">logout</span>
				<div class="navbar_menu_text">로그아웃</div>
			</div>
		</a>
	</div>

	<!-- 메인 콘텐츠 영역(피드와 팔로우추천) -->
	<div class="main_root_content">
		<!-- 메인화면 피드가 보여질 영역  -->
		<div class="main_feed_area">
			<!-- 메인화면 피드 테두리  -->
			<%
			if (list != null) {
				for (FeedListDTO feed : list) {
			%>
			<div class="main_feed_outline">
				<!-- 메인 피드 상단부분 -->
				<div class="main_feed_Top">
					<div class="main_feed_user_profile">
						<div class="main_feed_user_profile_image_box">
							<img class="main_feed_user_profile_image"
								src="${pageContext.request.contextPath}/images/<%= feed.getFeed_image()%>"
								alt="프로필">
						</div>
						<div class="main_feed_user_name"><%=feed.getName()%></div>
					</div>
					<!-- 메인 피드 수정 삭제 드롭다운 메뉴-->
					<div class="main_feed_update_menu">
						<span class="drop_menu material-symbols-outlined">more_horiz</span>
					</div>
				</div>
				<!-- 피드 이미지 -->
				<div>
					<img class="main_feed_image"
						src="${pageContext.request.contextPath}/images/<%= feed.getFeed_image()%>"
						alt="피드이미지">
				</div>
				<!-- 피드 좋아요 북마크 영역 -->
				<div class="main_feed_icon_area">
					<div>
						<span class="main_feed_icon material-symbols-outlined">favorite</span>
					</div>
					<div>
						<span class="main_feed_icon material-symbols-outlined">bookmark</span>
					</div>
				</div>
				<!-- 피드 좋아요 수 -->
				<div class="main_feed_like_count">
					이 게시글을 <b>100명</b>이 좋아합니다.
				</div>
				<!-- 피드 작성시간 -->
				<div class="main_feed_time">2023년 08월 26일</div>
				<!-- 피드 글내용 -->
				<div class="main_feed_text_content">
					<div class="main_feed_user_name"><%=feed.getName()%></div>
					<div><%=feed.getFeed_content()%></div>
				</div>
				<!-- 피드 댓글 -->
				<div class="main_feed_reply">댓글 7개 모두보기</div>
				<!-- 피드 댓글 입력창 -->
				<form class="main_feed_reply_text_area" action="" method="post">
					<input class="main_feed_reply_text_box" type="text" name="reply"
						placeholder=" 댓글 입력"><br> <input
						class="main_feed_reply_upload_btn" type="submit" value="입력">
				</form>
			</div>
			<%
			}
			}
			%>
		</div>

		<!-- 메인화면 세션 유저 프로필 및 팔로우 추천 영역 -->
		<div class="main_follow_recommend_outline">
			<!-- 메인 세션 유저 프로필 영역 -->
			<div class="main_user_profile">
				<div class="main_user_profile_image_box">
					<img class="main_user_profile_image"
						src="${pageContext.request.contextPath}/server_images/default_profile.jpg"
						alt="프로필">
				</div>
				<div class="main_user_nick_name_area">
					<div class="main_user_name"><%=user.getName()%></div>
					<div class="main_user_nickname"><%=user.getNickname()%></div>
				</div>
			</div>
			<!-- 메인 화면의 팔로우 추천 영역 -->
			<div class="main_follow_recommend_intro_area">
				<div class="main_follow_recommend_text">회원님을 위한 추천</div>
				<div class="main_follow_recommend_all_btn">모두보기</div>
			</div>
			<div class="main_follow_recommend_list">
				<!-- 메인 화면의 팔로우 추천 유저 프로필 영역 -->
				<div class="main_user_profile">
					<div class="main_follow_recommend_profile_image_box">
						<img class="main_user_profile_image"
							src="${pageContext.request.contextPath}/server_images/<%=user.getProfile_image() %>"
							alt="프로필">
					</div>
					<div class="main_user_nick_name_area">
						<div class="main_follow_recommend_user_name">안치윤</div>
						<div class="main_follow_recommend_user_nickname">ahnchi0807</div>
					</div>
				</div>
				<!-- 메인 화면 팔로우 버튼 -->
				<div class="main_follow_btn">팔로우</div>
			</div>
		</div>
	</div>

	<!-- 피드 업로드 모달창 -->
	<div class="modal_overlay">
		<!-- 모달창 -->
		<div class="modal_window">
			<!-- 모달창 상단 부분 -->
			<div class="modal_window_top">
				<div class="modal_window_top_nbsp">&nbsp;</div>
				<div>새 피드 추가하기</div>
				<div>
					<span id="modal_close_btn" class="material-symbols-outlined">close</span>
				</div>
			</div>
			<!-- 모달창 : 사진과 피드 내용 작성 영역 -->
			<div class="modal_feed_upload_area">
				<!-- 모달창 : form 태그 -->
				<form id="modal_feed_upload_form" action="/maums/feedUpload"
					method="POST" enctype="multipart/form-data">
					<!-- 모달창 : 이미지 업로드 영역 -->
					<div class="modal_feed_image_area">
						<div class="modal_feed_image_upload_area">
							<div class="image_upload_explain">사진 추가 버튼을 클릭 하세요</div>
							<button id="image_upload_btn" type="button"
								class="btn btn-primary">사진찾기</button>
						</div>
						<input type="file" id="fileInput" name="feed_image">
					</div>
					<!-- 모달창 : 텍스트 업로드 영역 -->
					<div class="modal_feed_text_area">
						<div class="modal_feed_text_box_area">
							<textarea id="modal_feed_text_box" name="feed_text"
								placeholder="글 내용을 입력하세요"></textarea>
						</div>
						<div class="modal_feed_hashtag_box_area">
							<textarea id="modal_feed_hashtag_box" name="feed_hashtag"
								placeholder="해시태그를 입력하세요"></textarea>
						</div>
						<button id="feed_upload_btn" type="button" class="btn btn-primary">공유</button>
						<input id="feedInput" type="submit" value="Submit">
					</div>
				</form>
			</div>
		</div>
	</div>


	<!-- JQuery 이용하기 위한 선언 -->
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

	<!-- 부트스트랩을 사용하기 위한 선언 -->
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
		crossorigin="anonymous"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"
		integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB"
		crossorigin="anonymous"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"
		integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13"
		crossorigin="anonymous"></script>

	<!-- 사용자 정의 스크립트 -->
	<script
		src="${pageContext.request.contextPath}/js/main_page/main_feed_upload.js"></script>

</body>
</html>