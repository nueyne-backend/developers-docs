# **API 가이드**

## **소개**
Nu Eyne Developers는 앱에서 활용할 수 있는 API를 제공합니다.

Nu Eyne Developers API는 REST API이며 HTTPS로 통신합니다. 플랫폼에 상관없이 HTTPS를 지원하면 어디서나 API를 호출할 수 있습니다.

API를 호출할 때는 유효한 인증토큰이 있어야 합니다. 이는 각 플랫폼에서 제공하는 로그인 API를 통해 발급받을 수 있습니다. 개발 과정에서 사용할 테스트 계정은 관리자에게 문의하세요. @Jeongtae Kim

## **엔드포인트**
Nu Eyne Developers API의 엔드포인트 형식은 다음과 같습니다.

```
https://{host}/{api-path}/{path-variable}  
```

- `host`는 API 서버의 호스트입니다. 아래 중에 선택할 수 있습니다.
    - dev: app.nueyne.dev
    - prod: prod.nueyne.dev
- `api-path`는 호출할 API의 경로입니다. 각 엔드포인트 상세 설명에서 확인할 수 있습니다. 
  API 버전도 `api-path` 안에 포함됩니다.
- `path-variable`은 경로에 포함된 변수로, {variable_name} 형식으로 나타내며 특정 값으로 대체됩니다.

## **요청**
Nu Eyne Developers API 요청은 아래와 같은 규약을 따릅니다.

- 모든 API 요청은 HTTPS로 전송합니다.

- 파라미터는 쿼리 혹은 JSON 형식의 요청 본문으로 전달할 수 있습니다.

## **요청 헤더**

요청 본문을 파라미터로 사용하는 API는 HTTP 헤더에 Content-Type을 "application/json"으로 설정해야 합니다.