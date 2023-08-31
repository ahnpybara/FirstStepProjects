// 피드 추가하기 메뉴 버튼을 눌렀을 때
$("#feed_upload_menu").click(function() {
	$(".modal_overlay").css({
		display: 'flex'
	});

	$(document.body).css({
		overflow: 'hidden'
	});
});

// 모달창 : 피드 닫기 버튼 클릭시
$("#modal_close_btn").click(function() {
	$(".modal_overlay").css({
		display: 'none'
	});
	$(document.body).css({
		overflow: 'auto'
	});

	$("#fileInput").val("");

	$(".modal_feed_image_area").css({
		backgroundImage: ""
	});

	$('#modal_feed_text_box').val("");
	$('#modal_feed_hashtag_box').val("");

	$(".image_upload_explain").css({ display: 'flex' });
	$("#image_upload_btn").css({ display: 'flex' });
});

// 모달창 : 피드 이미지 업로드 버튼 클릭시
$("#image_upload_btn").click(function() {
	$("#fileInput").click();
});

// 모달창 : 피드 이미지 영역을 내가 올린 이미지로 채우기
$("#fileInput").on('click', function() {
	// 클릭 시점에서 input 값 저장
	var val = $(this).val();

	$(this).on('change', function() {
		// 모달창 : 피드 이미지 영역을 내가 올린 이미지로 채우기
		$(".image_upload_explain").css({ display: 'none' });
		$("#image_upload_btn").css({ display: 'none' });

		// 사용자가 선택한 첫번째 파일을 가져옴
		var file = this.files[0];

		if (file) {
			// 파일읽기 도구인 FileReader 객체 생성
			var reader = new FileReader();

			// reader 객체가 파일 읽기를 다 끝내면 실행할 명령어들을 미리 정의!!
			reader.onload = function(e) {
				$(".modal_feed_image_area").css({
					//FileReader가 읽어온 URL 형식의 문자열을 배경으로 설정
					backgroundImage: "url(" + e.target.result + ")",
					borderBottomLeftRadius: "10px",
					overflow: "hidden",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "100%", 
				});
			}

			// 파일읽기 -> 다 읽으면 onload 함수가 실행
			reader.readAsDataURL(file);
		}
	}).blur(function() {
		// blur 발생 시(즉, focus를 잃는 경우. 여기서는 파일 선택창이 닫히는 경우)

		if ($(this).val() == val) {
			// 만약 input 값이 변하지 않았다면 (즉, 파일 선택 없이 닫혔다면)

			// 원하는 디스플레이 상태로 복원. 원래 display 상태에 맞게 조정하세요.
			$(".image_upload_explain").css({ display: 'flex' });
			$("#image_upload_btn").css({ display: 'flex' });

			$(this).off('change'); 	// change 이벤트 핸들러 제거. 다음 번 클릭 이벤트를 위해.
		}
	});
});

// 모달창 : 피드 업로드 버튼 클릭시
$("#feed_upload_btn").click(function() {
	$("#feedInput").click();
});