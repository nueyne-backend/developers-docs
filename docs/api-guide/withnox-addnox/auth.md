# **인증**

해당 페이지는 Withnox & Addnox 프로젝트의 인증과 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Withnox & Addnox 인증 API는 회원가입, 소셜 회원가입, 로그인, SMS 번호 인증과 같은 인증 관련 작업을 수행하는 기능입니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요.

## **인증**

일부 인증 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.


## **엔드포인트**
<!-- 
### **~~회원가입 여부 체크~~ Deprecated** 

~~해당 이메일로 회원가입한 유저가 존재하는지 체크하는 API입니다.~~

로직 변경으로 더이상 사용하지 않습니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/auth/sign-in/check/{email}
</div>

**Parameters:**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값|

**요청 예시**
```http
GET /api/v1/addnox/auth/sign-in/check/test@gmail.com
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

이미 회원가입한 유저일경우 200 OK로 응답하며 로그인 과정으로 분기하면 됩니다.
```json
{
  "message": "User already signed up please login"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User not found     | 가입된 유저 정보가 없습니다.|

```json
{
    "detail": "User not found"
}
```
:::

### **~~사전 회원가입~~ Deprecated**

~~해당 이메일과 비밀번호를 유저를 사전 생성하는 API입니다.~~

더 이상 사용하지 않습니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/email/pre-signup
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값|
| `password` <Badge type="danger" text="required" />| string    | 비밀번호 값|

**요청 예시**
```http
POST /api/v1/addnox/auth/email/pre-signup
Content-Type: application/json
{
  "email": "string",
  "password": "string"
}
```


**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

사전회원가입이 성공하면 사전 생성된 email_user_id 값을 전달해줍니다. 해당 값을 저장 후 signup API에서 사용하시면 됩니다.
```json
{
  "email_user_id": 0,
  "email": "string"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 409              |  Same email already registered     |  기가입된 이메일입니다.|

```json
{
    "detail": "Same email already registered"
}
```
::: -->

### **로그인**

해당 이메일과 비밀번호로 로그인하는 API입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/email/signin
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `username` <Badge type="danger" text="required" />| string    | 이메일 값|
| `password` <Badge type="danger" text="required" />| string    | 비밀번호 값|

**요청 예시**
```http
POST /api/v1/addnox/auth/email/signin
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

<!-- ### **~~이메일 아이디 조회~~ Deprecated**

~~로그인 과정에서 401 ERROR 회원가입이 완료되지 않았을때 사용자를 다시 회원가입 페이지로 리다이렉트 시키기 위해~~
~~해당 API를 통해 회원가입을 완료할 `email_user_id`를 획득하시기 바랍니다.~~

더 이상 사용되지 않습니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/email/get-id/{email}
</div>

**Parameters:**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값|

**요청 예시**
```http
POST /api/v1/addnox/auth/email/get-id/test@gmail.com
```


**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
{
  "email_user_id": 0
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Failed to get user id     |  해당 이메일로 사전가입된 계정이 없습니다.|

```json
{
  "detail": "Failed to get user id"
}
```
::: -->

### **SMS 인증 메세지 전송**

해당 전화번호로 인증 문자를 발송하는 API입니다. 회원가입 뿐만 아니라 잃어버린 계정을 찾는데도 사용됩니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/send-sms-auth
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +1012345678|

**요청 예시**
```http
POST /api/v1/addnox/auth/send-sms-auth
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
  /api/v1/addnox/auth/phone-number-validation
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +1012345678|
| `validnum` <Badge type="danger" text="required" />| string    | SMS 인증 메세지로 전송된 6자리 번호입니다.|

**요청 예시**
```http
POST /api/v1/addnox/auth/phone-number-validation
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
  /api/v1/addnox/auth/email/signup
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
| `gender` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 성별입니다 <br> - M : 남성 <br> - F : 여성 <br> - N : 논바이너리 <br> - P : 알려주고 싶지 않음|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +14155552671|
| `register_type` <Badge type="danger" text="required" />| string    | 회원가입 형식입니다. <br> - E : 이메일 <br> - S : 소셜|
| `is_push_agree` <Badge type="danger" text="required" />| boolean    | 푸시 알림 동의 여부입니다. |
| `is_marketing_agree` <Badge type="danger" text="required" />| boolean    | 마케팅 수신 동의 여부입니다.|
| `national_code` <Badge type="danger" text="required" />| string    | 국가 코드입니다. <br> - WITHNOX : KR <br> - ADDNOX : ISO code (2)

**요청 예시**
```http
POST /api/v1/addnox/auth/email/signup
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
  /api/v1/addnox/auth/send-reset-mail
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값입니다. |

**요청 예시**
```http
POST /api/v1/addnox/auth/phone-number-validation
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
  /api/v1/addnox/auth/find-id-by-phone
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +14155552671|
| `validnum` <Badge type="danger" text="required" />| string    | SMS 인증 메세지로 전송된 6자리 번호입니다.|

**요청 예시**
```http
POST /api/v1/addnox/auth/phone-number-validation
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

### **소셜 로그인**

소셜 로그인을 진행하는 API입니다. 파라미터로 소셜 provider를 전달해야합니다.
소셜 공급자별로 토큰이 다르기 때문에 Body Parameter 값 두개 중 하나만 보내도 됩니다.

`403 에러`는 소셜 회원가입을 진행하지 않은 유저이므로 소셜 회원가입으로 분기하시면 됩니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/social-signin/{provider}
</div>

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `provider` <Badge type="danger" text="required" />| string    | 소셜 provider 값입니다. <br> - 애플: apple <br> - 구글: google <br> - 페이스북(메타): facebook <br> - 네이버: naver <br> - 카카오: kakao|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `id_token` <Badge type="info" text="optional" />| string    | provider가 apple,google,kakao 인 경우에는 필수값|
| `access_token` <Badge type="info" text="optional" />| string    | provider가 facebook, naver 인 경우에는 필수값|

**요청 예시**
```http
POST /api/v1/addnox/auth/social-signin/google
Content-Type: application/json
{
  "id_token": "string",
  "access_token": "string"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

이미 소셜 회원가입한 유저라면 정상적으로 로그인이 진행되어 `access_token`을 발급합니다.

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
| 400              | User is signed up with email type   |  이메일 방식으로 회원가입한 유저입니다.|
| 401              | User is Deleted    |  회원탈퇴한 계정입니다.|
| 403              | User is not valid, please sign up    |  소셜 회원가입이 필요한 유저입니다.|
| 404              | User is signed up with {social_type} type   |  다른 social provider로 회원가입한 유저입니다.|
| 409              | Invalid {provider} access token   |  유효하지 않은 토큰입니다.|
| 423              | Access denied. Account blocked |  차단된 계정입니다.|

```json
{
  "detail": "User is not valid, please sign up"
}
```
:::

### **소셜 회원가입**

사용자의 정보를 가지고 소셜 회원가입을 진행합니다.
일반 회원가입과 마찬가지로 SMS 번호 검증을 통한 `valid_token`이 필요합니다.


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/social/signup
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | valid_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값입니다. |
| `first_name` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 이름입니다.|
| `last_name` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 성입니다.|
| `birthdate` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 생년월일입니다(yyyymmdd). <br> - 예시 : 19970101|
| `gender` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 성별입니다 <br> - M : 남성 <br> - F : 여성 <br> - N : 논바이너리 <br> - P : 알려주고 싶지 않음|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값이 E.164 format 이어야 합니다. <br> - ex: +14155552671|
| `register_type` <Badge type="danger" text="required" />| string    | 회원가입 형식입니다. <br> - E : 이메일 <br> - S : 소셜|
| `social_id` <Badge type="danger" text="required" />| string    | 소셜 provider에 따라 고유 Sub 값 또는 ID를 보내주세요|
| `social_type` <Badge type="danger" text="required" />| string    | 소셜 provider 값입니다. <br> - 구글 : google <br> - 애플 : apple <br> - 페이스북(메타) : facebook <br> - 네이버 : naver <br> -  카카오 : kakao|
| `is_push_agree` <Badge type="danger" text="required" />| boolean    | 푸시 알림 동의 여부입니다. |
| `is_marketing_agree` <Badge type="danger" text="required" />| boolean    | 마케팅 수신 동의 여부입니다.|
| `national_code` <Badge type="danger" text="required" />| string    | 국가 코드입니다. <br> - WITHNOX : KR <br> - ADDNOX : ISO code (2)

**요청 예시**
```http
POST /api/v1/addnox/auth/social/signup
Authorization: Bearer valid_token_here
Content-Type: application/json
{
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "birthdate": "string",
  "gender": "string",
  "phone": "string",
  "register_type": "string",
  "social_id": "string",
  "social_type": "string",
  "is_push_agree": true,
  "is_marketing_agree": true,
  "national_code": "string"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

소셜 회원가입이 성공하면 정상적으로 로그인이 진행되어 `access_token`을 발급합니다.

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
| 401              | Not authenticated    |  유효하지않은 valid_token입니다.|


```json
{
  "detail": "Not authenticated"
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