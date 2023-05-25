// 안치윤 : 팔로우 버튼 및 기능 구현
$('#user_follow_btn').click(function (event) {
    // 팔로우를 하는 사람의 이메일
    let session_user_email = document.getElementById("user_follow_btn").getAttribute("user_session_email");
    // 팔로우 당하는 사람의 이메일
    let user_email = document.getElementById("user_follow_btn").getAttribute("user_email");
    let follow_id = event.target.id;
    // 글 내용으로 팔로우 여부를 따짐
    let is_followed = $.trim($('#' + follow_id).html());

    if (is_followed == '팔로우') {
        $('#' + follow_id).html('언팔로우');
        $(this).css({
            width: '90px',
            background: 'gray',
            border: 'none',
        })
    } else {
        $('#' + follow_id).html('팔로우');
        $(this).css({
            width: '74px',
            background: 'rgb(0, 149, 246)',
            border: 'none',
        })

    }
    // 팔로우를 위한 데이터를 서버에 전달
    $.ajax({
        url: "/content/follow",
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

// 내가 쓴 게시물 이벤트 처리
$("#button_feed_list").click(function () {
    // 프로필 화면의 내 게시물 버튼 활성화 표시
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
    //내 게시물의 게시물 보기
    $('#feed_list').css({
        display: 'flex'
    });
    //좋아요의 게시물 숨기기
    $('#like_feed_list').css({
        display: 'none'
    });
    //북마크의 게시물 숨기기
    $('#bookmark_feed_list').css({
        display: 'none'
    });
});

// 내가 좋아요한 게시물 이벤트 처리
$("#button_feed_like_list").click(function () {
    // 프로필 화면의 내 게시물 버튼 비활성화 표시
    $('#button_feed_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });
    // 프로필 화면의 좋아요 버튼 활성화 표시
    $('#button_feed_like_list').css({
        borderTopStyle: "solid",
        color: "black"
    });
    // 프로필 화면의 북마크 버튼 비활성화 표시
    $('#button_feed_bookmark_list').css({
        borderTopStyle: "none",
        color: "#737373"
    });
    //내 게시물의 게시물 숨기기
    $('#feed_list').css({
        display: 'none'
    });
    //좋아요의 게시물 보기
    $('#like_feed_list').css({
        display: 'flex'
    });
    //북마크의 게시물 숨기기
    $('#bookmark_feed_list').css({
        display: 'none'
    });
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
    // 프로필 화면의 북마크 버튼 활성화 표시
    $('#button_feed_bookmark_list').css({
        borderTopStyle: "solid",
        color: "black"
    });
    //내 게시물의 게시물 숨기기
    $('#feed_list').css({
        display: 'none'
    });
    //좋아요의 게시물 숨기기
    $('#like_feed_list').css({
        display: 'none'
    });
    //북마크의 게시물 보기
    $('#bookmark_feed_list').css({
        display: 'flex'
    });
});