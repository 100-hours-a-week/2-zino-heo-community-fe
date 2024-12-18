document.addEventListener('DOMContentLoaded', function () {
  const imagePlaceholder = document.getElementById('imagePlaceholder');
  const imageUpload = document.getElementById('imageUpload');
  const profileHelperText = document.querySelector('.image-labels small');

  // 프로필 사진 헬퍼 텍스트 기본 설정
  const defaultProfileHelperText = '* 프로필 사진을 추가해주세요.';
  profileHelperText.textContent = defaultProfileHelperText;

  // 이메일 헬퍼 텍스트 요소
  const emailInput = document.getElementById('email');
  const emailHelperText = emailInput.nextElementSibling; // small 요소 선택
  const defaultEmailHelperText = '* 이메일을 입력해주세요.';
  emailHelperText.textContent = defaultEmailHelperText;

  // 비밀번호 헬퍼 텍스트 요소
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordHelperText = passwordInput.nextElementSibling; // 비밀번호 헬퍼 텍스트
  const confirmPasswordHelperText = confirmPasswordInput.nextElementSibling; // 비밀번호 확인 헬퍼 텍스트
  const defaultPasswordHelperText = '* 비밀번호를 입력해주세요.';
  const defaultConfirmPasswordHelperText = '* 비밀번호를 한번 더 입력해주세요.';
  passwordHelperText.textContent = defaultPasswordHelperText;
  confirmPasswordHelperText.textContent = defaultConfirmPasswordHelperText;

  // 닉네임 헬퍼 텍스트 요소
  const nicknameInput = document.getElementById('nickname');
  const nicknameHelperText = nicknameInput.nextElementSibling; // small 요소 선택
  const defaultNicknameHelperText = '* 닉네임을 입력해주세요.';
  nicknameHelperText.textContent = defaultNicknameHelperText;

  // 회원가입 버튼
  const signupButton = document.getElementById('signup-button');
  const loginLink = document.getElementById('login-link');
  signupButton.disabled = true;

  const redirectToLogin = function (event) {
    event.preventDefault(); // 기본 동작 방지
    window.location.href = 'login.html'; // 로그인 페이지로 이동
  };

  signupButton.addEventListener('click', async (event) => {
    event.preventDefault(); // 기본 폼 제출 방지

    // 입력 값 가져오기
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const nickname = nicknameInput.value.trim();
    const imageFile = imageUpload.files[0];

    // // 프로필 이미지 처리
    // let profileImage = '';
    // if (imageFile) {
    //   const reader = new FileReader();
    //   reader.onloadend = function () {
    //     profileImage = reader.result; // base64 인코딩된 이미지
    //     sendData(); // 이미지 로드 후 데이터 전송
    //   };
    //   reader.readAsDataURL(imageFile);
    // } else {
    //   sendData(); // 이미지가 없을 때 바로 데이터 전송
    // }
    //async function sendData() {

    // POST 요청 보내는 함수
    // 비밀번호 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email); // 사용자가 입력한 이메일
    formData.append('password', password); // 사용자가 입력한 비밀번호
    formData.append('passwordConfirm', confirmPassword); // 사용자가 입력한 비밀번호 확인
    formData.append('nickname', nickname); // 사용자가 입력한 닉네임
    if (imageFile) {
      formData.append('profileImage', imageFile); // Multer 방식으로 이미지 파일을 추가
    }
    // Fetch API를 사용하여 POST 요청 보내기
    fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      body: formData, // FormData 객체 전송
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // 성공 메시지
          redirectToLogin(event); // 로그인 페이지로 리다이렉트
        } else {
          alert(data.error); // 에러 메시지
        }
      })
      .catch((error) => {
        alert('회원가입 중 오류가 발생했습니다: ' + error.message);
      });
  });

  // 닉네임 유효성 검사 함수
  function validateNickname() {
    const nicknameValue = nicknameInput.value.trim();

    if (!nicknameValue) {
      nicknameHelperText.textContent = defaultNicknameHelperText; // 닉네임이 비어 있을 경우
    } else if (nicknameValue.includes(' ')) {
      nicknameHelperText.textContent = '* 띄어쓰기를 제거해주세요.'; // 띄어쓰기가 있을 경우
    } else if (nicknameValue.length > 10) {
      nicknameHelperText.textContent =
        '* 닉네임은 최대 10자까지 작성 가능합니다.'; // 11자 이상일 경우
    } else if (isNicknameDuplicate(nicknameValue)) {
      nicknameHelperText.textContent = '* 중복된 닉네임 입니다.'; // 중복 닉네임
    } else {
      nicknameHelperText.textContent = ''; // 모든 조건이 만족되면 헬퍼 텍스트 비우기
    }
    updateSignupButton();
  }

  // 닉네임 중복 검사 (예시: 이미 존재하는 닉네임 배열)
  function isNicknameDuplicate(nickname) {
    const existingNicknames = ['nickname1', 'nickname2']; // 예시 닉네임 목록
    return existingNicknames.includes(nickname);
  }

  // 비밀번호 유효성 검사 함수
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
    updateSignupButton();
  }

  // 비밀번호 형식 검사
  function isValidPassword(password) {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/; // 정규 표현식
    return passwordPattern.test(password);
  }

  // 이메일 유효성 검사 함수
  function validateEmail() {
    const emailValue = emailInput.value.trim();

    if (!emailValue) {
      emailHelperText.textContent = defaultEmailHelperText; // 비어 있을 경우
    } else if (!isValidEmail(emailValue)) {
      emailHelperText.textContent =
        '* 올바른 이메일 주소 형식을 작성해주세요. (예: example@example.com)'; // 형식 오류
    } else if (isEmailDuplicate(emailValue)) {
      emailHelperText.textContent = '* 중복된 이메일 입니다.'; // 중복 이메일
    } else {
      emailHelperText.textContent = ''; // 유효한 경우 헬퍼 텍스트 비우기
    }
    updateSignupButton();
  }

  // 이메일 형식 검사 정규 표현식
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 형식 정규 표현식
    return emailPattern.test(email);
  }

  // 이메일 중복 검사 (예시: 이미 존재하는 이메일 배열)
  function isEmailDuplicate(email) {
    const existingEmails = ['test@example.com', 'user@example.com']; // 예시 이메일 목록
    return existingEmails.includes(email);
  }

  // 모든 입력 필드의 유효성을 검사하고 버튼 색상 및 상태 변경
  function updateSignupButton() {
    const isValid =
      emailHelperText.textContent === '' &&
      passwordHelperText.textContent === '' &&
      confirmPasswordHelperText.textContent === '' &&
      nicknameHelperText.textContent === '';

    signupButton.disabled = !isValid; // 유효하지 않으면 버튼 비활성화
    signupButton.style.backgroundColor = isValid ? '#7F6AEE' : '#ACA0EB'; // 유효할 경우 버튼 색상 변경
  }

  // 이미지 업로드 클릭 이벤트
  imagePlaceholder.addEventListener('click', function () {
    imageUpload.click(); // 파일 업로드 창 열기
  });

  // 파일 선택 후 미리 보기
  imageUpload.addEventListener('change', function () {
    const file = this.files[0]; // 선택된 파일

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.width = '100%'; // 자동 너비
        img.style.height = '100%'; // 높이를 100%로 설정
        img.style.position = 'absolute'; // 절대 위치 설정
        img.style.top = '50%'; // 중앙 정렬을 위한 위치 설정
        img.style.left = '50%'; // 중앙 정렬을 위한 위치 설정
        img.style.transform = 'translate(-50%, -50%)'; // 중앙 정렬
        img.style.objectFit = 'cover'; // 비율 유지하며 중앙 맞춤

        // 기존 이미지를 제거하고 새 이미지를 추가
        imagePlaceholder.innerHTML = ''; // 기존 내용 제거
        imagePlaceholder.appendChild(img); // 새 이미지 추가

        // 헬퍼 텍스트 변경
        profileHelperText.textContent = ''; // 헬퍼 텍스트 비우기
      };
      reader.readAsDataURL(file); // 파일을 읽어 Data URL로 변환
    }
  });

  // 이메일 입력 시 유효성 검사
  emailInput.addEventListener('input', validateEmail);

  // 닉네임 입력 시 유효성 검사
  nicknameInput.addEventListener('input', validateNickname);

  // 비밀번호 입력 시 유효성 검사
  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validatePassword);

  // 이미지가 있는 상태에서 클릭하면 이미지 삭제
  imagePlaceholder.addEventListener('click', function () {
    if (imageUpload.files.length > 0) {
      imageUpload.value = ''; // 파일 입력 초기화
      imagePlaceholder.innerHTML = '<span class="add-icon">+</span>'; // '+' 아이콘 복원
      profileHelperText.textContent = defaultProfileHelperText; // 헬퍼 텍스트 복원
    }
  });
});
