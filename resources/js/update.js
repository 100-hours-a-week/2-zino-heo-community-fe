// 비밀번호 헬퍼 텍스트 요소
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordHelperText = passwordInput.nextElementSibling; // 비밀번호 헬퍼 텍스트
const confirmPasswordHelperText = confirmPasswordInput.nextElementSibling; // 비밀번호 확인 헬퍼 텍스트
const defaultPasswordHelperText = '* 비밀번호를 입력해주세요.';
const defaultConfirmPasswordHelperText = '* 비밀번호를 한번 더 입력해주세요.';
const completeButton = document.querySelector('.complete-button'); // 토스트 메시지를 표시할 버튼
passwordHelperText.textContent = defaultPasswordHelperText;
confirmPasswordHelperText.textContent = defaultConfirmPasswordHelperText;

// Signup 버튼 정의
const signupButton = document.getElementById('login-btn'); // signupButton의 ID가 'login-btn'이라고 가정

// 비밀번호 유효성 검사 함수
function isValidPassword(password) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/; // 정규 표현식
  return passwordPattern.test(password); // 유효성 검사
}

function validatePassword() {
  const passwordValue = passwordInput.value.trim();
  const confirmPasswordValue = confirmPasswordInput.value.trim();

  // 비밀번호 검사
  if (!passwordValue) {
    passwordHelperText.textContent = defaultPasswordHelperText; // 비밀번호가 비어 있을 경우
  } else if (!isValidPassword(passwordValue)) {
    passwordHelperText.textContent =
      '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 1개씩 포함해야 합니다.'; // 유효성 오류
  } else {
    passwordHelperText.textContent = ''; // 비밀번호가 유효할 경우 헬퍼 텍스트 비우기
  }

  // 비밀번호 확인 검사
  if (!confirmPasswordValue) {
    confirmPasswordHelperText.textContent = defaultConfirmPasswordHelperText; // 비밀번호 확인이 비어 있을 경우
  } else if (passwordValue !== confirmPasswordValue) {
    confirmPasswordHelperText.textContent = '* 비밀번호가 다릅니다.'; // 비밀번호와 비밀번호 확인이 다를 경우
  } else {
    confirmPasswordHelperText.textContent = ''; // 비밀번호 확인이 유효할 경우 헬퍼 텍스트 비우기
  }

  updateSignupButton(); // 버튼 상태 업데이트
}

// 비밀번호 입력 시 유효성 검사
passwordInput.addEventListener('input', validatePassword); // 유효성 검사 호출
confirmPasswordInput.addEventListener('input', validatePassword); // 유효성 검사 호출

function updateSignupButton() {
  const isValid =
    passwordHelperText.textContent === '' &&
    confirmPasswordHelperText.textContent === '';

  console.log('isValid:', isValid); // 현재 유효성 검사 상태 출력

  signupButton.disabled = !isValid; // 유효하지 않으면 버튼 비활성화

  // 버튼 색상 설정
  if (isValid) {
    signupButton.style.backgroundColor = '#7F6AEE'; // 유효할 경우 색상
  } else {
    signupButton.style.backgroundColor = '#ACA0EB'; // 유효하지 않을 경우 색상
  }
}

// 수정하기 버튼 클릭 이벤트 추가
signupButton.addEventListener('click', function () {
  const isValid =
    passwordHelperText.textContent === '' &&
    confirmPasswordHelperText.textContent === '';

  if (isValid) {
    const email = JSON.parse(localStorage.getItem('user')).email; // 로컬 스토리지에서 이메일 가져오기
    const newPassword = passwordInput.value.trim(); // 새 비밀번호

    // PUT 요청 보내기
    fetch('http://localhost:3000/api/users/password/update-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email, // 사용자 이메일
        password: newPassword, // 새 비밀번호
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('비밀번호 수정 중 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        showToastMessage('비밀번호가 수정되었습니다.'); // 성공 메시지
        localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
        window.location.href = '../../views/member/login.html'; // 로그인 페이지로 리다이렉트
      })
      .catch((error) => {
        alert(error.message); // 오류 메시지 표시
      });
  }
});

// 토스트 메시지 표시 함수
function showToastMessage(message) {
  completeButton.textContent = message;
  completeButton.style.display = 'block'; // 버튼을 보여줌
  completeButton.style.opacity = 1; // 투명도를 1로 설정하여 보이게 함

  setTimeout(function () {
    completeButton.style.opacity = 0; // 투명도를 0으로 설정하여 사라지게 함
    setTimeout(function () {
      completeButton.style.display = 'none'; // 버튼을 숨김
    }, 500); // 0.5초 후에 숨김 (사라지는 애니메이션 시간)
  }, 2000); // 2초 후에 사라짐
}
