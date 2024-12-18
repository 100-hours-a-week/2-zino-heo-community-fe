document.addEventListener('DOMContentLoaded', function () {
  const titleInput = document.getElementById('title'); // 제목 입력란
  const contentInput = document.getElementById('content'); // 본문 입력란
  const imageInput = document.getElementById('image'); // 이미지 파일 입력
  const uploadButton = document.querySelector('.upload-button'); // 파일 선택 버튼
  const submitButton = document.querySelector('.submit-button'); // 완료 버튼
  const helperText = document.getElementById('helper-text'); // 헬퍼 텍스트

  // 헬퍼 텍스트 초기화
  helperText.style.display = 'none';

  // 이미지 업로드 버튼 클릭 시 파일 입력 트리거
  uploadButton.addEventListener('click', function () {
    imageInput.click();
  });

  // 파일 선택 시 미리보기
  imageInput.addEventListener('change', function () {
    const file = imageInput.files[0]; // 선택한 파일
    if (file) {
      const reader = new FileReader(); // FileReader 객체 생성
      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽음
      uploadButton.nextElementSibling.textContent = file.name; // 선택한 파일 이름 표시
    }
  });

  // 제목 입력 시 처리
  titleInput.addEventListener('input', function () {
    if (titleInput.value.length > 26) {
      titleInput.value = titleInput.value.substring(0, 26); // 26자를 초과하면 잘라냄
    }
    checkInput(); // 입력 유효성 체크 호출
  });

  // 본문 입력 시 처리
  contentInput.addEventListener('input', function () {
    checkInput(); // 입력 유효성 체크 호출
  });

  // 입력 유효성 체크 함수
  function checkInput() {
    if (!titleInput.value || !contentInput.value) {
      helperText.style.display = 'block'; // 헬퍼 텍스트 표시
      submitButton.style.backgroundColor = '#ACA0EB'; // 비활성화 색상
    } else {
      helperText.style.display = 'none'; // 헬퍼 텍스트 숨김
      submitButton.style.backgroundColor = '#7F6AEE'; // 활성화 색상
    }
  }

  // 완료 버튼 클릭 시 처리
  submitButton.addEventListener('click', function () {
    if (titleInput.value && contentInput.value) {
      const formData = new FormData(); // FormData 객체 생성
      formData.append('title', titleInput.value); // 제목 추가
      formData.append('content', contentInput.value); // 내용 추가
      if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]); // 이미지 파일 추가
      }

      // 로컬 스토리지에서 작성자 정보 가져오기
      const userInfo = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
      if (userInfo) {
        formData.append('authorEmail', userInfo.email);
        formData.append('authorNickname', userInfo.nickname); // 작성자 닉네임
        formData.append('authorProfileImage', userInfo.profileImage); // 작성자 프로필 사진 URL
      } else {
        alert('사용자 정보가 없습니다.'); // 사용자 정보가 없는 경우 경고
        return;
      }

      // POST 요청 보내기
      fetch('http://localhost:3000/api/board/create', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('게시물 작성 중 오류가 발생했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message); // 성공 메시지
          window.location.href = '../main/index.html'; // 부모 디렉토리에서 main/index.html로 이동
        })
        .catch((error) => {
          alert(error.message); // 오류 메시지 표시
        });
    } else {
      checkInput(); // 입력 유효성 체크 호출
    }
  });

  // 초기 버튼 색상 설정
  checkInput(); // 페이지 로드 시 버튼 색상 초기화
});
