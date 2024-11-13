
# 🐾 Tweet My Pet - Frontend  

[![Contributors](https://img.shields.io/badge/contributors-4-brightgreen)](#-기여자-contributors)  

**"트윗마이펫"** 은 반려동물 동반 여행지를 추천받고 공유할 수 있는 모바일 애플리케이션입니다.  
사용자는 앱을 통해 반려동물 친화적인 장소를 검색하고, 자신만의 경험을 다른 사용자와 공유할 수 있습니다.

---

## 🌟 주요 기능

- **추천 여행지 검색**: 반려동물 동반 가능 여행지 추천 및 검색 기능  
- **리뷰 작성 및 공유**: 사용자 경험 공유 및 여행지 리뷰 작성
- **시설 예약**: 사용자가 원하는 시설 에약 기능  
- **유저 계정 관리**: 회원가입, 로그인, JWT 토큰 기반 인증

---

## 🧑‍💻 기여자

| 이름         | Github 프로필            | 역할                              | 언어 및 사용 툴  |
|--------------|--------------------------|-----------------------------------|---------------|
| **권민지** | [mjgwon24](https://github.com/mjgwon24) | PM & frontend & backend           | React Native, TypeScript, JS, HTML, CSS |
| **김진수** | [Jin-su-11](https://github.com/Jin-su-11) | 데이터베이스 설계 & frontend & backend        | React Native, TypeScript, JS, HTML, CSS |
| **임석진** | [seokjin925](https://github.com/seokjin925) | frontend & backend                 | React Native, TypeScript, JS, HTML, CSS |
| **문채윤** | - | 프로젝트 기획 및 기능 설계             | Figma |

---

## 🛠️ 기술 스택

- **프레임워크**: [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)  
- **언어**: TypeScript, JavaScript  
- **스타일링**: Tailwind CSS  
- **상태 관리**: React Context API  
- **기타**: Async Storage를 활용한 JWT 기반 자동 로그인 구현  

---

## 📁 프로젝트 구조

```plaintext
src/
├── components/        # 재사용 가능한 UI 컴포넌트 (버튼, 카드, 모달 등)
├── config/            # 앱 설정 관련 파일 (환경 변수, 설정값 등)
├── image/             # 앱에서 사용하는 이미지 및 아이콘
├── navigation/        # 앱 내 네비게이션 관련 (탭, 스택 네비게이션 등)
├── screens/           # 앱의 주요 화면 (홈, 로그인, 설정 등)
├── utils/             # 유틸리티 함수 및 API 통신 로직
├── App.tsx            # 앱 진입점 (메인 컴포넌트)
└── tailwind.config.js # Tailwind CSS 설정 파일
```

---

## 📋 실행 방법

1. **저장소 클론**  
   ```bash
   git clone https://github.com/mjgwon24/tweet-my-pet-front.git
   cd tweet-my-pet-front
   ```

2. **의존성 설치**  
   ```bash
   yarn install
   ```

3. **Expo 로컬 서버 실행**  
   ```bash
   expo start
   ```

4. **시뮬레이터에서 실행**  
   - iOS: iOS 시뮬레이터에서 실행하거나, Expo Go 앱을 통해 테스트  
   - Android: Android 에뮬레이터에서 실행하거나, Expo Go 앱을 통해 테스트  

---

## 📬 문의

프로젝트 관련 문의는 GitHub Issues 또는 아래 연락처로 보내주세요.

- **Github:** [Tweet My Pet](https://github.com/mjgwon24/tweet-my-pet-front.git)  
- **이메일:** alswlchlrh8@naver.com

---

**"트윗마이펫" 앱으로 반려동물과의 여행을 더욱 특별하게 만들어보세요!** 🐶🐱✨  
