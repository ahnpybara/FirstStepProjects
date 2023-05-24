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
                $("#feed_modal_reply_list").append('<div id="feed_modal_reply_' + i + '" style="display: flex;margin-bottom: 15px;"></div>');

                // 댓글들, 프로필 이미지 -
                $("#feed_modal_reply_" + i).append('<div id="feed_modal_reply_profile_image_' + i + '" class="box profile" style="width: 32px;height: 32px;margin-right: 15px; min-width: 32px!important"></div>');
                $("#feed_modal_reply_" + i).append('<div id="feed_modal_reply_nickname_content_' + i + '" style="display: flex;align-items: start;"></div>');

                $("#feed_modal_reply_nickname_content_" + i).append('<div id="feed_modal_reply_nickname_' + i + '" style="font-weight: bold; font-size: 14px; margin-right: 8px"></div>');
                $("#feed_modal_reply_nickname_content_" + i).append('<div id="feed_modal_reply_content_' + i + '" class="text_line" style="font-size: 14px"></div>');

                $("#feed_modal_reply_profile_image_" + i).append('<img style="width: 100%;height: 100%" src="' + reply_profile_image + '">');
                $("#feed_modal_reply_nickname_" + i).append('<div style="padding-top: 3px">' + reply_nickname + '</div>');
                $("#feed_modal_reply_content_" + i).append('<div style="padding-top: 3px">' + reply_content + '</div>');
            }
            // 정유진: 좋아요, 북마크, 좋아요 수, 게시물 작성시간 값 할당.
            var is_liked = data['is_liked'];
            var is_marked = data['is_marked'];
            var like_count = data['like_count'];
            var feed_create_at = data['feed_create_at'];

            // 정유진: 할당 받은 게시물 이미지, 내용, 작성자 프로필 이미지, 작성자 닉네임 모달에 추가
            $("#feed_modal_image").html('<img style="width: 100%; height: 100%; border-radius: 10px" src="' + feed_image + '">');
            $("#feed_modal_feed_content").html('<div>' + feed_content + '</div>');
            $(".feed_modal_profile_image").html('<img  style="width: 100%; height: 100%" src="' + writer_profile_image + '">');
            $(".feed_modal_nickname").html('<div style="font-weight: bold; margin-right: 8px; font-size: 14px">' + writer_nickname + '</div>');
            // 정유진: 좋아요, 북마크 여부 확인 후 모달에 추가
            if (is_liked)
                $("#feed_modal_is_liked").html(
                    '<span id="favorite_' + feed_id + '" feed_id="' + feed_id + '" style="color: red" class="uTrue favorite material-symbols-outlined">favorite</span>');
            else
                $("#feed_modal_is_liked").html(
                    '<span id="favorite_' + feed_id + '" feed_id="' + feed_id + '" class="uFalse favorite material-symbols-outlined">favorite</span>');

            if (is_marked)
                $("#feed_modal_is_marked").html(
                    '<span id="bookmark_' + feed_id + '" feed_id="' + feed_id + '" class="uTrue bookmark material-symbols-outlined">bookmark</span>');
            else
                $("#feed_modal_is_marked").html(
                    '<span id="bookmark_' + feed_id + '" feed_id="' + feed_id + '" class="uFalse bookmark material-symbols-outlined">bookmark</span>');

            // 정유진: 좋아요 수, 게시물 작성시간 모달에 추가
            $("#feed_modal_like_count").html('<div style="font-size: 14px">좋아요 수 ' + like_count + '</div>');
            $("#feed_modal_feed_create_at").html(
                '<div style="font-size: 12px; color: gray; text-align: left; margin-bottom: 10px; margin-left: 16px">'
                + feed_create_at +
                '</div>');

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
                    },
                    error: function (request, status, error) {
                        console.log("에러");
                    },
                    complete: function () {
                        console.log("완료");

                    }
                });
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
            $("#feed_modal_reply_list").append('<div id="feed_modal_reply_' + relpy_upload_id + '" style="display: flex;margin-bottom: 15px;"></div>');

            $("#feed_modal_reply_" + relpy_upload_id).append('<div id="feed_modal_reply_profile_image_' + relpy_upload_id + '" class="box profile feed_profile_image" style="width: 32px;height: 32px; margin-right: 15px; min-width: 32px!important"></div>');
            $("#feed_modal_reply_" + relpy_upload_id).append('<div id="feed_modal_reply_nickname_content_' + relpy_upload_id + '" style="display: flex; align-items: start"></div>');

            $("#feed_modal_reply_nickname_content_" + relpy_upload_id).append('<div id="feed_modal_reply_nickname_' + relpy_upload_id + '" style="font-weight: bold; font-size: 14px; margin-right: 8px"></div>');
            $("#feed_modal_reply_nickname_content_" + relpy_upload_id).append('<div id="feed_modal_reply_content_' + relpy_upload_id + '" class="text_line" style="font-size: 14px"></div>');

            $("#feed_modal_reply_profile_image_" + relpy_upload_id).append('<img style="width: 100%; height: 100%" src="/media/' + data['user_profile_image'] + '">');
            $("#feed_modal_reply_nickname_" + relpy_upload_id).append('<div style="padding-top: 3px">' + data['user_nickname'] + '</div>');
            $("#feed_modal_reply_content_" + relpy_upload_id).append('<div style="padding-top: 3px">' + reply_content + '</div>');
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
