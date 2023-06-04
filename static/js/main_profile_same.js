// 정유진: 클릭한 게시물의 feed_id를 모달에 넘겨 주는 이벤트 처리. 추가되는 태그의 id 값는 모두 앞에 feed_modal을 붙였다.
$(".feed_modal").click(function () {
    // 정유진: 클릭한 게시물의 feed_id 값을 뽑아 낸다.
    var feed_id = $(this).attr('feed_id');
    // 정유진: feed_modal에 feed_id 요소 추가
    document.getElementById("feed_modal").setAttribute("feed_id", feed_id);
    // 정유진: feed_modal의 댓글 게시 부분에 feed_id 요소 추가
    document.getElementById("reply_content_upload").setAttribute("feed_id", feed_id);

    $(document.body).css({
        overflow: 'hidden'
    });

    $.ajax({
        url: "/content/feedmodal",
        data: {
            feed_id: feed_id
        },
        method: "GET",
        success: function (data) {
            console.log("성공");
            // 정유진: 서버에서 받은 게시물 이미지, 내용, 작성자 프로필 이미지, 작성자 닉네임 변수에 따로 할당.
            var feed_image = "/media/" + data['image'];
            var feed_content = data['feed_content'];
            var writer_profile_image = "/media/" + data['writer_profile_image'];
            var writer_nickname = data['writer_nickname'];

            // 정유진: 모달에 남았는 댓글 리스트 리셋.
            $("#feed_modal_reply_list").html('');
            // 정유진: 서버에서 받은 댓글 리스트 변수에 할당 후 추가.
            for (var i = 0; i < data['reply_list'].length; i++) {
                var reply_profile_image = "/media/" + data['reply_list'][i].profile_image;
                var reply_nickname = data['reply_list'][i].nickname;
                var reply_content = data['reply_list'][i].reply_content;

                // 댓글 리스트
                $("#feed_modal_reply_list").append('<div id="feed_modal_reply_' + i + '" class="feed_modal_reply_area"></div>');

                // 댓글들, 프로필 이미지 -
                $("#feed_modal_reply_" + i).append('<div id="feed_modal_reply_profile_image_' + i + '" class="box profile feed_modal_reply_profile_image_area"></div>');
                $("#feed_modal_reply_" + i).append('<div id="feed_modal_reply_nickname_content_' + i + '" class="feed_modal_reply_nickname_content_area"></div>');

                $("#feed_modal_reply_nickname_content_" + i).append('<div id="feed_modal_reply_nickname_' + i + '" class="feed_modal_reply_nickname_area"></div>');
                $("#feed_modal_reply_nickname_content_" + i).append('<div id="feed_modal_reply_content_' + i + '" class="text_line feed_modal_reply_content_area"></div>');

                $("#feed_modal_reply_profile_image_" + i).append('<img id="' + reply_nickname + '" class="feed_modal_reply_profile_image movetoprofile" src="' + reply_profile_image + '">');
                $("#feed_modal_reply_nickname_" + i).append('<div id="' + reply_nickname + '" class="feed_modal_reply_nickname movetoprofile">' + reply_nickname + '</div>');
                $("#feed_modal_reply_content_" + i).append('<div class="feed_modal_reply_content">' + reply_content + '</div>');
            }
            // 정유진: 좋아요, 북마크, 좋아요 수, 게시물 작성시간 값 할당.
            var is_liked = data['is_liked'];
            var is_marked = data['is_marked'];
            var like_count = data['like_count'];
            var feed_create_at = data['feed_create_at'];

            // 정유진: 할당 받은 게시물 이미지, 내용, 작성자 프로필 이미지, 작성자 닉네임 모달에 추가
            $("#feed_modal_image").html('<img style="" src="' + feed_image + '">');
            $("#feed_modal_feed_content").html('<div>' + feed_content + '</div>');
            $(".feed_modal_profile_image").html('<img id="' + writer_nickname + '" class="movetoprofile" src="' + writer_profile_image + '">');
            $(".feed_modal_nickname").html('<div id="' + writer_nickname + '" class="movetoprofile">' + writer_nickname + '</div>');

            // 정유진: 해시태그 추가
            $(".feed_modal_contents_writer_hashtags").html('');
            if (data['hashtag_list'].length > 0) {
                $(".feed_modal_contents_writer_hashtags").append('<div class="feed_area_hashtags feed_modal_hashtags text_line" id="feed_modal_hashtag_div_' + feed_id + '" style="display: flex"></div>');

                for (var i = 0; i < data['hashtag_list'].length; i++) {
                    var reply_hashtag = data['hashtag_list'][i];
                    $("#feed_modal_hashtag_div_" + feed_id).append('<div id="feed_modal_hashtags_list" class="hashtags" hashtag_content="' + reply_hashtag + '">#' + reply_hashtag + '</div>');
                }
            }

            // 정유진: 좋아요, 북마크 여부 확인 후 모달에 추가
            if (is_liked)
                $("#feed_modal_is_liked").html(
                    '<span id="feed_modla_favorite_' + feed_id + '" feed_id="' + feed_id + '" style="color: red" class="uTrue favorite material-symbols-outlined">favorite</span>');
            else
                $("#feed_modal_is_liked").html(
                    '<span id="feed_modla_favorite_' + feed_id + '" feed_id="' + feed_id + '" class="uFalse favorite material-symbols-outlined">favorite</span>');

            if (is_marked)
                $("#feed_modal_is_marked").html(
                    '<span id="feed_modla_bookmark_' + feed_id + '" feed_id="' + feed_id + '" class="uTrue bookmark material-symbols-outlined">bookmark</span>');
            else
                $("#feed_modal_is_marked").html(
                    '<span id="feed_modla_bookmark_' + feed_id + '" feed_id="' + feed_id + '" class="uFalse bookmark material-symbols-outlined">bookmark</span>');

            // 정유진: 좋아요 수, 게시물 작성시간 모달에 추가
            $("#feed_modal_like_count").html('<div class="feed_modal_like_count">좋아요 수 ' + '<b class="async_like_count_' + feed_id + '">' + like_count + '명' + '</b>' + '</div>');
            $("#feed_modal_feed_create_at").html('<div class="feed_modal_feed_create_at">' + feed_create_at + '</div>');

            // 정유진: 댓글 게시할 때 댓글리스트에서 몇 번째인지 알려준다.
            document.getElementById("reply_content_upload").setAttribute("reply_id", data['reply_list'].length);

            $("#feed_modal").css({
                display: 'flex'
            });

            // 정유진: main.html에서 가져왔으며 추가된 html에서도 작동되록 ajax안에 넣었다.
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
                        // 좋아요 수 비동기
                        var async_like_count = data['async_like_count'];
                        console.log(async_like_count);
                        $(".async_like_count_" + feed_id).html(async_like_count + '명');
                    },
                    error: function (request, status, error) {
                        console.log("에러");
                    },
                    complete: function () {
                        console.log("완료");

                    }
                });
            });

            // 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
            $(".movetoprofile").click(function (event) {
                let user_nickname = event.target.id;
                location.href = "/content/reprofile?user_nickname=" + user_nickname;
            });

            // //05-20 유재우 : 해시태그를 눌렸을 때 해시태그를 검색함
            $('.hashtags').click(function () {
                let hashtag_content = $(this).attr('hashtag_content');
                location.href = "/content/search/?search=%23" + hashtag_content
            });
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
        }
    });
});

// 피드 모달 댓글 게시 버튼 이벤트 처리
$(".modal_upload_reply").click(function (event) {
    // 게시 버튼 태그의 id 속성 값을 가져옴
    let feed_id = event.target.attributes.getNamedItem('feed_id').value;
    // reply_content_upload div 요소의 reply_id 값을 가져옴
    let relpy_upload_id = document.getElementById("reply_content_upload").getAttribute("reply_id");
    // 댓글 입력 폼 아이디를 이용해서 입력 폼의 내용을 가져옴
    let reply_content = $('#reply_content_text').val();

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
            reply_content: reply_content
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            alert("댓글 성공");
            // 비동기식 댓글 업로드를 위한 구현
            $("#feed_modal_reply_list").append('<div id="feed_modal_reply_' + relpy_upload_id + '" class="feed_modal_reply_area"></div>');

            $("#feed_modal_reply_" + relpy_upload_id).append('<div id="feed_modal_reply_profile_image_' + relpy_upload_id + '" class="box profile feed_modal_reply_profile_image_area"></div>');
            $("#feed_modal_reply_" + relpy_upload_id).append('<div id="feed_modal_reply_nickname_content_' + relpy_upload_id + '" class="feed_modal_reply_nickname_content_area"></div>');

            $("#feed_modal_reply_nickname_content_" + relpy_upload_id).append('<div id="feed_modal_reply_nickname_' + relpy_upload_id + '" class="feed_modal_reply_nickname_area"></div>');
            $("#feed_modal_reply_nickname_content_" + relpy_upload_id).append('<div id="feed_modal_reply_content_' + relpy_upload_id + '" class="text_line feed_modal_reply_content_area"></div>');

            $("#feed_modal_reply_profile_image_" + relpy_upload_id).append('<img id="' + data['user_nickname'] + '" class="movetoprofile feed_modal_reply_profile_image" src="/media/' + data['user_profile_image'] + '">');
            $("#feed_modal_reply_nickname_" + relpy_upload_id).append('<div id="' + data['user_nickname'] + '" class="movetoprofile feed_modal_reply_nickname">' + data['user_nickname'] + '</div>');
            $("#feed_modal_reply_content_" + relpy_upload_id).append('<div class="feed_modal_reply_content">' + reply_content + '</div>');

            // 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
            $(".movetoprofile").click(function (event) {
                let user_nickname = event.target.id;
                location.href = "/content/reprofile?user_nickname=" + user_nickname;
            });
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
            // 댓글을 입력하고 나면 입력 폼을 비워야 함
            $('#reply_content_text').val('');
            // 정유진: reply_content_upload div 요소의 reply_id 속성에 reply_id 값을 할당함.
            // + 해당 피드의 마지막 댓글의 다음 번째를 넘겨준다.
            let relpy_upload_next_id = String(Number(relpy_upload_id) + 1);
            document.getElementById("reply_content_upload").setAttribute("reply_id", relpy_upload_next_id);
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
    // 05-23 유재우 : 모달창 닫기와 닫았을 때 해시태그 내용을 리셋하는 부분
    $('#input_feed_hashtag').each(function () {
        $(this).val('');
    });
    $('#first_modal').css({
        display: 'none'
    });
    $('#second_modal').css({
        display: 'none'
    });
    // 05-23 유재우 : 서드 모달창 닫기
    $('#third_modal').css({
        display: 'none'
    });
    $('#feed_modal').css({
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
    alert(files.length)

    // 파일을 업로드 하는 것이므로 formdata 형태로 서버에 전달해야 함, formdata 객체를 생성한 뒤 서버로 보낼 데이터를 객체에 추가해줌
    let fd = new FormData();

    let file = []
    let image = []
    for (i = 0; i < files.length; i++) {
        file = files[i];
        image = files[i].name;
        fd.append('file'[i], file);
        fd.append('image'[i], image);
    }
    let content = $('#input_feed_content').val();
    //해시태그용 컨탠트 추가
    let hashtags_content = $('#input_feed_hashtag').val();

    // 안치윤: 피드 내용의 길이가 0보다 작으면 알림창 뜸
    if (content.length <= 0) {
        alert("피드 내용을 입력하세요");
        return 0;
    } else {
        alert("공유하기 눌렀다.");
    }


    fd.append('content', content);
    fd.append('hashtags_content', hashtags_content);


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


    for (var i = 0; i < files.length; i++) {
        // 타입을 판별하고 이미지면 아래 로식을 실행
        if (files[i].type.match(/image.*/)) {
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
                "background-size": "contain",
                "background-repeat": "no-repeat",
                "background-position": "center"
            });

        } else {
            alert('이미지가 아닙니다.');
            return 0;
        }
    }
    // 이미지 업로드시 사진업로드 모달창을 가림


}

// 모달창의 사진 추가 버튼 클릭했을 시
$('#image_upload_btn').click(function () {
    $('#input_image_upload').click();
});

// 안치윤 : 버그 수정 유효성 검사, 파일 입력 폼에서 변화 발생시 해당 함수가 실행
function image_upload() {
    // 타입을 판별하고 이미지면 아래 로식을 실행
    if ($('#input_image_upload')[0].files[0].type.match(/image.*/)) {
        // 업로드 창 배경을 업로드된 이미지로 변경
        $('.img_upload_space').css({
            "background-image": "url(" + window.URL.createObjectURL($('#input_image_upload')[0].files[0]) + ")",
            "outline": "none",
            "background-size": "contain",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
    } else {
        return 0;
    }
}

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
    // 05-23 유재우 : 모달창 닫기와 닫았을 때 해시태그 내용을 리셋하는 부분
    $('#input_feed_hashtag').each(function () {
        $(this).val('');
    });
    $('#first_modal').css({
        display: 'none'
    });
    $('#second_modal').css({
        display: 'none'
    });
    // 05-23 유재우 : 서드 모달창 닫기
    $('#third_modal').css({
        display: 'none'
    });
    $('#feed_modal').css({
        display: 'none'
    });
});
