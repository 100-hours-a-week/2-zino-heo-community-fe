// 드롭다운 메뉴 이벤트를 설정하는 함수
function setupDropdownMenu() {
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  dropdownItems.forEach((item) => {
    item.addEventListener('click', function () {
      const link = this.getAttribute('data-link'); // data-link 속성에서 URL 가져오기

      // 로그아웃 처리
      if (link === 'login.html') {
        localStorage.clear(); // 로컬 스토리지의 모든 값 삭제
        window.location.href = '../../views/member/login.html'; // 로그인 페이지로 이동
      } else {
        // 다른 메뉴 항목은 상대 경로로 이동
        window.location.href = link; // 해당 URL로 이동
      }
    });
  });
}

// 프로필 이미지를 설정하는 함수
function setProfileImage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const profilePicElement = document.querySelector('.profile-pic');

  // 프로필 이미지 설정 함수
  function setImage(url) {
    console.log('Setting profile image URL:', url); // URL 로그 출력
    profilePicElement.style.backgroundImage = `url(${url})`;
    profilePicElement.style.backgroundSize = 'cover'; // 비율에 맞게 조정
    profilePicElement.style.width = '50px'; // 원하는 너비
    profilePicElement.style.height = '50px'; // 원하는 높이
    profilePicElement.style.borderRadius = '50%'; // 원형으로 만들기
  }

  if (user && user.profileImage) {
    // 프로필 이미지가 존재하는 경우
    setImage(`${window.API_BASE_URL}/${user.profileImage}`);
  } else {
    // 프로필 이미지가 없을 경우 기본 이미지 설정
    const defaultImageUrl =
      'https://dimg.donga.com/wps/ECONOMY/IMAGE/2018/10/18/92452237.2.jpg';
    setImage(defaultImageUrl);
  }
}

// DOMContentLoaded 이벤트에서 헤더를 불러오고 드롭다운 및 프로필 이미지 설정
document.addEventListener('DOMContentLoaded', function () {
  fetch('/views/main/header.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById('header-container').innerHTML = data;

      // 헤더가 로드된 후 드롭다운 메뉴 설정
      setupDropdownMenu();

      // 프로필 이미지 설정
      setProfileImage();
    })
    .catch((error) => console.error('Error loading header:', error));
});
