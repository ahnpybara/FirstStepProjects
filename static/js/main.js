// 안치윤 : 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
$(".movetoprofile").click(function (event) {
    let user_nickname = event.target.id;
    location.href = "/content/reprofile?user_nickname=" + user_nickname;
});

// 북마크 아이콘 클릭 이벤트 처리
$(".bookmark").click(function (event) {
    // 북마크 아이콘 태그의 feed_id 속성 값을 가져옴
    let feed_id = event.target.attributes.getNamedItem('feed_id').value;
    // 이벤트가 발생한 태그의 id를 가져옴
    let bookmark_id = event.target.id;
    // 해당 태그의 style 속성중 color 값을 가져옴
    let bookmark_color = $('#' + bookmark_id).css('color');

    // 현재 북마크 상태가 아니면 북마크 상태로 표시
    if (bookmark_color === 'rgb(0, 0, 0)') {
        $(this).css({"font-variation-settings": "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48"});
        $(this).css({
            color: 'rgb(0, 0, 1)'
        });
    } else {
        $(this).css({"font-variation-settings": "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48"});
        $(this).css({
            color: 'black',
        });
    }
    // 서버로 보내기 위해서 접속할 url : "/content/bookmark"이며 보낼 데이터는 피드아이디와 북마크텍스트, 방식은 POST (Json 형태)
    $.ajax({
        url: "/content/bookmark",
        data: {
            feed_id: feed_id,
            bookmark_color: bookmark_color
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

// 안치윤 : 좋아요 심볼 클릭 이벤트
$(".favorite").click(function (event) {
    // 북마크 아이콘 태그의 feed_id 속성 값을 가져옴
    let feed_id = event.target.attributes.getNamedItem('feed_id').value;
    // 이벤트가 발생한 태그의 id값을 가져옴
    let favorite_id = event.target.id;
    // 해당 태그의 style 속성중 color 값을 가져옴
    let favorite_color = $('#' + favorite_id).css('color');

    // 현재 좋아요 상태가 아니면 북마크 상태로 표시
    if (favorite_color === 'rgb(0, 0, 0)') {
        $(this).css({"font-variation-settings": "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48"});
        $(this).css({
            color: 'red',
        });
    } else {
        $(this).css({"font-variation-settings": "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48"});
        $(this).css({
            color: 'black',
        });
    }

    // 서버로 보내기 위해서 접속할 url : "/content/like"이며 보낼 데이터는 피드아이디와 좋아요 텍스트, 방식은 POST (Json 형태)
    $.ajax({
        url: "/content/like",
        data: {
            feed_id: feed_id,
            favorite_color: favorite_color
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

// 댓글 게시 버튼 이벤트 처리
$(".upload_reply").click(function (event) {
    // 게시 버튼 태그의 id 속성 값을 가져옴
    let feed_id = event.target.attributes.getNamedItem('feed_id').value;
    var user_session = $(this).attr('user_session');

    let reply_id = 'reply_' + feed_id;
    // 댓글 입력 폼 아이디를 이용해서 입력 폼의 내용을 가져옴
    let reply_content = $('#' + reply_id).val();

    // 댓글의 길이가 0보다 작으면 알림창 뜸
    if (reply_content.length <= 0) {
        alert("댓글을 입력하세요");
        return 0;
    }

    //서버로 보내기 위해서 접속할 url : "/content/reply"이며 보낼 데이터는 피드아이디와 댓글 내용, 방식은 POST (Json 형태)
    $.ajax({
        url: "/content/reply",
        data: {
            feed_id: feed_id,
            reply_content: reply_content,
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            // 비동기식 댓글 업로드를 위한 구현

            //댓글 부분
            $("#reply_list_" + feed_id).append('<div id="feed_reply_list_area_' + data.user_reply_id + '" class="user_reply_list_area"></div>');

            // 닉네임, 댓글 내용 틀
            $("#feed_reply_list_area_" + data.user_reply_id).append('<div id="feed_user_reply_' + data.user_reply_id + '" class="user_reply text_line" style="display: flex"></div>');
            //댓글 삭제 수정 버튼 부분
            $("#feed_reply_list_area_" + data.user_reply_id).append('<div><div id="reply_menu' + data.user_reply_id + '" reply_id="' + data.user_reply_id + '" class="dropdown" style="display: flex"></div></div>');

            // 닉네임, 댓글 내용 값
            $("#feed_user_reply_" + data.user_reply_id).append('<b class="movetoprofile reply_nickname" id="' + data.user_nickname + '" style="margin-right: 10px;">' + data.user_nickname + '</b>' + reply_content);

            // 댓글 삭제 수정 버튼
            $("#reply_menu" + data.user_reply_id).append('' +
                '<a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">' +
                '<span class="material-icons-round">more_horiz</span>' +
                '</a>');
            // 댓글 삭제 수정 메뉴창
            $("#reply_menu" + data.user_reply_id).append('' +
                '<ul id="reply_delete_update_menu" class="dropdown-menu" aria-labelledby="dropdownMenuLink">' +
                '<li reply_id="' + data.user_reply_id + '" class="remove_reply dropdown-item">' +
                '<b class="delete_text">삭제</b>' +
                '</li>' +
                '<li>' +
                '<hr style="display: flex;"class="dropdown-divider">' +
                '</li>' +
                '<li style="display: flex">' +
                '<div id="' + data.user_reply_id + '" reply_id="' + data.user_reply_id + '" class="update_reply dropdown-item">수정</div>' +
                '</li>' +
                '</ul>');

            // 댓글 수정할 때 쓰는 텍스트 박스
            $("#reply_list_" + feed_id).append('' +
                '<div class="reply_update_textbox" id="reply_div' + data.user_reply_id + '">' +
                '<input id="reply_' + data.user_reply_id + '" type="text" class="input_reply_update form-control" placeholder="댓글 수정..">' +
                '<div reply_id="' + data.user_reply_id + '" class="update_replys" id="update_reply_btn">' +
                '수정' +
                '</div>' +
                '<span reply_id="' + data.user_reply_id + '" id="reply_close_button" class="reply_close_btn material-icons-outlined">close</span>' +
                '</div>');

            // 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
            $(".movetoprofile").click(function (event) {
                let user_nickname = event.target.id;
                location.href = "/content/reprofile?user_nickname=" + user_nickname;
            });

            $('.remove_reply').click(function (event) {
                var reply_id = $(this).attr('reply_id');

                $.ajax({
                    url: "/content/removereply",
                    data: {
                        reply_id: reply_id,
                    },
                    method: "POST",
                    success: function (data) {
                        console.log("성공");
                        alert("댓글을 성공적으로 삭제 하었습니다.");
                    },
                    error: function (request, status, error) {
                        console.log("에러");
                    },
                    complete: function () {
                        console.log("완료");
                        location.replace("/main");
                    }
                });
            })

            $('.update_reply').click(function (event) {
                let reply_id = $(this).attr('reply_id');
                $('#reply_div' + reply_id).css({
                    display: 'flex'
                });
                $('#reply_menu_' + reply_id).css({
                    display: 'none'
                });

            });

            $('.reply_close_btn').click(function (event) {
                let reply_id = $(this).attr('reply_id');
                console.log(reply_id);
                $('#reply_div' + reply_id).css({
                    display: 'none'
                });
                $('#reply_menu_' + reply_id).css({
                    display: 'flex'
                });
            });


            // 05-12 유재우 : 댓글 수정하기를 눌렸을 때 수정이 되도록 하는 부분, 안치윤 : 댓글 내용없으면 알림
            $('.update_replys').click(function (event) {
                let reply_id = $(this).attr('reply_id');

                let content = $('#reply_' + reply_id).val();


                // 댓글의 길이가 0보다 작으면 알림창 뜸
                if (content.length <= 0) {
                    alert("댓글을 입력하세요");
                    return 0;
                }

                //서버로 보내기 위해서 접속할 url : "/content/upload"이며 보낼 데이터는 formdata, 방식은 POST (formdata 형태)
                $.ajax({
                    url: "/content/updatereply",
                    data: {
                        reply_id: reply_id,
                        content: content
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
                        location.replace("/main");
                    }
                });
            });
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
            // 댓글을 입력하고 나면 입력 폼을 비워야 함
            $('#' + reply_id).val('');
        }
    });

});

// 05-09유재우 : 피드 삭제
$('.remove_feed').click(function (event) {
    var feed_id = $(this).attr('feed_id');

    $.ajax({
        url: "/content/removefeed",
        data: {
            feed_id: feed_id
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            alert("피드를 성공적으로 삭제 되었습니다.");
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
            location.replace("/main");
        }
    });
})

// 05-12 유재우: 댓글 삭제
$('.remove_reply').click(function (event) {
    var reply_id = $(this).attr('reply_id');

    $.ajax({
        url: "/content/removereply",
        data: {
            reply_id: reply_id,
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            alert("댓글을 성공적으로 삭제 하었습니다.");
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
            location.replace("/main");
        }
    });
})

// 05-12 유재우 : 피드 수정하기를 눌렸을 때 모달창을 띄움
$('.update_feed').click(function (event) {

    Feeds_id = event.target.attributes.getNamedItem('feed_id').value;
    $('#third_modal').css({
        display: 'flex',

    });
    // 05-23 유재우 : 이미지 띄우는 부분 추가
    $.ajax({
        url: "/content/feedupdateimg",
        data: {
            feed_id: Feeds_id
        },
        method: "GET",
        success: function (data) {
            console.log("성공");
            // 정유진: 서버에서 받은 게시물 이미지, 내용, 작성자 프로필 이미지, 작성자 닉네임 변수에 따로 할당.
            var feed_image = "/media/" + data['image'];
            var feed_content = data['feed_content'];
            var hashtag_content = data['hashtag_content']

            // 정유진: 할당 받은 게시물 이미지, 내용, 작성자 프로필 이미지, 작성자 닉네임 모달에 추가
            // 업로드 창 배경을 업로드된 이미지로 변경
            $('#update_feed_modal_image').css({
                "background-image": "url(" + feed_image + ")",
                "outline": "none",
                "background-size": "contain",
                "background-repeat": "no-repeat",
                "background-position": "center",
                "margin-right": "1px"
            });
            $("#input_updatefeed_content").html(feed_content);
            $("#input_updatefeed_hashtag").html(hashtag_content);
            // 서버로 보내기 위해서 접속할 url : "/content/bookmark"이며 보낼 데이터는 피드아이디와 북마크텍스트, 방식은 POST (Json 형태)

        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");

        }
    });
});

// 05-12 유재우 : 피드 수정하기를 눌렸을 때 수정이 되도록 하는 부분
$('#feed_update_button').click(function (event) {
    let feed_id = Feeds_id
    let hashtag_content = $('#input_updatefeed_hashtag').val();
    let content = $('#input_updatefeed_content').val();

    //서버로 보내기 위해서 접속할 url : "/content/upload"이며 보낼 데이터는 formdata, 방식은 POST (formdata 형태)
    $.ajax({
        url: "/content/updatefeed",
        data: {
            feed_id: feed_id,
            content: content,
            hashtag_content: hashtag_content
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
            location.replace("/main");
        }
    });
});

// 05-12 유재우 : 댓글 수정하기를 눌렸을 때 댓글 수정창을 띄움, 안치윤: 전역변수 제거
$('.update_reply').click(function (event) {
    let reply_id = $(this).attr('reply_id');
    $('#reply_div' + reply_id).css({
        display: 'flex'
    });
    $('#reply_menu_' + reply_id).css({
        display: 'none'
    });
});

// 05-12 유재우 : 댓글 수정하기 취소 버튼
$('.reply_close_btn').click(function (event) {
    let reply_id = $(this).attr('reply_id');
    console.log(reply_id);
    $('#reply_div' + reply_id).css({
        display: 'none'
    });
    $('#reply_menu_' + reply_id).css({
        display: 'flex'
    });
});

// 05-12 유재우 : 댓글 수정하기를 눌렸을 때 수정이 되도록 하는 부분, 안치윤 : 댓글 내용없으면 알림
$('.update_replys').click(function (event) {
    let reply_id = $(this).attr('reply_id');

    let content = $('#reply_' + reply_id).val();


    // 댓글의 길이가 0보다 작으면 알림창 뜸
    if (content.length <= 0) {
        alert("댓글을 입력하세요");
        return 0;
    }

    //서버로 보내기 위해서 접속할 url : "/content/upload"이며 보낼 데이터는 formdata, 방식은 POST (formdata 형태)
    $.ajax({
        url: "/content/updatereply",
        data: {
            reply_id: reply_id,
            content: content
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
            location.replace("/main");
        }
    });
});


// 정유진: 피드 내용 더보기
$('.feed_content_more').click(function (event) {
    let feed_id = event.target.id;
    let feed_nickname = document.getElementById(feed_id).getAttribute("feed_nickname");
    let feed_content_more = document.getElementById(feed_id).getAttribute("feed_content");

    $('#feed_content_limit_' + feed_id).text(feed_content_more);
    $('#feed_content_limit_' + feed_id).html('<b class="movetoprofile feed_content_nickname" style="margin-right: 6px" id="' + feed_nickname + '">' + feed_nickname + '</b>' + feed_content_more)

    // 정유진: 더 보기 클릭 시 더보기 버튼 사라짐
    $('#' + feed_id).css({
        display: 'none'
    })
    // 05-21 유재우 : 더보기 클릭 시 해시태그 나타남
    $('#hashtag_div_' + feed_id).css({
        display: 'flex'
    })
    $('#hashtag_space_div_' + feed_id).css({
        display: 'flex'
    })

});

//05-20 유재우 : 해시태그를 눌렸을 때 해시태그를 검색함
$('.hashtags').click(function () {
    let hashtag_content = $(this).attr('hashtag_content');
    location.href = "/content/search/?search=%23" + hashtag_content
});


// 팔로우 스위치 버튼을 누른 경우
$('#flexSwitchCheckChecked').click(function (event) {
    let follower_btn_id = $(this).attr('id');
    let is_checked = 'unchecked'
    if ($(this).is(":checked") == true) {
        let is_checked = 'checked'
        // 팔로우 체크 했는지에 대한 정보를 서버로 보냄
        location.href = "/content/follower?is_checked=" + is_checked;
    } else {
        let is_checked = 'unchecked'
        location.href = "/main";
    }
});