document.getElementById('create_post').addEventListener('click', function () {
  window.location.href = '../../views/posting/createpost.html'; // board.html로 이동
});

document.getElementById('post_detail').addEventListener('click', function () {
  window.location.href = '../../views/posting/board.html'; // board.html로 이동
});

// 초기 값 설정
const initialLikes = 1500;
const initialComments = 2500;
const initialViews = 120000;
const postTitle =
  '이것은 제목이 너무 긴 경우를 테스트하기 위한 예제 제목입니다.'; // 긴 제목 예제

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
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// DOM 요소 선택
const likesElement = document.getElementById('likes');
const commentsElement = document.getElementById('comments');
const viewsElement = document.getElementById('views');
const postDateElement = document.getElementById('postDate');
const postTitleElement = document.getElementById('postTitle');

// 값 설정 및 형식 변환
likesElement.textContent = '좋아요 ' + formatNumber(initialLikes);
commentsElement.textContent = '댓글 ' + formatNumber(initialComments);
viewsElement.textContent = '조회수 ' + formatNumber(initialViews);

/*
// 현재 날짜와 시간을 설정
const currentDate = new Date();
postDateElement.textContent = formatDate(currentDate);
*/

// 제목 설정 및 26자 제한 처리
if (postTitle.length > 26) {
  postTitleElement.textContent = postTitle.slice(0, 26) + '...'; // 26자 이상일 경우 '...' 추가
} else {
  postTitleElement.textContent = postTitle; // 26자 이하일 경우 그대로 표시
}
