document.getElementById('create_post').addEventListener('click', function () {
  window.location.href = '../../views/posting/createpost.html';
});

// 초기 값 설정
const postContainer = document.getElementById('postContainer'); // 게시물 리스트를 담을 컨테이너

// 게시물 목록 가져오기
function loadPosts() {
  fetch(`${window.API_BASE_URL}/api/board`) // 게시물 목록 API 호출
    .then((response) => {
      if (!response.ok) {
        throw new Error('게시물 목록을 가져오는 중 오류가 발생했습니다.');
      }
      return response.json();
    })
    .then((posts) => {
      console.log(posts); // 데이터 확인
      displayPosts(posts); // 게시물 표시
    })
    .catch((error) => {
      console.error(error.message);
      alert('게시물 목록을 불러오는 데 실패했습니다.');
    });
}

// 게시물 표시 함수
function displayPosts(posts) {
  postContainer.innerHTML = ''; // 기존 게시물 목록 초기화

  posts.forEach((post) => {
    const profileImageUrl = post.author.profileImage.startsWith('http')
      ? post.author.profileImage
      : `${window.API_BASE_URL}/${post.author.profileImage}`; // URL 수정

    const postElement = document.createElement('div');
    postElement.classList.add('posting');
    postElement.innerHTML = `
      <div class="post" id="post_${post.id}" data-post-id="${post.id}">
        <h2 class="post-title">${post.title}</h2>
        <div class="post-info">
          <div class="post-info-left">
            <span>좋아요 ${formatNumber(post.likes)}</span>
            <span>조회수 ${formatNumber(post.views)}</span>
            <span>댓글 ${formatNumber(post.comments)}</span>
          </div>
          <div class="post-info-right">
            <span>${formatDate(post.createdAt)}</span> <!-- 날짜 포맷 -->
          </div>
        </div>
        <div class="separator"></div>
        <div class="post-author">
          <div class="author-pic" style="background-image: url('${profileImageUrl}'); width: 40px; height: 40px; background-size: cover; border-radius: 50%;"></div>
          <span>${post.author.nickname}</span>
        </div>
      </div>
    `;

    // 클릭 이벤트 추가
    postElement.querySelector('.post').addEventListener('click', function () {
      window.location.href = `../../views/posting/board.html?postId=${post.id}`; // 상세 페이지로 이동
    });

    postContainer.appendChild(postElement); // 게시물 추가
  });
}

// 숫자를 K 형식으로 변환하는 함수
function formatNumber(num) {
  if (num >= 100000) {
    return Math.floor(num / 1000) + 'K'; // 100K 이상
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + 'K'; // 10K 이상
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + 'K'; // 1K 이상
  }
  return num; // 1000 미만
}

// 날짜를 yyyy-mm-dd hh:mm:ss 형식으로 변환하는 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded 이벤트 발생'); // 로그 추가

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '../../views/member/login.html'; // 로그인 페이지로 이동
  } else {
    document.getElementById(
      'welcomeMessage'
    ).textContent = `환영합니다, ${user.nickname}님!`;
    loadPosts(); // 게시물 목록 가져오기
  }
});
