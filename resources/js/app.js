const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 8080;

// CORS 설정
app.use(cors());

// JSON 요청 본문 파싱
app.use(express.json());

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '..'))); // resources 폴더 전체를 정적 파일로 제공

// HTML 파일 응답
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'member', 'login.html')); // login.html 경로
});

// 회원가입 엔드포인트 추가
app.post('/api/auth/register', (req, res) => {
  const { email, password, nickname, profileImage } = req.body;

  // 더미 데이터에 사용자 추가 로직
  // 예: 사용자 배열에 추가하거나 JSON 파일에 저장하는 로직

  res.status(201).json({ message: 'User registered successfully.' });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
