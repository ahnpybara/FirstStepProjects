// 회원가입 버튼 활성화 여부 변수
var check = [0, 0, 0, 0];

// 입력 타입에 따른 유효성 검사 함수
function validate(inputType, value) {
    var regularExpression;

    switch(inputType) {
        case "email":
            regularExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            break;
        case "password":
            regularExpression = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
            break;
        case "name":
        case "nickname":
            regularExpression = /^[^\s]+$/;
            break;
    }

    return regularExpression.test(value);
}

function addListeners(inputId, index, labelName) {
    var inputElement = document.getElementById(inputId);

    if (inputElement) {
        // 'input' 이벤트 리스너 추가: 입력란에 입력이 있을 때마다 실행됩니다.
        inputElement.addEventListener("input", function() {
            var floatingLabel = document.getElementById(labelName + "_floating_label");
            var inputValue = inputElement.value;

            // 유효성 검사 로직은 그대로 유지합니다.
            if (validate(labelName, inputValue)) {
                floatingLabel.style.color = "";
                floatingLabel.innerText = labelName.charAt(0).toUpperCase() + labelName.slice(1);
                check[index] = 1;
            } else {
                floatingLabel.style.color ="red";
                
                switch(labelName){
                    case 'email':
                        floatingLabel.innerText ="이메일 형식이 아닙니다";
                        break; 
                    case 'password':
                        floatingLabel.innerText ="영문자, 숫자가 포함되어야 합니다(6자 이상)";
                        break; 
                    default:
                        floatingLabel.innerText ="공백이 포함되면 안됩니다.";
                        break; 
               }
               
               check[index] = 0;
           }
           
           updateSignUpButtonStatus(); // 회원가입 버튼 상태 업데이트
           
       });

       // 'blur' 이벤트 리스너 추가: 입력란에서 포커스가 벗어날 때 실행됩니다.
       inputElement.addEventListener("blur", function() {
           var floatingLabel = document.getElementById(labelName + "_floating_label");

           // 포커스가 벗어나면 라벨 색상 초기화 및 텍스트 원래대로 설정
           floatingLabel.style.color ="";
           floatingLabel.innerText=labelName.charAt(0).toUpperCase() + labelName.slice(1); // 첫 글자 대문자로 변경
       });
   } else {
       console.error("Invalid inputId:", inputId);
   }
}

// 모든 입력란이 유효성에 맞는지 확인
function checkAllInputsValid() {
    for (var i = 0; i < check.length; i++) {
        if (check[i] !== 1) {
            return false;
        }
    }
    return true;
}

// 회원가입 버튼 엘리먼트 가져오기
var signUpButton = document.getElementById("signup_button");

// 입력란 변화 시마다 checkAllInputsValid 함수 호출하여 회원가입 버튼 활성화 여부 결정
function updateSignUpButtonStatus() {
    if (checkAllInputsValid()) {
        signUpButton.disabled = false; // 활성화
        signUpButton.style.backgroundColor = "#6b6bef"; // 파란색 배경색으로 변경
    } else {
        signUpButton.disabled = true; // 비활성화
        signUpButton.style.backgroundColor = ""; // 원래 색상으로 되돌리기 (기본값 또는 다른 스타일 시트에 정의된 값)
    }
}


// 각 입력란에 이벤트 리스너 추가
addListeners("input_email", 0,"email");
addListeners("input_password", 1,"password");
addListeners("input_name",2,"name");
addListeners("input_nickname",3,"nickname");

// 회원가입 버튼 초기 설정
updateSignUpButtonStatus();