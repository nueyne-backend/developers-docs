# **인증**

해당 페이지는 LUX 프로젝트의 인증과 관련된 API를 설명해놓은 페이지입니다.

## **소개**

LUX 인증 API는 회원가입, 소셜 회원가입, 로그인, SMS 번호 인증과 같은 인증 관련 작업을 수행하는 기능입니다.

<!-- API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요. -->

## **인증**

일부 인증 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.


## **엔드포인트**


### **로그인**

해당 이메일과 비밀번호로 로그인하는 API입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/email/signin
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `username` <Badge type="danger" text="required" />| string    | 이메일 값|
| `password` <Badge type="danger" text="required" />| string    | 비밀번호 값|

**요청 예시**
```http
POST /api/v1/lux/auth/email/signin
Content-Type: application/x-www-form-urlencoded
{
  "username ": "string",
  "password ": "string"
}
```


**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

로그인이 성공하면 사용자에게 `access_token`과 `refresh_token`을 발급합니다.
API 호출시에는 `access_token`을 사용하세요. `refresh_token`은 `access_token` 만료시 재발급할때 사용하세요.

```json
{
  "access_token": "string",
  "expires_in": 0,
  "refresh_token": "string",
  "refresh_expires_in": 0,
  "id": 0,
  "token_type": "string"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Password is invalid     |  잘못된 비밀번호입니다.|
| 401              | Sign-up not completed     |  회원가입이 완료되지 않았습니다.|
| 403              | SMS verification required     |  SMS 인증이 완료되지 않았습니다.|
| 404              | User not found     |  해당 유저를 찾을 수 없습니다.|
| 410              | User is Deleted     |  회원탈퇴한 계정입니다.|
| 423              | Access denied. Account blocked |  차단된 계정입니다.|

```json
{
    "detail": "Password is invalid"
}
```
:::

### **토큰 재발급**

refresh_token을 이용해 token을 재발급 받는 API입니다.
refresh_token의 유저 정보가 일치하지만 DB에 저장된 refresh_token과 일치하지 않을 경우
중복 로그인으로 판단하여 DB의 refresh_token을 삭제합니다.
프론트단에서는 401 Refresh token is not valid 오류에서 로그아웃으로 분기해야 합니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/refresh-token
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `refresh_token` <Badge type="danger" text="required" />| string    | 기존 Refresh Token|

**요청 예시**
```http
POST /api/v1/lux/auth/refresh-token
Content-Type: application/json
{
  "refresh_token": "string"
}
```


**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "access_token": "access_token",
    "expires_in": 900, // 15 분 
    "refresh_token": "new_refresh_token",
    "refresh_expires_in": 1209600,  // 2 주
    "id": "uuid",
    "token_type": "bearer",
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Token is expired     |  refresh_token이 만료됨, 로그아웃시켜야함. |
| 401              | Could not validate credentials     |  잘못된 refresh_token, 로그아웃시켜야함.|
| 401              | Refresh token is not valid     |  중복 로그인으로 판단, 로그아웃시켜야함.|

```json
{
    "detail": "Refresh token is not valid"
}
```
:::

### **SMS 인증 메세지 전송**

해당 전화번호로 인증 문자를 발송하는 API입니다. 회원가입 뿐만 아니라 잃어버린 계정을 찾는데도 사용됩니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/send-sms-auth
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +1012345678|

**요청 예시**
```http
POST /api/v1/lux/auth/send-sms-auth
Content-Type: application/json
{
  "phone": "+1012345678"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

문자 발송이 성공하면 true가 반환됩니다.

```json
  true
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Phone number is invalid    |  잘못된 전화번호 형식입니다.|
| 409              | Phone number is already registered    |  이미 회원가입이 완료된 계정의 전화번호입니다.|
| 409              | Failed to send SMS    |  Twillo 서비스를 통한 문자 전송 실패.|
```json
{
  "detail": "Phone number is invalid"
}
```
:::

### **SMS 인증 번호 검증**

SMS 인증 메세지로 전송된 6자리 번호를 검증하는 API 입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/phone-number-validation
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +1012345678|
| `validnum` <Badge type="danger" text="required" />| string    | SMS 인증 메세지로 전송된 6자리 번호입니다.|

**요청 예시**
```http
POST /api/v1/lux/auth/phone-number-validation
Content-Type: application/json
{
  "phone": "+1012345678",
  "validnum": "123456"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

SMS 인증 번호 검증이 성공하면 valid_token 을 return 해줍니다.
signup API 호출시 해당 토큰을 Authorization Header에 담아서 보내주세요.

```json
{
  "valid_token": "string"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Validation code is expired    |  인증번호가 만료되었습니다.|
| 400              | Validation code is invalid    |  잘못된 인증번호입니다.|
| 403              | User previously deleted    |  이미 탈퇴 처리된 사용자입니다.|
| 409              | Phone number is already registered    |  이미 회원가입한 번호입니다.|
```json
{
  "detail": "Validation code is expired"
}
```
:::

### **이메일 회원가입**

입력받은 정보를 통해 회원가입을 완료하는 API입니다.
SMS 인증 검증을 통해 받은 `valid_token`을 확인해주세요.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/email/signup
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | valid_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값입니다. |
| `password` <Badge type="danger" text="required" />| string    | 비밀번호 입니다.|
| `first_name` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 이름입니다.|
| `last_name` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 성입니다.|
| `birthdate` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 생년월일입니다(yyyymmdd). <br> - 예시 : 19970101|
| `gender` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 성별입니다 <br> - M : 남성 <br> - F : 여성 <br> - P : 알려주고 싶지 않음|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +14155552671|
| `register_type` <Badge type="danger" text="required" />| string    | 회원가입 형식입니다. <br> - E : 이메일 <br> - S : 소셜|
| `is_push_agree` <Badge type="danger" text="required" />| boolean    | 푸시 알림 동의 여부입니다. |
| `is_marketing_agree` <Badge type="danger" text="required" />| boolean    | 마케팅 수신 동의 여부입니다.|
| `national_code` <Badge type="danger" text="required" />| string    | 국가 코드입니다. [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 

**요청 예시**
```http
POST /api/v1/lux/auth/email/signup
Authorization: Bearer valid_token_here
Content-Type: application/json
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string",
  "birthdate": "string",
  "gender": "string",
  "phone": "string",
  "register_type": "string",
  "is_push_agree": true,
  "is_marketing_agree": true,
  "national_code": "string"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

회원가입이 성공하면 로그인이 성공한것 처럼 토큰을 전달해줍니다.

```json
{
  "access_token": "string",
  "expires_in": 0,
  "refresh_token": "string",
  "refresh_expires_in": 0,
  "id": 0,
  "token_type": "string"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Email is not valid    |  유효하지 않은 이메일 형식입니다.|
| 401             | Token is invalid    |  유효하지 않은 토큰입니다.|
| 409              | Same email is already registered    |  이미 회원가입한 이메일입니다.|
| 500              | Failed to sign up user    |  회원가입을 실패하였습니다.|

```json
{
  "detail": "Email is not valid"
}
```
:::

### **비밀번호 초기화**

비밀번호 초기화를 위해 사용자의 이메일로 리셋 이메일을 보내주는 API입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/send-reset-mail
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값입니다. |

**요청 예시**
```http
POST /api/v1/lux/auth/phone-number-validation
Content-Type: application/json
{
  "email": "string"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
{
  "statusCode": 200,
  "message": "User reset password email send successfully"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | User signed up using a social account |  소셜 계정으로 회원가입한 유저입니다.|
| 404              | User ID not found    |  등록된 유저가 아닙니다.|
| 500              | Email send failed    |  해당 이메일로 전송이 실패하였습니다.|

```json
{
  "detail": "User id is not found"
}
```
:::

### **아이디(계정) 찾기**

아이디 또는 계정을 유저의 전화번호를 통해 찾는 API입니다.
SMS 인증 메세지 전송 API 호출 후 불러야 합니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/find-id-by-phone
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +14155552671|
| `validnum` <Badge type="danger" text="required" />| string    | SMS 인증 메세지로 전송된 6자리 번호입니다.|

**요청 예시**
```http
POST /api/v1/lux/auth/phone-number-validation
Content-Type: application/json
{
  "phone": "string",
  "validnum": "string"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
{
  "email": "your@email.com",
  "provider": "naver"
}
```

@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Validation code is expired    |  인증번호가 만료되었습니다.|
| 400              | Validation code is invalid    |  잘못된 인증번호입니다.|
| 403              | User previously deleted    |  이미 탈퇴 처리된 사용자입니다.|
| 404              | User id is not found    |  해당 이메일로 회원가입한 사용자를 찾을 수 없습니다.|

```json
{
  "detail": "Validation code is expired"
}
```
:::

## **공통 에러 처리**

모든 엔드포인트에서 공통적으로 응답하는 에러코드입니다.

**Error Response Example**

- `401 Unauthorized`: 토큰이 잘못되었습니다.
  ```json
  {
    "detail": "Could not validate credentials" // 토큰이 잘못되었습니다.
  }
  ```
- `401 Unauthorized`: 토큰이 만료되었습니다.
  ```json
  {
    "detail": "Token is expired" // 토큰이 만료되었습니다.
  }
  ```
- `404 Not Found`: 리소스를 찾을 수 없습니다. URI를 다시 확인해주세요.
  ```json
  {
    "detail": "Resource not found"
  }
  ```
- `500 Internal Server Error`: 서버 에러입니다.
  ```json
  {
    "detail": "Internal server error. Please try again later."
  }
  ```