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
            alert("댓글 성공");
            // 비동기식 댓글 업로드를 위한 구현
            $("#reply_list_" + feed_id).append("<div style='margin: 0 10px; text-align: left;font-size: 14px'><b>" + user_session + "</b> " + reply_content + "</div>")
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

// 모달창 닫기 버튼 이벤트 처리
$(".modal_close").click(function () {
    // 모달창 닫았을 때 본문 스크롤 가능
    $(document.body).css({
        overflow: 'visible'
    });
    // 모달창 닫았을 때 백그리운드 색 및 이미지 리셋
    $('.img_upload_space').css({
        "background-color": "White",
        "background-image": ""
    });

    // 모달창 닫기와 닫았을 때 글내용을 리셋하는 부분
    $('#input_feed_content').each(function () {
        $(this).val('');
    });
    $('#first_modal').css({
        display: 'none'
    });
    $('#second_modal').css({
        display: 'none'
    });

});

// 사용 범위를 위해 전역 변수 files 선언
let files;
// 게시글 추가 버튼 이벤트 처리
$('#nav_bar_add_box').click(function () {
    //+버튼을 누르면 업로드 창이뜨게 함
    $('#first_modal').css({
        display: 'flex'
    });

    // 업로드 창이 떴을때 스크롤이 사라지게 함
    $(document.body).css({
        overflow: 'hidden'
    });
});
// 공유하기 버튼 클릭시 이벤트 처리
$('#feed_create_button').click(function () {

    let file = files[0];
    let image = files[0].name;
    let content = $('#input_feed_content').val();

    // 안치윤: 피드 내용의 길이가 0보다 작으면 알림창 뜸
    if (content.length <= 0) {
        alert("피드 내용을 입력하세요");
        return 0;
    } else {
        alert("공유하기 눌렀다.");
    }

    // 파일을 업로드 하는 것이므로 formdata 형태로 서버에 전달해야 함, formdata 객체를 생성한 뒤 서버로 보낼 데이터를 객체에 추가해줌
    let fd = new FormData();

    fd.append('file', file);
    fd.append('image', image);
    fd.append('content', content);

    //서버로 보내기 위해서 접속할 url : "/content/upload"이며 보낼 데이터는 formdata, 방식은 POST (formdata 형태)
    $.ajax({
        url: "/content/upload",
        data: fd,
        method: "POST",
        processData: false,
        contentType: false,
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

// 이미지 업로드 공간에 특정 이벤트 발생시 해당하는 함수를 실행
$('.img_upload_space')
    .on("dragover", dragOver)
    .on("dragleave", dragOver)
    .on("drop", uploadFiles)
    .on("change", uploadFiles)


// 마우스를 드래그 했을 때
function dragOver(e) {
    // 이벤트 전파 차단
    e.stopPropagation();
    e.preventDefault();

    // 파일을 드래그해서 업로드 공간에 올릴때 이벤트  이쁘게 수정 필요
    // 마우스가 업로드 공간에서 떠나면 이벤트 이쁘게 수정 필요
    if (e.type === "dragover") {
        $(e.target).css({
            "outline-offset": "-20px"
        });
    } else {
        $(e.target).css({
            "outline-offset": "-10px"
        });
    }
}

// 파일을 드래그 한 상태에서 마우스가 드랍이 되었을 때
function uploadFiles(e) {
    // 이벤트 전파 차단
    e.stopPropagation();
    e.preventDefault();

    // 실질적으로 파일을 업로드 하는 부분
    e.dataTransfer = e.originalEvent.dataTransfer;
    files = e.target.files || e.dataTransfer.files;

    // 여러개의 파일을 한번에 올릴려고 하면 리턴
    if (files.length > 1) {
        alert('하나만 올려라.');
        return;
    }

    // 타입을 판별하고 이미지면 아래 로식을 실행
    if (files[0].type.match(/image.*/)) {

        // 이미지 업로드시 사진업로드 모달창을 가림
        $('#first_modal').css({
            display: 'none'
        });

        // 글 내용 작성 모달창을 띄움
        $('#second_modal').css({
            display: 'flex'
        });

        // 업로드 창 배경을 업로드된 이미지로 변경
        $('.img_upload_space').css({
            "background-image": "url(" + window.URL.createObjectURL(files[0]) + ")",
            "outline": "none",
            "background-size": "cover",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
    } else {
        alert('이미지가 아닙니다.');
        return 0;
    }

}

// 모달창의 사진 추가 버튼 클릭했을 시
$('#image_upload_btn').click(function () {
    $('#input_image_upload').click();
});

// 파일 입력 폼에서 변화 발생시 해당 함수가 실행
function image_upload() {
    // 이미지 업로드시 사진업로드 모달창을 가림
    $('#first_modal').css({
        display: 'none'
    });
    // 글 내용 작성 모달창을 띄움
    $('#second_modal').css({
        display: 'flex'
    });
    // 업로드 창 배경을 업로드된 이미지로 변경
    $('.img_upload_space').css({
        "background-image": "url(" + window.URL.createObjectURL($('#input_image_upload')[0].files[0]) + ")",
        "outline": "none",
        "background-repeat": "no-repeat",
        "background-size": "cover",
        "background-position": "center"
    });

}

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

// 05-12 유재우 : 피드 수정하기를 눌렸을 때 모달창을 띄움 (이미지 띄우는 부분 필요) TODO
$('.update_feed').click(function (event) {
    Feeds_id = event.target.attributes.getNamedItem('feed_id').value;
    $('#third_modal').css({
        display: 'flex'
    });
});
// 05-12 유재우 : 피드 수정하기를 눌렸을 때 수정이 되도록 하는 부분
$('#feed_update_button').click(function (event) {
    let feed_id = Feeds_id

    let content = $('#input_updatefeed_content').val();

    //서버로 보내기 위해서 접속할 url : "/content/upload"이며 보낼 데이터는 formdata, 방식은 POST (formdata 형태)
    $.ajax({
        url: "/content/updatefeed",
        data: {
            feed_id: feed_id,
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

// 05-12 유재우 : 댓글 수정하기를 눌렸을 때 댓글 수정창을 띄움, 안치윤: 전역변수 제거
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

// 정유진: 모달 바깥부분을 클릭하면 안 보에게 된다.
let auto_modal = document.getElementById('auto_modal').getAttribute("id");
let search_box = document.getElementById('search_box').getAttribute("id");

window.addEventListener('mouseup', function (event) {
    // 정유진: 모달창 사라지는 기준.
    if ((event.target.getAttribute("id") == null)
        || !((event.target.getAttribute("id").includes(auto_modal))
            || (event.target.getAttribute("id").includes(search_box)))) {
        $('#auto_modal').css({
            display: 'none'
        });
    }
});

// 정유진: 반응형 적용
window.addEventListener('resize', function () {
    let search_box = document.getElementById('search_box');
    // 정유진: 태그 안의 요소들을 가져온다
    let rect = search_box.getBoundingClientRect();
    // 정유진: left 요소의 값을 가져온다
    let left_value = rect.left;
    // 정유진: 검색창이 없을 경우
    if (left_value == 0) {
        $('#auto_modal').css({
            display: 'none'
        });
    } else { // 정유진: 검색창이 있을 경우
        $('#auto_modal').css({
            display: 'flex'
        });
        $('#auto_modal').css({
            left: left_value + 'px'
        });
    }
});

// 정유진: 검색창을 클릭하면 모달창이 뜬다
$('#search_box').mousedown(function () {
    let element = document.getElementById('search_box');
    let rect = element.getBoundingClientRect();
    let left_value = rect.left;
    // 정유진: 모달창 위치를 정하고 보이게 한다
    $('#auto_modal').css({
        display: 'flex',
        left: left_value + 'px'
    });
    // 정유진: 자동완성에 필요한 검색창의 값을 keyup()으로 가져온다.
    $('#search_box').keyup(function () {
        let search_box_value = document.getElementById('search_box').value;

        if (search_box_value != "") {
            // 정유진: 가져온 값을 서버로 보낸다.
            $.ajax({
                url: "/content/autocomplete",
                data: {
                    search_box_value: search_box_value
                },
                method: "GET",
                success: function (data) {
                    console.log("성공");
                    $("#auto_modal_list").html('');
                    for (let i = 0; i < data['autocomplete_user_list'].length; i++) {
                        // 정유진: 이미지는 경로가 따로 있어야 한다.
                        let user_profile_image = "/media/" + data['autocomplete_user_list'][i].profile_image;
                        let user_nickname = data['autocomplete_user_list'][i].nickname;
                        let user_name = data['autocomplete_user_list'][i].name;

                        $("#auto_modal_list").append('<div id="auto_modal_object_' + i + '" class="movetoprofile" style="width: 100%; margin: 10px; display: flex;flex-direction: row;align-items: center;"></div>');

                        $("#auto_modal_object_" + i).append('<img id="' + user_nickname + '" class="profile_box profile feed_profile_image " style="width: 35px; height: 35px" src="' + user_profile_image + '">');
                        $("#auto_modal_object_" + i).append('<div id="auto_modal_nickname_name_' + i + '"></div>');

                        $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="feed_nickname">' + user_nickname + '</div>');
                        $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="feed_nickname" style="">' + user_name + '</div>');

                        // 정유진: append에서 id 값을 user_nickname로 하면 $("#" + user_nickname).append가 되지 않아 따로 바꾼다.
                        document.getElementById("auto_modal_object_" + i).setAttribute("id", user_nickname);

                        // 안치윤 : 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
                        $(".movetoprofile").click(function (event) {
                            let user_nickname = event.target.id;
                            location.href = "/content/reprofile?user_nickname=" + user_nickname;
                        });

                    }
                },
                error: function (request, status, error) {
                    console.log("에러");
                },
                complete: function () {
                    console.log("완료");
                }
            });
        } else {
            $("#auto_modal_list").html('');
        }

    });
});