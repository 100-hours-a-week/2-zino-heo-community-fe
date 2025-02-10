const loginButton = document.querySelector('.login-btn');

// DOMContentLoaded 이벤트를 사용하여 DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function () {
  // 초기 에러 메시지 설정
  const passwordError = document.getElementById('passwordError');
  passwordError.textContent = '* 비밀번호를 입력해주세요';

  // 비밀번호 유효성 검사
  document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    // 비밀번호 유효성 검사
    if (password === '') {
      passwordError.textContent = '* 비밀번호를 입력해주세요';
      loginButton.style.backgroundColor = '#ACA0EB';
    } else if (!passwordPattern.test(password)) {
      passwordError.textContent =
        '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개를 포함해야 합니다.';
      loginButton.style.backgroundColor = '#ACA0EB';
    } else {
      passwordError.textContent = ''; // 에러 메시지 초기화
      loginButton.style.backgroundColor = '#7F6AEE';
    }
  });

  // 로그인 폼 제출 이벤트
  document
    .getElementById('loginForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault(); // 기본 제출 동작 방지

      const email = document.getElementById('email').value; // 이메일 입력값
      const password = document.getElementById('password').value; // 비밀번호 입력값

      // 서버에 로그인 요청
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // 이메일과 비밀번호 전송
          credentials: 'include', // 쿠키를 포함하여 요청
        });

        if (response.ok) {
          const data = await response.json();
          console.log('로그인 성공:', data);
          window.location.href = '../../views/main/index.html'; // 대시보드 페이지로 이동
        } else {
          const errorData = await response.json();
          passwordError.textContent = errorData.error; // 서버에서 받은 오류 메시지 표시
          passwordError.style.display = 'block'; // 에러 메시지 표시
        }
      } catch (error) {
        console.error('Network error:', error);
        passwordError.textContent = '* 로그인 중 오류가 발생했습니다.'; // 네트워크 오류 메시지
        passwordError.style.display = 'block'; // 에러 메시지 표시
      }
    });
});

// 회원가입 페이지로 이동
document.getElementById('create_member').addEventListener('click', function () {
  window.location.href = '../../views/member/create.html';
});
