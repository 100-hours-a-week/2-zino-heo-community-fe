import readlineSyncModule from 'readline-sync';
import fileSystem from 'fs';
import CryptoJS from 'crypto-js';

const secretkey = '1219';
let menu = '1. 작성 2. 조회 3. 수정 4. 삭제 5. 잠금/잠금 해제 6. 종료';
let memo = [];

while (true) {
  listView(menu);
  let userSelect = parseInt(getInput('메뉴 선택 : '));

  try {
    if (userSelect == 1) {
      // 작성하는 기능
      let titleName = getInput('제목을 입력하세요 : ');
      while (true) {
        if (titleName === '') {
          console.log('제목이 비어있습니다.');
          titleName = getInput('제목을 입력하세요 : ');
        } else if (memo.includes(titleName + '.json')) {
          console.log(
            '같은 이름의 제목이 이미 존재합니다. 다른 제목을 입력해주세요.'
          );
          titleName = getInput('제목을 입력하세요 : ');
        } else {
          break;
        }
      }
      let contentWrite = multiLine(
        "내용을 입력하세요 (종료하시려면 '!끝'이라고 입력해주세요) : "
      );
      let listAddTitle = writeJson(titleName, contentWrite, false);
      memo.push(listAddTitle);
    } else if (userSelect == 2) {
      // 조회하는 기능
      console.log('조회');
      listView(memo);
      let choose = parseInt(getInput('조회할 메모의 숫자를 선택하세요 : '));
      if (memo.length < choose) {
        console.log('조회할 메모가 없습니다.');
      } else {
        const file = fileSystem.readFileSync(memo[choose - 1], 'utf-8');
        let data = JSON.parse(file);

        if (data.isEncrypted) {
          // 암호키 입력 요청
          let inputKey = getInput(
            '이 메모는 암호화되어 있습니다. 암호키를 입력하세요: '
          );
          if (inputKey === secretkey) {
            data.content = decryptContent(data.content);
            data.isEncrypted = false; // 암호화 상태 변경
            console.log('제목 : ' + data.title);
            console.log('내용 : ' + data.content);

            // 암호화 여부 묻기
            if (
              getInput(
                '이 메모를 다시 암호화하시겠습니까? (y/n): '
              ).toLowerCase() === 'y'
            ) {
              data.content = encryptContent(data.content);
              data.isEncrypted = true; // 암호화 상태 변경
              const newFileName = data.title + '.json';
              fileSystem.writeFileSync(
                newFileName,
                JSON.stringify(data),
                'utf-8'
              );
            }
          } else {
            console.log('잘못된 암호키입니다. 접근할 수 없습니다.');
          }
        } else {
          console.log('제목 : ' + data.title);
          console.log('내용 : ' + data.content);
        }
      }
    } else if (userSelect == 3) {
      // 수정하는 기능
      console.log('수정');
      listView(memo);
      let choose = parseInt(getInput('수정할 메모의 숫자를 선택하세요 : '));
      if (memo.length < choose) {
        console.log('수정할 메모가 없습니다.');
      } else {
        const file = fileSystem.readFileSync(memo[choose - 1], 'utf-8');
        let data = JSON.parse(file);

        if (data.isEncrypted) {
          // 암호키 입력 요청
          let inputKey = getInput(
            '이 메모는 암호화되어 있습니다. 암호키를 입력하세요: '
          );
          if (inputKey === secretkey) {
            data.content = decryptContent(data.content);
            data.isEncrypted = false; // 암호화 상태 변경

            data.title = getInput('제목을 수정하세요 : ');
            data.content = multiLine(
              "내용을 수정하세요 (종료하시려면 '!끝'이라고 입력해주세요) : "
            );
            fileSystem.writeFileSync(
              memo[choose - 1],
              JSON.stringify(data, null, 2),
              'utf-8'
            );

            // 암호화 여부 묻기
            if (
              getInput(
                '이 메모를 다시 암호화하시겠습니까? (y/n): '
              ).toLowerCase() === 'y'
            ) {
              data.content = encryptContent(data.content);
              data.isEncrypted = true; // 암호화 상태 변경
              fileSystem.writeFileSync(
                memo[choose - 1],
                JSON.stringify(data),
                'utf-8'
              );
            }
          } else {
            console.log('잘못된 암호키입니다. 접근할 수 없습니다.');
          }
        } else {
          data.title = getInput('제목을 수정하세요 : ');
          data.content = multiLine(
            "내용을 수정하세요 (종료하시려면 '!끝'이라고 입력해주세요) : "
          );
          fileSystem.writeFileSync(
            memo[choose - 1],
            JSON.stringify(data),
            'utf-8'
          );
        }
      }
    } else if (userSelect == 4) {
      // 삭제하는 기능
      console.log('삭제');
      listView(memo);
      let choose = parseInt(getInput('삭제할 메모의 숫자를 선택하세요 : '));
      if (memo.length < choose) {
        console.log('삭제할 메모가 없습니다.');
      } else {
        const file = fileSystem.readFileSync(memo[choose - 1], 'utf-8');
        let data = JSON.parse(file);
        if (data.isEncrypted) {
          let inputKey = getInput(
            '이 메모는 암호화되어 있습니다. 암호키를 입력하세요: '
          );
          if (inputKey === secretkey) {
            fileSystem.unlinkSync(memo[choose - 1]);
            memo.splice(choose - 1, 1);
          } else {
            console.log('암호키가 올바르지 않습니다.');
          }
        } else {
          fileSystem.unlinkSync(memo[choose - 1]);
          memo.splice(choose - 1, 1);
        }
      }
    } else if (userSelect == 5) {
      // 잠금/잠금 해제 기능
      console.log('잠금/잠금 해제');
      listView(memo);
      let choose = parseInt(getInput('처리를 할 메모의 숫자를 선택하세요 : '));
      if (memo.length < choose) {
        console.log('처리를 할 메모가 없습니다.');
      } else {
        const file = fileSystem.readFileSync(memo[choose - 1], 'utf-8');
        let data = JSON.parse(file);

        if (data.isEncrypted) {
          // 복호화
          let inputKey = getInput('암호키를 입력하세요: ');
          if (inputKey === secretkey) {
            data.content = decryptContent(data.content); // 복호화 함수 사용
            data.isEncrypted = false; // 암호화 상태 변경
            const newTitle = data.title.replace('(잠금) ', ''); // 제목에서 "(잠금)" 제거
            const newFileName = newTitle + '.json'; // 제목으로 파일 이름 생성
            fileSystem.renameSync(memo[choose - 1], newFileName); // 파일 이름 변경
            memo[choose - 1] = newFileName; // memo 배열도 업데이트
            data.title = newTitle; // 제목도 업데이트
            // 파일 저장
            fileSystem.writeFileSync(
              newFileName,
              JSON.stringify(data),
              'utf-8'
            );
          } else {
            console.log('올바른 암호키가 아닙니다. 접근할 수 없습니다.');
          }
        } else {
          // 암호화
          const encpt = encryptContent(data.content); // 암호화 함수 사용
          data.content = encpt;
          data.isEncrypted = true; // 암호화 상태 변경
          const newTitle = '(잠금) ' + data.title; // 제목에 "(잠금)" 추가
          const newFileName = newTitle + '.json'; // 제목으로 파일 이름 생성
          fileSystem.renameSync(memo[choose - 1], newFileName); // 파일 이름 변경
          memo[choose - 1] = newFileName; // memo 배열도 업데이트
          data.title = newTitle; // 제목도 업데이트

          // 파일 저장
          fileSystem.writeFileSync(newFileName, JSON.stringify(data), 'utf-8');
        }
      }
    } else if (userSelect == 6) {
      // 종료
      console.log('종료');
      break;
    }
  } catch (error) {
    console.error('오류 발생:', error.message);
  }
}

function listView(show) {
  console.log(show);
}

function getInput(prompt) {
  return readlineSyncModule.question(prompt);
}

function multiLine(prompt) {
  let content = '';
  console.log(prompt);

  while (true) {
    let line = getInput('> ');
    if (line === '!끝') {
      break;
    }
    content += line + '\n';
  }
  return content.trim();
}

function writeJson(titleName, contentWrite, isEncrypted) {
  const fileName = titleName + '.json'; // 파일 이름 생성
  const data = {
    title: titleName,
    content: contentWrite,
    isEncrypted: isEncrypted, // 암호화 상태 추가
  };

  fileSystem.writeFileSync(fileName, JSON.stringify(data), 'utf-8');
  return fileName; // 파일 이름 반환
}

function encryptContent(content) {
  return CryptoJS.AES.encrypt(content, secretkey).toString();
}

function decryptContent(content) {
  return CryptoJS.AES.decrypt(content, secretkey).toString(CryptoJS.enc.Utf8);
}
