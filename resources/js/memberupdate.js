document.addEventListener('DOMContentLoaded', function () {
  const nicknameInput = document.getElementById('nickname');
  const helperText = document.createElement('small');
  const formGroup = nicknameInput.parentNode;
  const submitButton = document.querySelector('.submit-button');
  const imageUpload = document.getElementById('imageUpload');
  const imagePlaceholder = document.getElementById('imagePlaceholder');
  const changeButton = document.getElementById('change-Button');

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

  let user;

  // 사용자 정보 가져오기
  fetchUserInfo()
    .then((fetchedUser) => {
      user = fetchedUser; // 사용자 정보를 저장
      if (user) {
        const { email, nickname, profileImage } = user; // 구조 분해 할당

        // 이메일 설정
        document.getElementById('email').textContent = email;

        // 닉네임 설정
        nicknameInput.value = nickname;

        // 프로필 이미지 설정
        if (profileImage) {
          profileImageElement.src = `${window.API_BASE_URL}/${profileImage}`; // 기존 프로필 이미지 URL 설정
          profileImageElement.style.display = 'block'; // 이미지 표시
          imagePlaceholder.appendChild(profileImageElement); // 이미지 플레이스홀더에 추가
        } else {
          console.error('프로필 이미지 URL이 없습니다.');
        }
      } else {
        console.error('사용자 정보가 없습니다.');
      }
    })
    .catch((error) => {
      console.error('사용자 정보 로드 중 오류:', error);
    });

  // 닉네임 유효성 검사
  function validateNickname() {
    const nicknameValue = nicknameInput.value.trim();
    if (nicknameValue === '') {
      return '* 닉네임을 입력해주세요.';
    } else if (nicknameValue.length > 10) {
      return '* 닉네임은 최대 10자까지 작성 가능합니다.';
    }
    return '';
  }

  // 닉네임 중복 검사
  function checkNicknameAvailability(nickname) {
    return fetch(
      `${window.API_BASE_URL}/api/users/check-nickname?nickname=${nickname}`
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
    fetchUserInfo().then((user) => {
      const currentNickname = user ? user.nickname : '';

      // 현재 닉네임과 입력한 닉네임이 동일한 경우
      if (nicknameValue === currentNickname) {
        // 닉네임을 변경하지 않으므로 사용자 정보 업데이트 호출
        updateUserInfo(user.email);
        return;
      }

      // 중복 검사 호출
      checkNicknameAvailability(nicknameValue)
        .then((isAvailable) => {
          if (!isAvailable) {
            helperText.textContent = '* 중복된 닉네임입니다.'; // 중복시 메시지 표시
          } else {
            helperText.textContent = ''; // 헬퍼 텍스트 지우기
            updateUserInfo(user.email, nicknameValue); // 사용자 정보 업데이트 호출
          }
        })
        .catch((error) => {
          helperText.textContent = '오류가 발생했습니다: ' + error.message; // 오류 처리
        });
    });
  });

  function updateUserInfo(email) {
    const nickname = nicknameInput.value.trim();
    const formData = new FormData();
    formData.append('email', email); // 이메일 추가
    formData.append('nickname', nickname);

    // 프로필 이미지 데이터 추가 (Multer 방식)
    if (imageUpload.files.length > 0) {
      const file = imageUpload.files[0]; // 선택된 파일
      formData.append('profileImage', file); // 파일 객체를 FormData에 추가
    }

    // API 요청
    fetch(`${window.API_BASE_URL}/api/users/update`, {
      method: 'PUT',
      body: formData, // FormData 객체 전송
      credentials: 'include', // 쿠키를 포함하여 요청
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        return response.json();
      })
      .then((data) => {
        // 사용자 정보 업데이트
        const updatedUser = {
          email: data.user.email,
          nickname: data.user.nickname,
          profileImage: data.user.profileImage, // 업데이트된 프로필 이미지
        };

        // 세션 정보를 업데이트하는 API 호출
        return fetch(`${window.API_BASE_URL}/api/user/session/update`, {
          method: 'PUT',
          credentials: 'include', // 쿠키를 포함하여 요청
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser), // 업데이트된 사용자 정보를 JSON 형식으로 전송
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('세션 정보를 업데이트하는 데 문제가 발생했습니다.');
        }

        // 프로필 이미지 업데이트
        profileImageElement.src = `${window.API_BASE_URL}/${profileImageElement.src}`; // 새로운 프로필 이미지로 업데이트
        profileImageElement.style.display = 'block'; // 이미지 표시
        showToastMessage('회원 정보가 수정되었습니다.');

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
        changeButton.style.display = 'block'; // 버튼을 표시
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
          const email = user.email; // 사용자 이메일

          // DELETE 요청 보내기
          fetch(`${window.API_BASE_URL}/api/users/delete`, {
            method: 'DELETE',
            credentials: 'include', // 쿠키를 포함하여 요청
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
              document.cookie = 'user=; path=/; max-age=0'; // 쿠키에서 사용자 정보 삭제
              window.location.href = '../../views/member/login.html'; // 로그인 페이지로 이동
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
