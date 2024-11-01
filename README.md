# 영화 리뷰 및 소개 웹 애플리케이션 (Gump)

![프로젝트 로고](https://github.com/KBS129/gump/blob/develop/logo.png)

## 소개

이 프로젝트는 사용자가 영화에 대한 리뷰를 작성하고, 다른 사용자의 리뷰를 확인할 수 있는 웹 애플리케이션입니다. 사용자는 회원가입 및 로그인을 통해 개인적인 마이페이지에서 자신이 작성한 리뷰를 관리할 수 있으며, 다양한 영화를 검색하고 그에 대한 정보를 얻을 수 있습니다.

## 팀원 소개

이 프로젝트는 총 세 명의 팀원이 협력하여 개발하였습니다.

- **이민재** - _디자인 담당_
  디자인 레이아웃 담당, 애플리케이션의 비주얼과 레이아웃 구성 및 디자인 구현
  이메일: [lmj1104701@gmail.com](mailto:lmj1104701@gmail.com)

- **최동호** - _프론트엔드 담당_
  애플리케이션 사용자 인터페이스 구현 담당. 컴포넌트 구조 설계 및 API 이용 데이터 처리
  이메일: [studydongho0429@gmail.com](mailto:studydongho0429@gmail.com)

- **윤성민** - _프론트엔드 및 백엔드 담당_
  프론트엔드와 함께 Supabase를 이용한 데이터베이스 설계 및 API를 통한 애플리케이션 데이터 인증 및 흐름 관리
  이메일: [naruoto43@gmail.com](mailto:naruoto43@gmail.com)

## 기능

- **회원가입 및 로그인**: 사용자는 이메일과 비밀번호를 통해 회원가입 후, 로그인하여 개인 정보를 관리할 수 있습니다.
- **영화 검색 및 상세 정보**: TMDB API를 활용하여 최신 영화 정보를 검색하고, 각 영화의 상세 정보를 확인할 수 있습니다.
- **리뷰 작성 및 관리**: 사용자는 각 영화에 대해 리뷰를 작성하고, 자신이 작성한 리뷰를 마이페이지에서 관리할 수 있습니다.
- **게시판 기능**: 영화에 대한 자유로운 의견을 나누는 게시판을 통해 다른 사용자와 소통할 수 있습니다.
- **반응형 웹 디자인**: 다양한 디바이스에서 원활한 사용자 경험을 제공하는 반응형 UI를 구현하였습니다.

## 기술 스택

- **프론트엔드**
  - Next.js (React 기반 프레임워크)
  - TypeScript (정적 타입 검사)
  - Tailwind CSS (스타일링 프레임워크)
  - Zustand (상태 관리 라이브러리)
- **백엔드**

  - Supabase (PostgreSQL 데이터베이스 및 인증 서비스)
  - TMDB API (영화 정보 API)

- **기타**
  - Axios (HTTP 클라이언트)
  - Vercel (배포 플랫폼)

## 프로젝트 구조

```plaintext
📦 프로젝트 루트
├── 📂 api                          # API 통신 관련 파일
│   ├── supabase.api.ts             # Supabase API 통신 관련 함수
│   └── tmdb.api.ts                 # TMDB API 통신 관련 함수
├── 📂 app                          # Next.js의 App Router를 사용한 페이지 및 컴포넌트
│   ├── 📂 (providers)              # Context Provider 관련 컴포넌트
│   │   └── ModalProvider.tsx       # 모달 컨텍스트 프로바이더
│   ├── 📂 (root)                   # 루트 레이아웃 및 페이지 관련 파일
│   ├── 📂 movies                    # 영화 관련 페이지 및 컴포넌트
│   │   └── [movieId]               # 개별 영화 페이지
│   │       ├── 📂 _components       # 영화 페이지의 컴포넌트
│   │       │   ├── MovieReviewsList.tsx  # 영화 리뷰 목록 컴포넌트
│   │       │   └── NewReviewModal.tsx   # 새 리뷰 작성 모달 컴포넌트
│   │       └── page.tsx            # 개별 영화 상세 페이지
│   ├── 📂 mypage                   # 마이페이지
│   │   └── page.tsx                # 마이페이지 컴포넌트
│   ├── 📂 posts                    # 게시글 관련 페이지
│   │   ├── [id]                    # 특정 게시글 페이지
│   │   │   └── page.tsx            # 게시글 상세 페이지
│   │   ├── edit                    # 게시글 수정 페이지
│   │   │   └── page.tsx            # 게시글 수정 컴포넌트
│   │   ├── new                     # 새로운 게시글 작성 페이지
│   │   │   └── page.tsx            # 새 게시글 작성 컴포넌트
│   │   └── page.tsx                # 게시글 목록 페이지
│   ├── 📂 sign-up                  # 회원가입 페이지
│   │   └── page.tsx                # 회원가입 컴포넌트
│   ├── page.tsx                    # 홈 페이지
│   ├── layout.tsx                  # 전체 레이아웃 컴포넌트
│   ├── globals.css                  # 전역 스타일
│   └── supabase.ts                 # Supabase 클라이언트 설정
├── 📂 components                    # 재사용 가능한 UI 컴포넌트
│   ├── Backdrop.tsx                 # 모달이나 드롭다운 등 배경을 흐리게 하는 컴포넌트
│   ├── Header.tsx                   # 사이트의 상단 헤더로, 내비게이션 바와 로고를 포함
│   ├── LikeMovieButton.tsx          # 영화에 좋아요를 표시하고, 클릭 시 상태를 변경하는 버튼
│   ├── LoginModal.tsx               # 로그인 폼을 포함한 모달 컴포넌트
│   ├── MovieCard.tsx                # 영화 정보를 카드 형식으로 표시하는 컴포넌트
│   ├── MovieCarousel.tsx             # 여러 영화를 슬라이드 형태로 보여주는 캐러셀 컴포넌트
│   ├── MovieList.tsx                # 영화 목록을 리스트 형식으로 표시하는 컴포넌트
│   ├── page.tsx                     # 특정 페이지에서 사용하는 컴포넌트
│   └── Rating.tsx                   # 영화의 평점을 표시하는 컴포넌트
```
