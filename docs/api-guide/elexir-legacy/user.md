# **유저**

해당 페이지는 Elexir Legacy 프로젝트의 유저와 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Elexir Legacy 유저 API는 사용자 정보 불러오기, 업데이트 등과 연관된 자식 계정 관련 작업을 수행하는 기능입니다.
API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/4ku2F0sWUBycYZAP5Zo1gZ/Elexir-Legacy-API-Flow?node-id=0-1&p=f&t=2SiQxHwy08Cs6NfT-0) 페이지를 참고해주세요.

## **인증**

모든 유저 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **이메일 중복 검사**

회원가입전 이메일 중복 검사를 통해 회원가입 가능 여부를 조회합니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/legacy/user/dup_check_email/{email}
</div>

**요청 예시**
```http
GET /api/v1/legacy/user/dup_check_email/test@gmail.com HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>
- False는 중복된 이메일이 존재합니다.
- True는 해당 이메일로 회원가입이 가능합니다.

```bool
True
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     |  서버 에러|

```json
{
    "detail": "Internal Server Error"
}
```
:::


### **전화번호 중복 검사**

회원가입전 전화번호 중복 검사를 통해 회원가입 가능 여부를 조회합니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/legacy/user/dup_check_phone/{phone}
</div>

**요청 예시**
```http
GET /api/v1/legacy/user/dup_check_phone/010-1234-5678 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>
- False는 중복된 전화번호가 존재합니다.
- True는 해당 전화번호로 회원가입이 가능합니다.

```bool
True
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     | 서버 에러|

```json
{
    "detail": "Internal Server Error"
}
```
:::


### **유저 정보 가져오기**

로그인한 사용자의 정보를 불러옵니다. 응답에서 사용자가 비밀번호를 교체한지 3개월이 지낫는지, 정보 업데이트가 필요한지 여부를 Boolean 값으로 알려줍니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/legacy/user/me
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `username` <Badge type="danger" text="required" />| string    | 이메일 값|
| `password` <Badge type="danger" text="required" />| string    | 비밀번호 값|


**요청 예시**
```http
GET /api/v1/legacy/user/me HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "email": "jeongtae.kim@nueyne.com",
    "phone": "010-1234-5858",
    "username": "tester1234",
    "relation": "S",
    "gender": "M",
    "birthdate": "1990-01-01",
    "gender_real": "M",
    "birthdate_real": "1990-01-01",
    "social_google_id": "",
    "social_kakao_id": "",
    "social_naver_id": "",
    "social_apple_id": "",
    "is_marketing_agree": true,
    "is_push_agree": true,
    "adrs": "경기도",
    "adrs_city": "경기도",
    "id": 1,
    "is_email_checked": true,
    "is_active": true,
    "regdate": "2025-04-02T15:10:58",
    "is_blocked": false,
    "block_type": "A",
    "block_reason": null,
    "need_to_pwd_chg": false,
    "last_pwd_changed_at": "2025-04-02T15:10:58"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | 가입된 유저 정보가 없습니다.|
| 401              | User is Deleted  | 회원탈퇴한 유저입니다.     |

```json
{
    "detail": "User is None"
}
```
:::

### **유저 푸시 토큰 설정**

유저에게 푸시 알림을 보내기 위해 FCM 토큰을 서버에 저장합니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/legacy/user/push/set-token
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `token` <Badge type="danger" text="required" />| string    | FCM 토큰 값|

**요청 예시**
```http
POST /api/v1/legacy/user/push/set-token HTTPS
Authorization: Bearer your_token_here
{
    token: "your token"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
{
    "statusCode": 200, 
    "message": "Set push token successfully"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     | 서버 에러|

```json
{
    "detail": "Internal Server Error"
}
```
:::



