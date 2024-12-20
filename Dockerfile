FROM node:21-alpine
WORKDIR /usr/src/app

# package.json과 package-lock.json을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# /resources/js와 /resources/views 디렉토리의 모든 파일을 복사
COPY resources/css ./resources/css
COPY resources/js ./resources/js
COPY resources/views ./resources/views

# 포트 노출
EXPOSE 8080

# app.js 파일을 실행
CMD ["node", "resources/js/app.js"]
