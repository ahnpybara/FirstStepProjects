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
                                    search_box_value = search_box_value.replace('#', '')
                                    $("#auto_modal_list").append('<div id="auto_modal_object_bundle" class="hashtags auto_modal_object" hashtag_content="' + search_box_value + '모음보기"></div>');
                                    $("#auto_modal_object_bundle").append('<span class="auto_modal_hashtag_icon material-symbols-outlined" hashtag_content="' + search_box_value + '모음보기">tag</span>');
                                    $("#auto_modal_object_bundle").append('<div id="auto_modal_hashtag_bundle"></div>');

                                    $("#auto_modal_hashtag_bundle").append('<div class="auto_modal_text_object1" hashtag_content="' + search_box_value + '모음보기">' + search_box_value + ' 모음보기</div>');
                                }
                                // 정유진: hashtag_bundle_count는 가장 마지막에 측정되서 마지막 루프 때.
                                if (i == data['prioritize_list'].length - 1) {
                                    $("#auto_modal_hashtag_bundle").append('<div class="auto_modal_text_object2" hashtag_content="' + search_box_value + '모음보기">게시물 ' + hashtag_bundle_count + '</div>');
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


//채팅할 친구 목록 모달창 여는 이벤트 처리 ajax
var ajax_call = function (url) {
    var request = $.ajax({
        url: url, // 요청할 url
        method: 'GET', // 요청 방식
        contentType: 'application/text',  // 서버로 전송되는 데이터 형태
    });

    return request;
};

// 채팅할 친구 목록 모달창 이벤트 처리 함수
var open_article1 = function (url) {
    ajax_call(url).done(function (text) { // ajax 요청이 완료된 경우
        document.querySelector('.chat_modal_user_area').innerHTML = text; // 채팅 유저 모달창 내용을 서버로부터 받은 내용으로 셋팅
        document.getElementById('chat_user_modal_id').style.display = 'flex'; // 채팅 유저 목록 모달창을 flex로 설정하여 보여줌
        document.getElementById('chat_modal_id').style.display = 'none'; // 채팅 모달창을 none로 설정

    });
};

//채팅창 여는 이벤트 처리 ajax
var ajax_call = function (url, user_email) {

    var request = $.ajax({
        url: url, // 요청할 자원
        method: 'GET', // 요청 방식
        contentType: 'application/text',  // 서버로 전송되는 데이터 형태
        data: {
            user_email: user_email
        }
    });

    return request;
};

//채팅창 여는 이벤트 처리 함수
var open_article2 = function (url, user_email) {
    ajax_call(url, user_email).done(function (text) { // ajax 요청이 완료된 경우
        document.querySelector('.chat_modal_text_area').innerHTML = text; // 채팅 모달창 내용을 서버로부터 받은 내용으로 셋팅
        document.getElementById('chat_modal_id').style.display = 'flex'; // 채팅 모달창을 flex로 설정하여 보여줌
        document.getElementById('chat_user_modal_id').style.display = 'none'; // 채팅 유저 목록 모달창을 none로 설정

        // 채팅 불러오기 알람 관련 js 코드
        // 새로운 <div> 요소를 생성하여 toastElement 변수에 할당합니다.
        var toastElement = document.createElement("div");
        // chat_alarm 클래스를 toastElement 요소에 추가합니다. 이를 통해 CSS 스타일이 적용될 수 있습니다.
        toastElement.classList.add("chat_alarm");
        // 알림창에 표시될 텍스트를 설정합니다.
        toastElement.textContent = "채팅을 불러왔습니다.";
        // toastElement를 <body> 요소에 추가합니다. 이로써 알림창이 화면에 표시됩니다.
        document.body.appendChild(toastElement);
        // 2초 후에 실행되는 함수를 설정합니다.
        setTimeout(function () {
            // toastElement의 스타일 속성을 수정하여 fadeOut 애니메이션을 적용하고, 알림창이 사라지도록 설정합니다.
            toastElement.style.animation = "fadeOut 2s forwards";
            // 2초 후에 실행되는 함수를 설정합니다.
            setTimeout(function () {
                // toastElement를 DOM에서 제거하여 알림창을 완전히 사라지게 합니다.
                toastElement.remove();
            }, 2000);
        }, 2000);

        // 채팅 업로드 버튼 이벤트 처리
        $(".upload_chat").click(function (event) {
            // 채팅 입력란에서 채팅 내용과 채팅을 받을 유저 정보를 가져옴
            let chat_content = $('#chat_text_box').val();
            let receive_chat_user = event.target.attributes.getNamedItem('receive_chat_user').value;

            // 채팅의 길이가 0보다 작으면 알림창 뜸
            if (chat_content.length <= 0) {
                alert("채팅을 입력하세요");
                return 0;
            }
            $.ajax({
                url: "/user/chatting",
                data: {
                    chat_content: chat_content,
                    receive_chat_user: receive_chat_user,
                },
                method: "POST",
                success: function (data) {
                    console.log("성공");
                    // 채팅 비동기 전송을 위한 코드
                    $('.chat_modal_content_area').append("<div class='send_chat_area'>" +
                        "<span class='send_chat_cont'>" +
                        "<span class='send_chat'>" + data.chat_content + "</span>" +
                        "</span>" +
                        "</div>");
                    // 스크롤을 최하단으로 이동( 입력되고 스크롤을 아래로 이동해야 최하단으로 이동됩니다.)
                    $('.chat_modal_content_area').scrollTop($('.chat_modal_content_area')[0].scrollHeight);
                },
                error: function (request, status, error) {
                    console.log("에러");
                },
                complete: function () {
                    console.log("완료");
                    // 댓글을 입력하고 나면 댓글 입력 폼을 비워야 함.
                    $('#chat_text_box').val('');
                }
            });
        });
        // 채팅 화면에서 다른 사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
        $(".movetoprofile").click(function (event) {
            let user_nickname = event.target.id;
            location.href = "/user/reprofile?user_nickname=" + user_nickname;
        });
    });
};

// 채팅 유저 목록 모달창 드래그로 이동하는 코드, 문서가 로드되면 실행할 함수.
$(document).ready(function () {
    //모달과 모달헤더를 각각 잡아주고 마우스 위치의 오프셋 값을 저장하는 객체 변수를 초기화합니다. 드래그 동작 여부를 저장하는 변수를 초기화합니다.
    var modal = $('.chat_user_modal_area');
    var modalHeader = $('.chat_user_modal_header');
    var mouseOffset = {x: 0, y: 0};
    var isDragging = false;

    // 모달 헤더에서 마우스를 눌렀을 때 실행할 함수를 정의. 마우스 위치와 모달의 현재 위치 간의 상대적인 오프셋 값을 계산하여 저장
    modalHeader.mousedown(function (e) {
        isDragging = true;
        mouseOffset = {x: e.pageX - modal.offset().left, y: e.pageY - modal.offset().top};
    });

    // 모달 헤더에서 마우스 버튼을 놓았을 때 실행할 함수를 정의.
    $(document).mouseup(function () {
        isDragging = false;
    });

    // 모달 헤더에서 마우스를 움직일 때 실행할 함수를 정의. 드래그 동작 중일 때만 실행 마우스의 움직임에 따라 모달의 위치를 변경합니다. 상대적인 오프셋 값으로 모달의 위치를 설정합니다.
    $(document).mousemove(function (e) {
        if (isDragging) {
            modal.offset({
                top: e.pageY - mouseOffset.y,
                left: e.pageX - mouseOffset.x
            });
        }
    });
    //모달 영역에서 마우스가 벗어났을 때 실행할 함수를 정의.
    modal.mouseleave(function () {
        isDragging = false;
    });
});

// 채팅창 모달창 드래그로 이동하는 코드 문서가 로드되면 실행할 함수.
$(document).ready(function () {
    //모달과 모달헤더를 각각 잡아주고 마우스 위치의 오프셋 값을 저장하는 객체 변수를 초기화합니다. 드래그 동작 여부를 저장하는 변수를 초기화합니다.
    var modal = $('.chat_modal_area');
    var modalHeader = $('.chat_modal_header');
    var mouseOffset = {x: 0, y: 0};
    var isDragging = false;

    // 모달 헤더에서 마우스를 눌렀을 때 실행할 함수를 정의. 마우스 위치와 모달의 현재 위치 간의 상대적인 오프셋 값을 계산하여 저장
    modalHeader.mousedown(function (e) {
        isDragging = true;
        mouseOffset = {x: e.pageX - modal.offset().left, y: e.pageY - modal.offset().top};
    });

    // 모달 헤더에서 마우스 버튼을 놓았을 때 실행할 함수를 정의.
    $(document).mouseup(function () {
        isDragging = false;
    });

    // 모달 헤더에서 마우스를 움직일 때 실행할 함수를 정의. 드래그 동작 중일 때만 실행 마우스의 움직임에 따라 모달의 위치를 변경합니다. 상대적인 오프셋 값으로 모달의 위치를 설정합니다.
    $(document).mousemove(function (e) {
        if (isDragging) {
            modal.offset({
                top: e.pageY - mouseOffset.y,
                left: e.pageX - mouseOffset.x
            });
        }
    });
    //모달 영역에서 마우스가 벗어났을 때 실행할 함수를 정의.
    modal.mouseleave(function () {
        isDragging = false;
    });
});

// 채팅 모달창 닫기 버튼 이벤트 처리 (클래스명으로 해야함 why? TODO)
$(".chat_modal_close").click(function () {
    // 채팅 모달창 숨김, 채팅 모달창 위치 초기화
    $('#chat_modal_id').css({
        display: 'none',
        top: '382.438px',
        left: '1305.6px',
    });
    // 채팅 유저 목록 모달창 숨김, 채팅 유저 목록 모달창 위치 초기화
    $('#chat_user_modal_id').css({
        display: 'none',
        top: '382.438px',
        left: '1305.6px',
    });
});