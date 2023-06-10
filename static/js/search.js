// 팔로우 버튼 및 기능 구현
$('#user_follow_btn').click(function (event) {
    // 팔로우를 하는 사람의 이메일 -> 팔로우 하는 사람은 자기 자신이므로 세션 정보를 가져와야 함
    let session_user_email = document.getElementById("user_follow_btn").getAttribute("user_session_email");
    // 팔로우 당하는 사람의 이메일
    let user_email = document.getElementById("user_follow_btn").getAttribute("user_email");
    // 이벤트가 발생한 태그의 id를 가져옴
    let follow_id = event.target.id;
    // 팔로우 버튼의 글 내용으로 팔로우 여부를 따지기 위해서 가져옴
    let is_followed = $.trim($('#' + follow_id).html());

    // 만약 팔로우 버튼의 글 내용이 팔로우일 경우 -> css토글
    if (is_followed == '팔로우') {
        $('#' + follow_id).html('언팔로우');
        $(this).css({
            width: '90px',
            background: 'gray',
            border: 'none',
        })
    } else { // 만약 팔로우 버튼의 글 내용이 언팔로우일 경우 -> css토글
        $('#' + follow_id).html('팔로우');
        $(this).css({
            width: '74px',
            background: 'rgb(0, 149, 246)',
            border: 'none',
        })

    }
    // 서버로 보낼 데이터 (json)
    $.ajax({
        url: "/user/follow",
        data: {
            session_user_email: session_user_email,
            user_email: user_email,
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
        }
    });
});

// 내가 쓴 게시물 보기 버튼 이벤트 처리
$("#button_feed_list").click(function (event) {
    // 프로필 화면의 내 게시물 버튼 활성화 밑줄 표시
    $('#button_feed_list').css({
        borderTopStyle: "solid",
        color: "black"
    });
    // 프로필 화면의 좋아요 버튼 비활성화 표시
    $('#button_feed_like_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });
    // 프로필 화면의 북마크 버튼 비활성화 표시
    $('#button_feed_bookmark_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });

    // 검색 키워드를 가져와서 전달 (최신 순으로 검색)
    let search = $.trim($('.search_keyword').html());
    let show_method = document.getElementById('button_feed_list').getAttribute("show_method_recent");
    console.log(show_method);
    // 해시태그 검색인지 일반 검색어 검색인지 구분하기 위해서 #의 위치를 구함
    let is_hashtag = search.indexOf('#');
    // #을 제거함 검색어를 서버로 보내기 위한 절차 그냥 보내면 오류
    search = search.replace('#', '');
    // 만약 -1 이면 #이 없다는 뜻 -> 일반 검색
    if (is_hashtag == -1) {
        location.href = "/content/search/?search=" + search + "&show_recent=" + show_method
    } else {
        location.href = "/content/search/?search=%23" + search + "&show_recent=" + show_method
    }
});

// 내가 좋아요한 게시물 이벤트 처리
$("#button_feed_like_list").click(function () {
    // 프로필 화면의 내 게시물 버튼 비활성화 표시
    $('#button_feed_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });
    // 프로필 화면의 좋아요 버튼 활성화 밑줄 표시
    $('#button_feed_like_list').css({
        borderTopStyle: "solid",
        color: "black"
    });
    // 프로필 화면의 북마크 버튼 비활성화 표시
    $('#button_feed_bookmark_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });

    // 검색 키워드를 가져와서 전달 (좋아요 순으로 검색)
    let search = $.trim($('.search_keyword').html());
    let show_method = document.getElementById('button_feed_like_list').getAttribute("show_method_like");
    console.log(show_method);
    // 해시태그 검색인지 일반 검색어 검색인지 구분하기 위해서 #의 위치를 구함
    let is_hashtag = search.indexOf('#');
    // #을 제거함 검색어를 서버로 보내기 위한 절차 그냥 보내면 오류
    search = search.replace('#', '');
    // 만약 -1 이면 #이 없다는 뜻 -> 일반 검색
    if (is_hashtag == -1) {
        location.href = "/content/search/?search=" + search + "&show_like=" + show_method
    } else {
        location.href = "/content/search/?search=%23" + search + "&show_like=" + show_method
    }
});

// 내가 북마크한 게시물 이벤트 처리
$("#button_feed_bookmark_list").click(function () {
    //프로필 화면의 내 게시물 버튼 비활성화 표시
    $('#button_feed_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });
    //프로필 화면의 좋아요 버튼 비활성화 표시
    $('#button_feed_like_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });
    // 프로필 화면의 북마크 버튼 활성화 밑줄 표시
    $('#button_feed_bookmark_list').css({
        borderTopStyle: "solid",
        color: "black"
    });

    // 검색 키워드를 가져와서 전달 (댓글 순으로 검색
    let search = $.trim($('.search_keyword').html());
    // 해시태그 검색인지 일반 검색어 검색인지 구분하기 위해서 #의 위치를 구함
    let show_method = document.getElementById('button_feed_bookmark_list').getAttribute("show_method_reply");
    console.log(show_method);
    let is_hashtag = search.indexOf('#');
    // #을 제거함 검색어를 서버로 보내기 위한 절차 그냥 보내면 오류
    search = search.replace('#', '');
    // 만약 -1 이면 #이 없다는 뜻 -> 일반 검색
    if (is_hashtag == -1) {
        location.href = "/content/search/?search=" + search + "&show_reply=" + show_method
    } else {
        location.href = "/content/search/?search=%23" + search + "&show_reply=" + show_method
    }
});

document.getElementById('all_end_date').max = new Date().toISOString().substring(0, 10);
document.getElementById('all_end_date').value = new Date().toISOString().substring(0, 10);


// 날짜 카테고리 동시 필터링 이벤트 처리
$("#all_submit").click(function (event) {
    // 이벤트 확산 방지
    event.stopPropagation();
    // input태그에서 값을 다 가져옴
    var show_method_recent = document.getElementById("recent_sort").value;
    var show_method_like = document.getElementById("like_sort").value;
    var show_method_reply = document.getElementById("reply_sort").value;
    var search = document.getElementById("all_search_keyword").value;
    var start_date = document.getElementById("all_start_date").value;
    var end_date = document.getElementById("all_end_date").value;
    var category_option1 = document.getElementById("feed_category_search1").value;
    var category_option2 = document.getElementById("feed_category_search2").value;

    // 날짜 선택이 하나라도 안되어있는 경우 예외처리
    if (start_date == '' || end_date == '') {
        alert("날짜를 선택하세요");
        return 0;
    }
    // 카테고리가 둘 다 비어있는 경우 예외처리
    if (category_option1 === '' && category_option2 === '') {
        alert("카테고리를 선택하세요")
        return 0;
    }

    // 해시태그 검색인지 일반 검색어 검색인지 구분하기 위해서 #의 위치를 구함
    let is_hashtag = search.indexOf('#');
    // #을 제거함 검색어를 서버로 보내기 위한 절차 그냥 보내면 오류
    search = search.replace('#', '');
    // 만약 -1 이면 #이 없다는 뜻 -> 일반 검색
    if (is_hashtag == -1) {
        location.href = "/content/search/?search=" + search + "&show_recent=" + show_method_recent + "&show_like=" +
            show_method_like + "&show_reply=" + show_method_reply + "&start_date=" + start_date + "&end_date=" + end_date +
            "&category_option1=" + category_option1 + "&category_option2=" + category_option2;
    } else {
        location.href = "/content/search/?search=%23" + search + "&show_recent=" + show_method_recent + "&show_like=" +
            show_method_like + "&show_reply=" + show_method_reply + "&start_date=" + start_date + "&end_date=" + end_date +
            "&category_option1=" + category_option1 + "&category_option2=" + category_option2;
    }
});

// 필터링 설정 일괄 초기화 버튼 이벤트 처리
$("#all_filter_rest").click(function (event) {
    // 이벤트 전파 차단
    event.stopPropagation();
    document.getElementById('feed_category_search2').selectedIndex = 0;
    document.getElementById('feed_category_search1').selectedIndex = 0;
    document.getElementById('all_start_date').value = ''
    document.getElementById('all_end_date').value = ''
});

// 카테고리 필터링 버튼 이벤트 처리
$("#category_select_btn").click(function (event) {
    var category_option1 = document.getElementById("feed_category_search1").value;
    var category_option2 = document.getElementById("feed_category_search2").value;

    // 카테고리가 둘 다 비어있는 경우 예외처리
    if (category_option1 === '' && category_option2 === '') {
        alert("카테고리를 선택하세요");
        event.preventDefault(); // 폼 전송 기본 동작 중지
    }
});

// 카테고리 필터링 폼 전송 이벤트 처리
$("#data_select").submit(function (event) {
    var start_date = document.getElementById("all_start_date").value;
    var end_date = document.getElementById("all_end_date").value;

    // 날짜 선택이 하나라도 안되어있는 경우 예외처리
    if (start_date === '' || end_date === '') {
        alert("날짜를 선택하세요");
        event.preventDefault(); // 폼 전송 기본 동작 중지
    }
});