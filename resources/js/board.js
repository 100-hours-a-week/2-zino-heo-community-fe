document.addEventListener('DOMContentLoaded', async function () {
  let postId; // 전역 변수로 선언
  const commentInput = document.querySelector('.comment-input');
  const submitCommentButton = document.querySelector('.submit-comment');
  const commentList = document.querySelector('.comment-list');

  let editingComment = null; // 수정할 댓글 저장
  let currentCommentId = null; // 현재 수정 중인 댓글의 ID 저장
  let commentToDelete; // 삭제할 댓글 저장
  let currentUser; // 현재 사용자 정보를 저장할 전역 변수

  // 게시글 삭제 모달
  const postDeleteModal = document.getElementById('postDeleteModal');
  const confirmPostDeleteButton = document.getElementById('confirmDelete');
  const cancelPostDeleteButton = document.getElementById('cancelDelete');

  // 댓글 삭제 모달
  const commentDeleteModal = document.getElementById('commentDeleteModal');
  const confirmCommentDeleteButton = document.getElementById(
    'confirmCommentDelete'
  );
  const cancelCommentDeleteButton = document.getElementById(
    'cancelCommentDelete'
  );

  async function loadPost() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      postId = urlParams.get('postId'); // postId 가져오기

      const response = await fetch(
        `${window.API_BASE_URL}/api/board/${postId}`
      ); // 백엔드 API 호출
      if (!response.ok) {
        throw new Error('게시물을 찾을 수 없습니다.');
      }

      const post = await response.json(); // JSON 데이터 파싱

      // 게시물 정보 화면에 표시
      document.querySelector('.post-title').textContent = post.title;
      document.querySelector('.post-content').textContent = post.content;

      const postImageElement = document.querySelector('.post-image img');
      if (post.image) {
        postImageElement.src = `${window.API_BASE_URL}/${post.image}`; // 게시물 이미지 경로
        postImageElement.style.display = 'block'; // 이미지를 보이게 설정
      } else {
        postImageElement.style.display = 'none'; // 이미지를 숨김
      }

      const authorPic = document.querySelector('.author-pic');
      const defaultProfileImage =
        'https://dimg.donga.com/wps/ECONOMY/IMAGE/2018/10/18/92452237.2.jpg'; // 기본 이미지 URL

      // 프로필 이미지 설정
      if (post.author_profileImage) {
        authorPic.style.backgroundImage = `url(${window.API_BASE_URL}/${post.author_profileImage})`; // 프로필 이미지 경로
      } else {
        authorPic.style.backgroundImage = `url(${defaultProfileImage})`; // 기본 이미지로 설정
      }

      document.querySelector('.author').textContent = post.author_nickname; // 작성자 닉네임 설정
      document.querySelector('.date').textContent = formatDate(
        new Date(post.createdAt)
      ); // 작성일 설정

      // 좋아요, 조회수, 댓글 수 업데이트
      document.querySelector(
        '.stat-button:nth-child(1) b'
      ).innerHTML = `${post.likeCount}<br />좋아요`;
      document.querySelector(
        '.stat-button:nth-child(2) b'
      ).innerHTML = `${post.views}<br />조회수`;
      document.querySelector(
        '.stat-button:nth-child(3) b'
      ).innerHTML = `${post.commentsCount}<br />댓글`;

      // 현재 사용자의 정보를 가져오기
      currentUser = await fetchUserInfo(); // 사용자 정보를 전역 변수에 저장

      const editButton = document.querySelector('.edit-button');
      const deleteButton = document.querySelector('.delete-button');

      // 작성자와 현재 사용자가 같은지 확인
      if (post.author_email === currentUser.email) {
        // 작성자일 경우 버튼을 보이도록 설정
        editButton.style.display = 'inline-block';
        deleteButton.style.display = 'inline-block';
      } else {
        // 작성자가 아닐 경우 버튼을 숨김
        editButton.style.display = 'none';
        deleteButton.style.display = 'none';
      }
      console.log(post.comments); // 댓글 배열 확인

      // 댓글 목록 표시
      for (const comment of post.comments) {
        await displayComment(comment); // 비동기로 댓글 표시
      }

      // 좋아요 버튼 클릭 시 이벤트 리스너 등록
      const likeButton = document.querySelector('.stat-button:nth-child(1)');
      likeButton.addEventListener('click', async () => {
        try {
          const response = await fetch(
            `${window.API_BASE_URL}/api/board/${postId}/like`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: currentUser.email }),
              credentials: 'include', // 쿠키를 포함하여 요청
            }
          );

          if (response.ok) {
            const data = await response.json();
            document.querySelector(
              '.stat-button:nth-child(1) b'
            ).innerHTML = `${data.likes}<br />좋아요`;
          } else {
            alert('좋아요를 증가시키는 데 문제가 발생했습니다.');
          }
        } catch (error) {
          console.error('좋아요 요청 중 오류 발생:', error);
        }
      });
    } catch (error) {
      console.error('게시물 로드 중 오류 발생:', error);
    }
  }

  // 댓글을 화면에 추가하는 함수
  async function displayComment(comment) {
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');
    commentItem.dataset.commentId = comment.id; // 댓글 ID 저장
    const defaultImageUrl =
      'https://dimg.donga.com/wps/ECONOMY/IMAGE/2018/10/18/92452237.2.jpg';
    const profileImageUrl = comment.author_profile_image
      ? `${window.API_BASE_URL}/${comment.author_profile_image}`
      : defaultImageUrl;
    console.log('Profile Image URL:', profileImageUrl);

    commentItem.innerHTML = `
      <div class="comment-header">
        <div class="author-info">
          <div class="author-pic" style="background-image: url(${profileImageUrl});"></div>
          <span class="comment-author">${comment.author_nickname}</span>
          <span class="comment-date">${formatDate(
            new Date(comment.createdAt)
          )}</span>
          <div class="comment-buttons">
          <button class="edit-comment" style="visibility: ${
            comment.author_email === currentUser.email ? 'visible' : 'hidden'
          };">수정</button>
          <button class="delete-comment" style="visibility: ${
            comment.author_email === currentUser.email ? 'visible' : 'hidden'
          };">삭제</button>
          </div>
        </div>
      </div>
      <p class="comment-content">${comment.content}</p>
    `;

    commentList.appendChild(commentItem); // 댓글 목록에 추가

    // 댓글 수정 버튼 클릭 이벤트 추가
    const editButton = commentItem.querySelector('.edit-comment');
    editButton.addEventListener('click', function () {
      commentInput.value = comment.content; // 현재 댓글 내용 입력창에 설정
      currentCommentId = comment.id; // 수정할 댓글 ID 저장
      editingComment = commentItem; // 수정할 댓글 저장
      submitCommentButton.textContent = '댓글 수정'; // 버튼 텍스트 변경
    });

    // 댓글 삭제 버튼 클릭 이벤트 추가
    const deleteButton = commentItem.querySelector('.delete-comment');
    deleteButton.addEventListener('click', function () {
      commentToDelete = comment; // 삭제할 댓글 저장
      commentDeleteModal.style.display = 'flex'; // 댓글 삭제 모달 표시
    });
  }

  // 댓글 등록 버튼 클릭 시 처리
  submitCommentButton.addEventListener('click', async function () {
    const commentText = commentInput.value.trim(); // 입력된 댓글 텍스트

    if (commentText) {
      if (editingComment) {
        // 수정 상태일 경우
        const commentContent = editingComment.querySelector('.comment-content');

        // API 호출하여 댓글 수정
        try {
          const response = await fetch(
            `${window.API_BASE_URL}/api/board/${postId}/comments/${currentCommentId}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: commentText }), // 수정된 댓글 내용
              credentials: 'include', // 쿠키를 포함하여 요청
            }
          );

          if (response.ok) {
            commentContent.textContent = commentText; // 댓글 내용 수정
            editingComment = null; // 수정 상태 초기화
            submitCommentButton.textContent = '댓글 등록'; // 버튼 텍스트 변경
            commentInput.value = ''; // 입력 필드 초기화
            window.location.reload(); // 수정된 댓글을 반영하기 위해 페이지 새로고침
          } else {
            const errorMessage = await response.text();
            alert(`댓글 수정에 문제가 발생했습니다: ${errorMessage}`);
          }
        } catch (error) {
          console.error('댓글 수정 요청 중 오류 발생:', error);
        }
      } else {
        // 새 댓글 추가
        const newComment = {
          id: Date.now(),
          content: commentText,
          author: {
            email: currentUser.email, // 현재 사용자 이메일
            nickname: currentUser.nickname, // 현재 사용자 닉네임
            profileImage: currentUser.profileImage, // 현재 사용자 프로필 이미지
          },
          createdAt: new Date().toISOString(),
        };

        // API 호출하여 댓글 추가
        try {
          const response = await fetch(
            `${window.API_BASE_URL}/api/board/${postId}/comments`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newComment),
              credentials: 'include', // 쿠키를 포함하여 요청
            }
          );

          if (response.ok) {
            location.reload(); // 페이지 새로고침
            const savedComment = await response.json(); // 서버에서 저장된 댓글 가져오기
            displayComment(savedComment); // 댓글 표시
            commentInput.value = ''; // 입력 필드 초기화
          } else {
            const errorMessage = await response.text();
            alert(`댓글 등록에 문제가 발생했습니다: ${errorMessage}`);
          }
        } catch (error) {
          console.error('댓글 추가 요청 중 오류 발생:', error);
        }
      }
    }
  });

  // 모든 수정 버튼 선택
  const editButtons = document.querySelectorAll('.edit-button');

  editButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const checkpostId = postId; // 버튼의 data-post-id 속성에서 postId 가져오기
      console.log('수정할 게시글 ID:', checkpostId); // ID 로그 출력
      window.location.href = `../../views/posting/updatepost.html?postId=${checkpostId}`; // postId를 URL에 포함시켜 이동
    });
  });

  // 게시글 삭제 버튼 클릭 시 처리
  const deletePostButton = document.querySelector('.delete-button');
  deletePostButton.addEventListener('click', function () {
    postDeleteModal.style.display = 'flex'; // 게시글 삭제 모달 표시
  });

  // 게시글 삭제 확인 버튼 클릭 시 처리
  confirmPostDeleteButton.addEventListener('click', async function () {
    try {
      const response = await fetch(
        `${window.API_BASE_URL}/api/board/${postId}/delete`,
        {
          method: 'DELETE',
          credentials: 'include', // 쿠키를 포함하여 요청
        }
      );

      if (response.ok) {
        alert('게시글이 삭제되었습니다!');
        window.location.href = '../../views/main/index.html'; // 게시글 삭제 후 이동
      } else {
        alert('게시글 삭제에 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 요청 중 오류 발생:', error);
    } finally {
      postDeleteModal.style.display = 'none'; // 모달 닫기
    }
  });

  // 게시글 삭제 취소 버튼 클릭 시 처리
  cancelPostDeleteButton.addEventListener('click', function () {
    postDeleteModal.style.display = 'none'; // 모달 닫기
  });

  // 댓글 삭제 확인 버튼 클릭 시 처리
  confirmCommentDeleteButton.addEventListener('click', async function () {
    if (commentToDelete) {
      // API 호출하여 댓글 삭제
      try {
        const response = await fetch(
          `${window.API_BASE_URL}/api/board/${postId}/comments/${commentToDelete.id}`,
          {
            method: 'DELETE',
            credentials: 'include', // 쿠키를 포함하여 요청
          }
        );

        if (response.ok) {
          const commentItem = document.querySelector(
            `[data-comment-id="${commentToDelete.id}"]`
          );
          if (commentItem) {
            commentItem.remove(); // 댓글 삭제
          }
          commentDeleteModal.style.display = 'none'; // 모달 닫기
        } else {
          alert('댓글 삭제에 문제가 발생했습니다.');
        }
      } catch (error) {
        console.error('댓글 삭제 요청 중 오류 발생:', error);
      }
    }
  });

  // 댓글 삭제 취소 버튼 클릭 시 처리
  cancelCommentDeleteButton.addEventListener('click', function () {
    commentDeleteModal.style.display = 'none'; // 모달 닫기
  });

  // 날짜 포맷팅 함수
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 게시물 로드 실행
  await loadPost(); // 게시물 로드 실행
});
