// 05-09 유재우 회원탈퇴를 위한
$('#profile_dele_btn').click(function () {
    if (confirm("유저 정보를 삭제 하시겠습니까?")) {
        delete_profile_Fn()
    }
});

function delete_profile_Fn() {
    let email = "{{ user_session.email }}"

    $.ajax({
        url: "/user/profile/remove",
        data: {
            email: email
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            alert("프로필이 성공적으로 삭제 되었습니다.");
            location.replace("");
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
function profile_upload() {
    let file = $('#input_profileimage_upload')[0].files[0];
    let email = "{{ user_session.email }}"
    let fd = new FormData();

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

    let email = "{{ user_session.email }}";

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
    let email = "{{ user_session.email }}";
    let password = $('#input_password').val();
    $.ajax({
        url: "/user/updatepassword",
        data: {
            email: email,
            password: password
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            location.replace('/user/profile/setting');

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
    let email = "{{ user_session.email }}";
    let nikname = $('#nikname_ta').val();
    $.ajax({
        url: "/user/profile/updatenickname",
        data: {
            email: email,
            nickname: nikname
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            location.replace('/user/profile/setting');
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
    let user_email = "{{ user_session.email }}";
    let email = $('#email_ta').val();

    $.ajax({
        url: "/user/profile/updateemail",
        data: {
            user_email: user_email,
            email: email
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            location.replace('/user/profile/setting');

        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
        }
    });
})