// 정유진: 로그인 버튼 비활성화
document.getElementById("access_button").disabled = true;
// 정유진: 이메일 유효성 확인. {,}는 최소 수와 최대 수를 나타낸다.
// 정유진: W3C에 나와있는 이메일 정규식은 /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

$('#input_email').keyup(function () {
    let email = $('#input_email').val();
    let emailError = $('#email_error');
    emailError.css("color", "#ff0000");

    // 정유진: 이메일 유효성 확인
    if (!emailRegex.test(email)) {
        emailError.show().text("올바른 이메일 양식이 아닙니다!")
        document.getElementById("access_button").disabled = true;
        // 정유진: 이메일 입력창이 공백이면 다시 검은 글자로 돌아간다.
        if (email == "") {
            emailError.show().text("이메일 주소");
            emailError.css("color", "#000000");
        }
    } else {
        emailError.show().text("이메일");
        emailError.css("color", "#000000");
        let password = $('#input_password').val();
        // 정유진: 비밀번호도 입력되면 버튼 활성화
        if (password == "") {
            document.getElementById("access_button").disabled = true;
        } else {
            document.getElementById("access_button").disabled = false;
        }
    }
})
$('#input_password').keyup(function () {
    let password = $('#input_password').val();
    let email = $('#input_email').val();
    if (password != "") {
        // 정유진: 이메일 유효성 확인 후 버튼 활성화
        if (!emailRegex.test(email)) {
            document.getElementById("access_button").disabled = true;
        } else {
            document.getElementById("access_button").disabled = false;
        }
    }
})
// 로그인 버튼 클릭시 이벤트 처리
$('#access_button').click(function () {
    // 각각의 입력 폼에 입력된 내용을 가지고 와서 각각의 변수에 저장
    let email = $('#input_email').val();
    let password = $('#input_password').val();

    // 서버로 보내기 위해서 접속할 url : "/user/login"이며 보낼 데이터는 사용자 정보, 방식은 POST (Json 형태)
    $.ajax({
        url: "/user/login",
        data: {
            email: email,
            password: password
        },
        method: "POST",
        success: function (data) {
            console.log("성공");
            if (data) {
                let emailError = $('#email_error');
                emailError.css("color", "#ff0000");
                emailError.show().text(data.message);
            } else {
                alert("로그인 성공");
                location.replace('/main');
            }
        },
        error: function (request, status, error) {
            console.log("에러");
        },
        complete: function () {
            console.log("완료");
        }
    });
});