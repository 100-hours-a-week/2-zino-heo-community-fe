document.addEventListener('DOMContentLoaded', function () {
  const nicknameInput = document.getElementById('nickname');
  const helperText = document.createElement('small');
  const formGroup = nicknameInput.parentNode;
  const submitButton = document.querySelector('.submit-button');
  const imageUpload = document.getElementById('imageUpload');
  const imagePlaceholder = document.getElementById('imagePlaceholder');

  // 프로필 이미지를 위한 img 요소 생성
  const profileImageElement = document.createElement('img');
  profileImageElement.style.width = '150px';
  profileImageElement.style.height = '150px';
  profileImageElement.style.objectFit = 'cover';
  profileImageElement.style.borderRadius = '50%';
  profileImageElement.style.display = 'none'; // 처음에는 숨김

  // 헬퍼 텍스트 추가
  helperText.classList.add('helper-text');
  formGroup.appendChild(helperText);

  // 페이지 로드 시 사용자 정보 설정
  const user = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기

  if (user) {
    const { email, nickname, profileImage } = user; // 구조 분해 할당

    // 이메일 설정
    document.getElementById('email').textContent = email;

    // 닉네임 설정
    nicknameInput.value = nickname;

    // 프로필 이미지 설정
    if (profileImage) {
      profileImageElement.src = `http://localhost:3000/${profileImage}`; // 기존 프로필 이미지 URL 설정
      profileImageElement.style.display = 'block'; // 이미지 표시
      imagePlaceholder.appendChild(profileImageElement); // 이미지 플레이스홀더에 추가
    } else {
      console.error('프로필 이미지 URL이 없습니다.');
    }
  } else {
    console.error('사용자 정보가 로컬 스토리지에 없습니다.');
  }

  // 닉네임 유효성 검사
  function validateNickname() {
    const nicknameValue = nicknameInput.value.trim();
    if (nicknameValue === '') {
      return '* 닉네임을 입력해주세요.';
    } else if (nicknameValue.length > 10) {
      return '* 닉네임은 최대 10자까지 작성 가능합니다.';
    }
    return ''; // 유효한 닉네임일 경우 헬퍼 텍스트 지우기
  }

  // 닉네임 중복 검사
  function checkNicknameAvailability(nickname) {
    return fetch(
      `http://localhost:3000/api/users/check-nickname?nickname=${nickname}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('서버 응답에 문제가 있습니다.');
        }
        return response.json();
      })
      .then((data) => data.available);
  }

  submitButton.addEventListener('click', function () {
    const validationMessage = validateNickname(); // 유효성 검사

    if (validationMessage) {
      helperText.textContent = validationMessage; // 헬퍼 텍스트 업데이트
      return;
    }

    const nicknameValue = nicknameInput.value.trim();
    checkNicknameAvailability(nicknameValue)
      .then((isAvailable) => {
        if (!isAvailable) {
          helperText.textContent = '* 중복된 닉네임입니다.';
        } else {
          helperText.textContent = ''; // 헬퍼 텍스트 지우기
          updateUserInfo(user.email); // 사용자 정보 업데이트 호출
        }
      })
      .catch((error) => {
        helperText.textContent = '오류가 발생했습니다: ' + error.message;
      });
  });

  function updateUserInfo(email) {
    const nickname = nicknameInput.value.trim();
    const formData = new FormData();
    formData.append('email', email); // 이메일 추가
    formData.append('nickname', nickname); // 닉네임 추가

    // 프로필 이미지 데이터 추가 (Multer 방식)
    if (imageUpload.files.length > 0) {
      const file = imageUpload.files[0]; // 선택된 파일
      formData.append('profileImage', file); // 파일 객체를 FormData에 추가
    }

    // API 요청
    fetch('http://localhost:3000/api/users/update', {
      method: 'PUT',
      body: formData, // FormData 객체 전송
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        return response.json();
      })
      .then((data) => {
        // 로컬 스토리지 업데이트
        const updatedUser = {
          email: data.user.email,
          nickname: data.user.nickname,
          profileImage: data.user.profileImage, // 업데이트된 프로필 이미지
        };
        localStorage.setItem('user', JSON.stringify(updatedUser)); // 로컬 스토리지에 저장

        // 프로필 이미지 업데이트
        profileImageElement.src = `http://localhost:3000/${updatedUser.profileImage}`; // 새로운 프로필 이미지로 업데이트
        profileImageElement.style.display = 'block'; // 이미지 표시
        showToastMessage('회원 정보가 수정되었습니다.');
        console.log(data);

        // index.html로 리다이렉트
        window.location.href = '../../views/main/index.html';
      })
      .catch((error) => {
        alert('수정 중 오류가 발생했습니다: ' + error.message);
      });
  }

  function showToastMessage(message) {
    const completeButton = document.querySelector('.complete-button');
    completeButton.textContent = message;
    completeButton.style.display = 'block';
    completeButton.style.opacity = 1;

    setTimeout(() => {
      completeButton.style.opacity = 0;
      setTimeout(() => {
        completeButton.style.display = 'none';
      }, 500);
    }, 2000);
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
        profileImageElement.src = e.target.result; // 선택된 이미지 미리 보기
        profileImageElement.style.display = 'block'; // 이미지 표시
        imagePlaceholder.innerHTML = ''; // 기존 내용 제거
        imagePlaceholder.appendChild(profileImageElement); // 새 이미지 추가
      };
      reader.readAsDataURL(file); // 파일을 읽어 Data URL로 변환
    }
  });

  // 게시글 삭제 버튼 클릭 시 처리
  const deletePostButton = document.querySelector('.withdraw-button');
  deletePostButton.addEventListener('click', function () {
    const postDeleteModal = document.createElement('div');

    fetch('modal1.html')
      .then((response) => response.text())
      .then((data) => {
        postDeleteModal.innerHTML = data;
        postDeleteModal.classList.add('modal');
        document.body.appendChild(postDeleteModal);
        document.body.classList.add('modal-open');
        postDeleteModal.style.display = 'flex';

        // 삭제 확인 버튼 클릭 시
        const confirmDeleteButton =
          postDeleteModal.querySelector('#confirmDelete');
        confirmDeleteButton.addEventListener('click', function () {
          const email = user.email; // 로컬 스토리지에서 가져온 이메일

          // DELETE 요청 보내기
          fetch(`http://localhost:3000/api/users/delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }), // 필요에 따라 다른 데이터 전송
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('회원 탈퇴 중 오류가 발생했습니다.');
              }
              return response.json();
            })
            .then((data) => {
              alert('회원 탈퇴가 완료되었습니다!'); // 임시 알림
              postDeleteModal.style.display = 'none';
              document.body.classList.remove('modal-open');
              document.body.removeChild(postDeleteModal);

              // 로그아웃 후 로그인 페이지로 이동
              localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
              window.location.href = '../../views/member/login.html'; // 게시글 삭제 후 이동
            })
            .catch((error) => {
              alert(error.message); // 오류 메시지 표시
            });
        });

        // 취소 버튼 클릭 시
        const cancelDeleteButton =
          postDeleteModal.querySelector('#cancelDelete');
        cancelDeleteButton.addEventListener('click', function () {
          postDeleteModal.style.display = 'none';
          document.body.classList.remove('modal-open');
          document.body.removeChild(postDeleteModal);
        });
      });
  });
});
