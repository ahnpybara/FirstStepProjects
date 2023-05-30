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

        if (search_box_value != "" & search_box_value !='#') {
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
                    for (let i = 0; i < data['prioritize_list'].length; i++) {
                        if (data['prioritize_list'][i]['content'] == undefined) {
                            // 정유진: 이미지는 경로가 따로 있어야 한다.
                            let user_profile_image = "/media/" + data['prioritize_list'][i].profile_image;
                            let user_nickname = data['prioritize_list'][i].nickname;
                            let user_name = data['prioritize_list'][i].name;

                            $("#auto_modal_list").append('<div id="auto_modal_object_' + i + '" class="movetoprofile auto_modal_object"></div>');

                            $("#auto_modal_object_" + i).append('<img id="' + user_nickname + '" class="box feed_profile_image auto_modal_image" src="' + user_profile_image + '">');
                            $("#auto_modal_object_" + i).append('<div id="auto_modal_nickname_name_' + i + '"></div>');

                            $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="auto_modal_text_object1">' + user_nickname + '</div>');
                            $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="auto_modal_text_object2">' + user_name + '</div>');

                            // 정유진: append에서 id 값을 user_nickname로 하면 $("#" + user_nickname).append가 되지 않아 따로 바꾼다.
                            document.getElementById("auto_modal_object_" + i).setAttribute("id", user_nickname);

                            // 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
                            $(".movetoprofile").click(function (event) {
                                let user_nickname = event.target.id;
                                location.href = "/content/reprofile?user_nickname=" + user_nickname;
                            });
                        } else {
                            let hashtag_content = data['prioritize_list'][i].content;
                            let hashtag_count = data['prioritize_list'][i].hashtag_count;
                            $("#auto_modal_list").append('<div id="auto_modal_object_' + i + '" class="hashtags auto_modal_object" hashtag_content="' + hashtag_content + '"></div>');

                            $("#auto_modal_object_" + i).append('<span class="auto_modal_hashtag_icon material-symbols-outlined" hashtag_content="' + hashtag_content + '">tag</span>');
                            $("#auto_modal_object_" + i).append('<div id="auto_modal_hashtag_' + i + '"></div>');

                            $("#auto_modal_hashtag_" + i).append('<div class="auto_modal_text_object1" hashtag_content="' + hashtag_content + '"> #' + hashtag_content + '</div>');
                            $("#auto_modal_hashtag_" + i).append('<div class="auto_modal_text_object2" hashtag_content="' + hashtag_content + '">게시물 ' + hashtag_count + '</div>');
                        }
                    }

                    // 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
                    $(".movetoprofile").click(function (event) {
                        let user_nickname = event.target.id;
                        location.href = "/content/reprofile?user_nickname=" + user_nickname;
                    });
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
        } else {
            $("#auto_modal_list").html('');
        }

    });
});