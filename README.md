💻프로젝트 명
- ## 뉴아인 API DOCS 프로젝트
  - ### 모바일 앱 API DOCS 
<br>

# 📋목차

## 1. [프로젝트 설명](#프로젝트-설명)

## 2. [사용 기술](#사용-기술)

## 3. [실행 설명](#실행-설명)

## 4. [배포 방법](#배포-방법)

## 5. [참고 사항](#참고-사항)

<br>

# 📢프로젝트 설명

> 이 프로젝트는 뉴아인의 API 가이드 문서 소스코드 저장 공간 입니다. 기존에 사용하는 Swagger는 편집 편의성 및 가독성이 좋지 않아 별도의 프로젝트를 통해 API 문서를 구현하기로 하였습니다.
> 해당 프로젝트는 VuePress로 작성되었습니다.

<br>

# 📚사용 기술
[![deploy](https://github.com/nueyne-backend/developers-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/nueyne-backend/developers-docs/actions/workflows/deploy.yml)

<div>
  <img src="https://img.shields.io/badge/Vue.js-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white">
</div>

<br>

# 💾실행 설명

### Vue 버전 : ^3.5.11
### VuePress 버전 : ^2.0.0-rc.17

뉴아인 API Docs 프로젝트는 Package Manager로 NPM을 사용하고 있습니다. NPM을 사용하여 종속성을 관리하고 있으며 NPM을 사용하여 프로젝트를 실행하시기 바랍니다.

#### 사전 작업

1. Node.js 및 NPM 설치
    Node.js LTS 버전으로 설치 [Node.js 공식홈페이지](https://nodejs.org/en/)
    **설치 확인**
    ```bash
    node -v
    ```
    ```bash
    npm -v
    ```
2. npm install 명령어로 종속성 설치
    ```bash
    npm install
    ```
3. 프로젝트 실행 확인
     ```bash
    npm run docs:dev
    ```
    이 명령어를 실행하면 서버가 실행되며, 브라우저에서 "http://localhost:8080/"로 접속하면 VuePress API 문서를 확인할 수 있습니다.

# 🚀배포 방법

1. git push main

# 🧾참고 사항

> - 커밋 메시지는 다음과 같은 파일의 규칙에 따라 작성을 권고합니다. : https://docs.google.com/document/d/1whegmi8hssWfXD53d-eDtjYF3vTgX75E/edit?usp=sharing&ouid=107526722292193607096&rtpof=true&sd=true
> - 개발 그라운드 룰은 뉴아인 Confluence에 작성되어 있습니다. 해당 문서를 참고하여 개발을 진행하시기 바랍니다.
> - 더 나은 개발 문화를 위해 적극적으로 문서나 개발 방법에 대한 피드백을 주세요 적극 수용할 준비가 되어있습니다.
