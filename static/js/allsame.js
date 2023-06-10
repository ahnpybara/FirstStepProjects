// 자동완성 모달창과 검색창의 아이디 값을 가져온다.
let auto_modal = document.getElementById('auto_modal').getAttribute("id");
let search_box = document.getElementById('search_box').getAttribute("id");

// 모달 바깥부분을 클릭하면 안 보에게 된다.
window.addEventListener('mouseup', function (event) {
    // 클릭한 곳의 id 값이 널이거나 auto_modal이 포함되어 있지 않거나 search_box이 포함되어 있지 않으면 창을 안 보이게 설정
    if ((event.target.getAttribute("id") == null) || !((event.target.getAttribute("id").includes(auto_modal)) || (event.target.getAttribute("id").includes(search_box)))) {
        $('#auto_modal').css({
            display: 'none'
        });
    }
});

// 검색 자동완성 모달창 반응형 적용, 브라우저 창이 줄어들게 될 경우 아래 코드를 실행
window.addEventListener('resize', function () {
    // search_box라는 id를 가진 요소를 가져옴
    let search_box = document.getElementById('search_box');
    //  해당 요소의 위치 값 구함
    let rect = search_box.getBoundingClientRect();
    // 요소 값들 중에서 left 요소의 값을 구함
    let left_value = rect.left;
    // 검색창이 없을 경우 (left_value가 0이됨)
    if (left_value == 0) {
        $('#auto_modal').css({
            display: 'none'
        });
    } else { // 검색창이 있을 경우 줄어드는 크기에 맞춰서 이동시킴
        $('#auto_modal').css({
            left: left_value + 'px'
        });
    }
});

// 검색창을 클릭하면 자동완성 모달창이 뜬다(이미 창이 줄었을 경우 그때 검색창을 클릭하게 된다면 해당 위치에 보여줘야 함)
var typingTimer; // 정유진: 타이머 변수.
var doneTypingInterval = 700; // 정유진: 작동할 시간 간격. 1000 = 1초
$('#search_box').mousedown(function () {
    // search_box라는 id를 가진 요소를 가져옴
    let element = document.getElementById('search_box');
    //  해당 요소의 위치 값 구함
    let rect = element.getBoundingClientRect();
    // 요소 값들 중에서 left 요소의 값을 구함
    let left_value = rect.left;
    // 이동된 검색창 위치를 계산해서 검색창 바로 밑에 자동완성 창을 띄움
    $('#auto_modal').css({
        display: 'flex',
        left: left_value + 'px'
    });
    // 자동완성에 필요한 검색창의 값을 keyup 이벤트로 가져온다. TODO 시간차 텀
    $('#search_box').keyup(function () {
        // 이전 타이머 제거. 이전에 입력된 값이 서버에 안 보내지 않고 제거.
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            let search_box_value = document.getElementById('search_box').value;
            // 해시태그 검색 시 #만 있거나 아무것도 없으면 검색 안됨.
            if (search_box_value != "" & search_box_value != '#') {
                // 가져온 값을 서버로 보낸다.
                $.ajax({
                    url: "/content/autocomplete",
                    data: {
                        search_box_value: search_box_value
                    },
                    method: "GET",
                    // data에는 자동 완성에 필요한 검색어로 필터링된 유저의 객체 리스트와, 검색어로 필터링된 해시태그 리스트를 합친 prioritize_list 리스트가 존재
                    success: function (data) {
                        console.log("성공");
                        // 키 입력이 검색 키워드 변경으로 인해 새로운 자동완성 모달창 다시 만들어줘야 하기 위해서 모달창을 비움
                        $("#auto_modal_list").html('');
                        // 정유진: 해시태그 모음의 게시글 수
                        let hashtag_bundle_count = 0
                        // prioritize_list 리스트에 있는 요소 수 만큼 반복
                        for (let i = 0; i < data['prioritize_list'].length; i++) {
                            // 사용자 검색 시(prioritize_list 리스트에 content의 정보가 없을 경우 -> 유저 검색)
                            if (data['prioritize_list'][i]['content'] == undefined) {
                                // prioritize_list 리스트에서 검색 키워드에 필터링된 유저 정보를 꺼냄 (이미지는 경로가 따로 있어야 한다.)
                                let user_profile_image = "/media/" + data['prioritize_list'][i].profile_image;
                                let user_nickname = data['prioritize_list'][i].nickname;
                                let user_name = data['prioritize_list'][i].name;

                                // 자동완성 모달창에 자동완성 목록을 만드는 과정
                                $("#auto_modal_list").append('<div id="auto_modal_object_' + i + '" class="movetoprofile auto_modal_object"></div>');

                                $("#auto_modal_object_" + i).append('<img id="' + user_nickname + '" class="box feed_profile_image auto_modal_image" src="' + user_profile_image + '">');
                                $("#auto_modal_object_" + i).append('<div id="auto_modal_nickname_name_' + i + '"></div>');

                                $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="auto_modal_text_object1">' + user_nickname + '</div>');
                                $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="auto_modal_text_object2">' + user_name + '</div>');

                                // 정유진: append에서 id 값을 user_nickname로 하면 $("#" + user_nickname).append가 되지 않아 따로 바꾼다.
                                // 자동완성 목록에서 닉네임, 프로필 사진, 이름 뿐만 아니라 나머지 빈 영역을 클릭해도 프로필로 이동이 되더야 하기 때문에 id를 유저 닉네임으로 변경 해줘야 함
                                document.getElementById("auto_modal_object_" + i).setAttribute("id", user_nickname);
                            }
                            // 해시태그 검색 시
                            else {
                                // prioritize_list 리스트에서 검색 키워드에 필터링된 해시태그 정보를 꺼냄
                                let hashtag_content = data['prioritize_list'][i].content;
                                let hashtag_count = data['prioritize_list'][i].hashtag_count;
                                hashtag_bundle_count += hashtag_count

                                // 자동완성 모달창에 자동완성 목록을 만드는 과정
                                // 정유진: 가장 앞에 만들기 위해서.
                                if (i == 0) {
                                    $("#auto_modal_list").append('<div id="auto_modal_object_bundle" class="hashtags auto_modal_object" hashtag_content="' + search_box_value + '"></div>');
                                    $("#auto_modal_object_bundle").append('<span class="auto_modal_hashtag_icon material-symbols-outlined" hashtag_content="' + search_box_value + '">tag</span>');
                                    $("#auto_modal_object_bundle").append('<div id="auto_modal_hashtag_bundle"></div>');

                                    $("#auto_modal_hashtag_bundle").append('<div class="auto_modal_text_object1" hashtag_content="' + search_box_value + '">' + search_box_value + ' 모음보기</div>');
                                }
                                // 정유진: hashtag_bundle_count는 가장 마지막에 측정되서 마지막 루프 때.
                                if (i == data['prioritize_list'].length - 1) {
                                    $("#auto_modal_hashtag_bundle").append('<div class="auto_modal_text_object2" hashtag_content="' + search_box_value + '">게시물 ' + hashtag_bundle_count + '</div>');
                                }

                                $("#auto_modal_list").append('<div id="auto_modal_object_' + i + '" class="hashtags auto_modal_object" hashtag_content="' + hashtag_content + '"></div>');
                                $("#auto_modal_object_" + i).append('<span class="auto_modal_hashtag_icon material-symbols-outlined" hashtag_content="' + hashtag_content + '">tag</span>');
                                $("#auto_modal_object_" + i).append('<div id="auto_modal_hashtag_' + i + '"></div>');

                                $("#auto_modal_hashtag_" + i).append('<div class="auto_modal_text_object1" hashtag_content="' + hashtag_content + '"> #' + hashtag_content + '</div>');
                                $("#auto_modal_hashtag_" + i).append('<div class="auto_modal_text_object2" hashtag_content="' + hashtag_content + '">게시물 ' + hashtag_count + '</div>');

                            }
                        }

                        // 화면에서 다른 사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
                        $(".movetoprofile").click(function (event) {
                            let user_nickname = event.target.id;
                            location.href = "/user/reprofile?user_nickname=" + user_nickname;
                        });
                        // 해시태그 클릭시 해시태그 검색이 실행 됨
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
        }, doneTypingInterval);
    });
});