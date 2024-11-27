document.addEventListener('DOMContentLoaded', function () {
  // 수정 버튼 클릭 시 updatepost.html로 이동
  const editButton = document.querySelector('.edit-button');
  editButton.addEventListener('click', function () {
    window.location.href = '../../views/posting/updatepost.html';
  });

  // 댓글 입력 요소와 등록 버튼 선택
  const commentInput = document.querySelector('.comment-input');
  const submitCommentButton = document.querySelector('.submit-comment');

  let editingComment = null; // 수정할 댓글 저장
  let currentCommentText = ''; // 현재 댓글 텍스트 저장

  // 날짜 포맷팅 함수
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 댓글 입력 시 처리
  commentInput.addEventListener('input', function () {
    // 댓글이 입력되면 등록 버튼 활성화
    if (commentInput.value.trim() !== '') {
      submitCommentButton.disabled = false; // 버튼 활성화
      submitCommentButton.style.backgroundColor = '#7F6AEE'; // 색상 변경
    } else {
      submitCommentButton.disabled = true; // 버튼 비활성화
      submitCommentButton.style.backgroundColor = ''; // 기본 색상으로 복원
    }
  });

  // 댓글 등록 버튼 클릭 시 처리
  submitCommentButton.addEventListener('click', function () {
    const commentText = commentInput.value.trim(); // 입력된 댓글 텍스트

    if (commentText) {
      if (editingComment) {
        // 수정 상태일 경우
        const commentContent = editingComment.querySelector('.comment-content');
        commentContent.textContent = commentText; // 댓글 내용 수정
        currentCommentText = commentText; // 현재 댓글 텍스트 업데이트
        editingComment = null; // 수정 상태 초기화
        submitCommentButton.textContent = '댓글 등록'; // 버튼 텍스트 변경
      } else {
        // 새 댓글 추가
        const commentList = document.querySelector('.comment-list');
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        currentCommentText = commentText; // 현재 댓글 텍스트 저장

        const commentDate = formatDate(new Date()); // 현재 날짜를 포맷팅

        commentItem.innerHTML = `
                  <div class="comment-header">
                      <div class="author-info">
                          <div class="author-pic"></div>
                          <span class="comment-author">사용자 이름</span>
                          <span class="comment-date">${commentDate}</span> <!-- 포맷팅된 날짜 사용 -->
                          <div class="comment-buttons">
                              <button class="edit-comment">수정</button>
                              <button class="delete-comment">삭제</button>
                          </div>
                      </div>
                  </div>
                  <p class="comment-content">${commentText}</p>
              `;

        commentList.appendChild(commentItem); // 댓글 목록에 추가

        // 수정 버튼 클릭 이벤트 추가
        const editButton = commentItem.querySelector('.edit-comment');
        editButton.addEventListener('click', function () {
          commentInput.value = currentCommentText; // 현재 댓글 내용 입력창에 설정
          submitCommentButton.textContent = '댓글 수정'; // 버튼 텍스트 변경
          editingComment = commentItem; // 수정할 댓글 저장
        });

        // 삭제 버튼 클릭 이벤트 추가
        const deleteButton = commentItem.querySelector('.delete-comment');
        deleteButton.addEventListener('click', function () {
          // 댓글 삭제 모달 로드 및 열기
          const deleteModal = document.createElement('div');
          fetch('modal2.html') // modal2.html 파일을 가져옵니다.
            .then((response) => response.text())
            .then((data) => {
              deleteModal.innerHTML = data; // 가져온 내용을 모달 div에 추가
              deleteModal.classList.add('modal'); // 모달 클래스 추가
              document.body.appendChild(deleteModal); // body에 모달 추가
              document.body.classList.add('modal-open'); // 스크롤 비활성화
              deleteModal.style.display = 'flex'; // 모달 보여주기

              // 삭제 확인 버튼 클릭 시
              const confirmDeleteButton =
                deleteModal.querySelector('#confirmDelete');
              confirmDeleteButton.addEventListener('click', function () {
                commentItem.remove(); // 댓글 삭제
                deleteModal.style.display = 'none'; // 모달 닫기
                document.body.classList.remove('modal-open'); // 스크롤 활성화
                document.body.removeChild(deleteModal); // 모달 삭제
              });

              // 취소 버튼 클릭 시
              const cancelDeleteButton =
                deleteModal.querySelector('#cancelDelete');
              cancelDeleteButton.addEventListener('click', function () {
                deleteModal.style.display = 'none'; // 모달 닫기
                document.body.classList.remove('modal-open'); // 스크롤 활성화
                document.body.removeChild(deleteModal); // 모달 삭제
              });
            });
        });
      }

      // 댓글 입력 필드 초기화
      commentInput.value = '';
      submitCommentButton.disabled = true; // 버튼 비활성화
      submitCommentButton.style.backgroundColor = ''; // 기본 색상으로 복원
    }
  });

  // 게시글 삭제 버튼 클릭 시 처리
  const deletePostButton = document.querySelector('.delete-button');
  deletePostButton.addEventListener('click', function () {
    // 게시글 삭제 모달 로드 및 열기
    const postDeleteModal = document.createElement('div');
    fetch('modal.html') // modal.html 파일을 가져옵니다.
      .then((response) => response.text())
      .then((data) => {
        postDeleteModal.innerHTML = data; // 가져온 내용을 모달 div에 추가
        postDeleteModal.classList.add('modal'); // 모달 클래스 추가
        document.body.appendChild(postDeleteModal); // body에 모달 추가
        document.body.classList.add('modal-open'); // 스크롤 비활성화
        postDeleteModal.style.display = 'flex'; // 모달 보여주기

        // 삭제 확인 버튼 클릭 시
        const confirmDeleteButton =
          postDeleteModal.querySelector('#confirmDelete');
        confirmDeleteButton.addEventListener('click', function () {
          // 게시글 삭제 로직 추가
          alert('게시글이 삭제되었습니다!'); // 임시 알림
          postDeleteModal.style.display = 'none'; // 모달 닫기
          document.body.classList.remove('modal-open'); // 스크롤 활성화
          document.body.removeChild(postDeleteModal); // 모달 삭제
          // index.html로 이동 등의 추가 처리
          window.location.href = '../../views/main/index.html'; // 게시글 삭제 후 이동
        });

        // 취소 버튼 클릭 시
        const cancelDeleteButton =
          postDeleteModal.querySelector('#cancelDelete');
        cancelDeleteButton.addEventListener('click', function () {
          postDeleteModal.style.display = 'none'; // 모달 닫기
          document.body.classList.remove('modal-open'); // 스크롤 활성화
          document.body.removeChild(postDeleteModal); // 모달 삭제
        });
      });
  });
});
