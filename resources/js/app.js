const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '..'))); // resources 폴더 전체를 정적 파일로 제공

// HTML 파일 응답
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'main', 'index.html')); // index.html 경로
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
