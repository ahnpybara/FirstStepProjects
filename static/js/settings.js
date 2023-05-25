// 정유진: 버튼 비활성화
document.getElementById("update_nikname_btn").disabled = true;
document.getElementById("update_email_btn").disabled = true;
document.getElementById("update_password_btn").disabled = true;

// 정유진: 이메일 정규식 확인. {,}는 최소 수와 최대 수를 나타낸다.
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//최소 8자 최대 24자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자. 특수 문자는 ~!@#$%^&*_+\-.<>/? 만 가능
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*_+\-.<>/?])[A-Za-z\d~!@#$%^&*()_+\-=`[~!@#$%^&*_+\-.<>/?]{8,24}$/;

// 정유진: 변경 전 nickname과 email
let nickname_current = $('#nickname_error').text();
let email_current = $('#email_error').text();

// 정유진: 이메일 주소 유호성 확인. 이메일 양식. 이메일 주소 길이.
$('#input_email').keyup(function () {
    let email = $('#input_email').val();
    let emailError = $('#email_error');
    emailError.css("color", "#ff0000");

    // 정유진: 이메일 유효성 확인. 이메일 양식.
    if (!emailRegex.test(email)) {
        emailError.show().text("올바른 이메일 양식이 아닙니다!")
        document.getElementById("update_email_btn").disabled = true;
        // 정유진: 공백으로 지우면 다시 회색 글자.
        if (email == "") {
            emailError.show().text(email_current);
            emailError.css("color", "gray");
            document.getElementById("update_email_btn").disabled = true;
        }
    } else {
        // 정유진: 이메일 주소 길이 확인.
        if (email.length > 24) {
            emailError.show().text("이메일 주소가 너무 깁니다.")
            document.getElementById("update_email_btn").disabled = true;
        } else {
            emailError.show().text("이메일");
            emailError.css("color", "gray");
            document.getElementById("update_email_btn").disabled = false;
        }
    }
})

// 정유진: 닉네임 유호성 확인. 공백 포함 안 되게. 수정필요
$('#input_nickname').keyup(function () {
    let nickname = $('#input_nickname').val();
    let nicknameError = $('#nickname_error');
    if (nickname == "") {
        nicknameError.show().text(nickname_current);
        nicknameError.css("color", "gray");
        document.getElementById("update_nikname_btn").disabled = true;
    } else {
        // 정유진: 닉네임에 공백을 포함하지 못하게 한다.
        if (nickname.indexOf(' ') !== -1) {
            nicknameError.css("color", "#ff0000");
            nicknameError.show().text("공백은 넣을 수 없습니다.")
            document.getElementById("update_nikname_btn").disabled = true;
        } else {
            // 정유진: 닉네임 길이 제한
            if (nickname.length > 24) {
                nicknameError.show().text("닉네임이 너무 깁니다.")
                document.getElementById("update_nikname_btn").disabled = true;
            } else {
                nicknameError.show().text("닉네임");
                nicknameError.css("color", "gray");
                document.getElementById("update_nikname_btn").disabled = false;
            }
        }
    }
});

// 정유진: 비밀번호 유효성 확인
$('#input_password').keyup(function () {
    let password = $('#input_password').val();
    let passwordError = $('#password_error');
    passwordError.css("color", "#ff0000");

    // 정유진: 유효성 확인
    if (!passwordRegex.test(password)) {
        passwordError.show().text("8~25자, 문자, 숫자, 특수문자 포함")
        document.getElementById("update_password_btn").disabled = true;
        if (password == "") {
            passwordError.show().text("비밀번호");
            passwordError.css("color", "gray");
            document.getElementById("update_password_btn").disabled = true;
        }
    } else {
        passwordError.show().text("비밀번호");
        passwordError.css("color", "gray");
        document.getElementById("update_password_btn").disabled = false;

    }
});

// 05-09 유재우 회원탈퇴를 위한
$('#profile_dele_btn').click(function () {
    var user_session_email = $(this).attr('user_session_email');
    if (confirm("유저 정보를 삭제 하시겠습니까?")) {
        delete_profile_Fn(user_session_email)
    }
});

function delete_profile_Fn(session_email) {

    let email = session_email;

    $.ajax({
        url: "/user/profile/remove",
        data: {
            email: email
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            alert("프로필이 성공적으로 삭제 되었습니다.");
            location.replace("/user/login");
        },
        error: function (request, status, error) {
            console.log("에러")
            alert(email);
        },
        complete: function () {
            console.log("완료");
        }
    })
}


// 프로필 사진 업로드 버튼 클릭시 이벤트 처리
$('#button_profile_upload').click(function () {
    $('#input_profileimage_upload').click();
});

// 프로필 사진 업로드 하는 함수와  ajax
function profile_upload(session_email) {
    let file = $('#input_profileimage_upload')[0].files[0];
    let email = session_email
    let fd = new FormData();
    console.log(email);

    fd.append('file', file);
    fd.append('email', email);

    $.ajax({
        url: "/user/profile/upload",
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
            location.replace("/user/profile/setting");
        }
    });

}

// 05-07 유재우 : 프로필 사진 삭제 버튼 눌렸을 때 프로필 사진을 디폴트 값으로 바꿔주는 부분 TODO
$('#button_profile_reset').click(function () {
    var email = $(this).attr('user_session_email');
    console.log(email);

    $.ajax({
        url: "/user/profile/reset",
        data: {
            email: email
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            alert("프로필이 성공적으로 삭제 되었습니다.");
            location.replace("/user/profile/setting");
        },
        error: function (request, status, error) {
            console.log("에러")
        },
        complete: function () {
            console.log("완료");
        }
    })
});

//05-14 유재우 : 비밀번호 변경
$('#update_password_btn').click(function () {
    var email = $(this).attr('user_session_email');
    let password = $('#input_password').val();
    console.log(email);

    $.ajax({
        url: "/user/updatepassword",
        data: {
            email: email,
            password: password
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            location.replace('/user/login');
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
        }
    });
})

//05-14 유재우 : 닉네임 변경
$('#update_nikname_btn').click(function () {
    var email = $(this).attr('user_session_email');
    let nikname = $('#input_nickname').val();
    console.log(email);

    $.ajax({
        url: "/user/profile/updatenickname",
        data: {
            email: email,
            nickname: nikname
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            if (data) {
                $('#nickname_error').css("color", "#ff0000");
                $('#nickname_error').show().text(data.message);
                $('#nickname_error').focus();
            } else {
                location.replace('/user/profile/setting');
            }
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
        }
    });
})
//05-15 유재우 : 이메일 변경
$('#update_email_btn').click(function () {
    var user_email = $(this).attr('user_session_email');
    let email = $('#input_email').val();
    console.log(user_email);

    $.ajax({
        url: "/user/profile/updateemail",
        data: {
            user_email: user_email,
            email: email
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            if (data) {
                $('#email_error').css("color", "#ff0000");
                $('#email_error').show().text(data.message)
                $('#email_error').focus();
            } else {
                location.replace('/user/profile/setting');
            }
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
        }
    });
})
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

                        $("#auto_modal_object_" + i).append('<img id="' + user_nickname + '" class="profile_box box profile feed_profile_image " style="width: 35px; height: 35px" src="' + user_profile_image + '">');
                        $("#auto_modal_object_" + i).append('<div id="auto_modal_nickname_name_' + i + '"></div>');

                        $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="feed_nickname">' + user_nickname + '</div>');
                        $("#auto_modal_nickname_name_" + i).append('<div id="' + user_nickname + '" class="feed_nickname" style="">' + user_name + '</div>');

                        // 정유진: append에서 id 값을 user_nickname로 하면 $("#" + user_nickname).append가 되지 않아 따로 바꾼다.
                        document.getElementById("auto_modal_object_" + i).setAttribute("id", user_nickname);

                        // 화면에서 다른사용자의 프로필 클릭시 해당 사용자의 프로필로 이동
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