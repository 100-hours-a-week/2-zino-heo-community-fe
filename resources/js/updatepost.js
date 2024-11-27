document.addEventListener('DOMContentLoaded', function () {
  const titleInput = document.getElementById('title'); // 제목 입력란
  const contentInput = document.getElementById('content'); // 본문 입력란
  const imageInput = document.getElementById('image'); // 이미지 파일 입력
  const uploadButton = document.querySelector('.upload-button'); // 파일 선택 버튼
  const submitButton = document.querySelector('.submit-button'); // 완료 버튼
  const helperText = document.getElementById('helper-text'); // 헬퍼 텍스트

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
      alert('게시물이 저장되었습니다!'); // 임시 저장 알림
      window.location.href = 'board.html';
    } else {
      checkInput(); // 입력 유효성 체크 호출
    }
  });

  // 초기 버튼 색상 설정
  checkInput(); // 페이지 로드 시 버튼 색상 초기화
});
