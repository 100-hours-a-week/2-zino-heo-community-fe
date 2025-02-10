// 드롭다운 메뉴 이벤트를 설정하는 함수
function setupDropdownMenu() {
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  dropdownItems.forEach((item) => {
    item.addEventListener('click', function () {
      const link = this.getAttribute('data-link'); // data-link 속성에서 URL 가져오기

      // 로그아웃 처리
      if (link === 'login.html') {
        // 로그아웃 API 호출
        fetch(`${window.API_BASE_URL}/api/users/logout`, {
          method: 'POST',
          credentials: 'include', // 쿠키를 포함하여 요청
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('로그아웃 중 오류가 발생했습니다.');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data.message); // 로그아웃 메시지 출력
            window.location.href = '../../views/member/login.html'; // 로그인 페이지로 이동
          })
          .catch((error) => {
            console.error('로그아웃 오류:', error.message);
          });
      } else if (link === 'create.html') {
        // 회원가입 페이지는 예외 처리
        window.location.href = '../../views/member/create.html'; // 회원가입 페이지로 이동
      } else {
        // 다른 메뉴 항목은 상대 경로로 이동
        window.location.href = link; // 해당 URL로 이동
      }
    });
  });
}

// 세션 쿠키 유효성 검사 함수
function checkSession() {
  return fetch(`${window.API_BASE_URL}/api/user/session`, {
    method: 'GET',
    credentials: 'include', // 쿠키를 포함하여 요청
  })
    .then((response) => {
      if (!response.ok) {
        // 세션이 유효하지 않으면 현재 URL을 확인
        const currentPath = window.location.pathname;
        const loginPath = '/views/member/login.html';
        const signupPath = '/views/member/create.html';

        // 현재 페이지가 로그인 페이지나 회원가입 페이지가 아닐 경우 리다이렉션
        if (currentPath !== loginPath && currentPath !== signupPath) {
          window.location.href = loginPath; // 로그인 페이지로 리다이렉션
        }
      }
    })
    .catch((error) => {
      console.error('세션 확인 중 오류 발생:', error);
      window.location.href = '../../views/member/login.html'; // 오류 발생 시 로그인 페이지로 리다이렉션
    });
}

// 프로필 이미지를 설정하는 함수
function setProfileImage(user) {
  const profilePicElement = document.querySelector('.profile-pic');
  const defaultImageUrl =
    'https://dimg.donga.com/wps/ECONOMY/IMAGE/2018/10/18/92452237.2.jpg';

  // 현재 페이지가 회원가입 페이지인지 확인
  const currentPath = window.location.pathname;
  const signupPath = 'http://localhost:8080/views/member/create.html'; // 회원가입 페이지 경로

  if (currentPath === signupPath) {
    // 회원가입 페이지에서는 프로필 이미지 요소 숨기기
    profilePicElement.style.visibility = 'hidden';
  } else {
    profilePicElement.style.visibility = 'visible';
    // 프로필 이미지 설정 함수
    function setImage(url) {
      console.log('Setting profile image URL:', url); // URL 로그 출력
      profilePicElement.style.backgroundImage = `url(${url})`;
      profilePicElement.style.backgroundSize = 'cover'; // 비율에 맞게 조정
      profilePicElement.style.width = '50px'; // 원하는 너비
      profilePicElement.style.height = '50px'; // 원하는 높이
      profilePicElement.style.borderRadius = '50%'; // 원형으로 만들기
    }

    // 프로필 이미지가 존재하지 않거나 사용자가 로그인하지 않은 경우 기본 이미지 설정
    const imageUrl =
      user && user.profileImage
        ? `${window.API_BASE_URL}/${user.profileImage}`
        : defaultImageUrl;

    setImage(imageUrl);
  }
}

// 사용자 정보를 가져오는 함수
function fetchUserInfo() {
  return fetch(`${window.API_BASE_URL}/api/user/session`, {
    method: 'GET',
    credentials: 'include', // 쿠키를 포함하여 요청
  }).then((response) => {
    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
    }
    return response.json(); // 사용자 정보 반환
  });
}

// DOMContentLoaded 이벤트에서 세션 확인 및 헤더를 불러오는 함수
document.addEventListener('DOMContentLoaded', function () {
  checkSession() // 세션 확인 호출
    .then(() => {
      return fetch('/views/main/header.html');
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById('header-container').innerHTML = data;

      // 로고 클릭 이벤트 추가
      const logoElement = document.getElementById('logo');
      logoElement.addEventListener('click', function () {
        window.location.href = '../../views/main/index.html'; // index.html로 이동
      });

      // 헤더가 로드된 후 드롭다운 메뉴 설정
      setupDropdownMenu();

      // 사용자 정보 가져오기
      return fetchUserInfo(); // 사용자 정보를 가져오는 Promise 반환
    })
    .then((user) => {
      // 프로필 이미지 설정
      setProfileImage(user);
    })
    .catch((error) => console.error('Error loading header:', error));
});
