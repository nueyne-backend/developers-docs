# **인증**

해당 페이지는 Elexir Legacy 프로젝트의 인증과 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Elexir Legacy 인증 API는 회원가입, 로그인과 같은 인증 관련 작업을 수행하는 기능입니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/4ku2F0sWUBycYZAP5Zo1gZ/Elexir-Legacy-API-Flow?node-id=0-1&p=f&t=2SiQxHwy08Cs6NfT-0) 페이지를 참고해주세요.

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
  /api/v1/legacy/auth/signin
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `username` <Badge type="danger" text="required" />| string    | 이메일 값|
| `password` <Badge type="danger" text="required" />| string    | 비밀번호 값|

**요청 예시**
```http
POST /api/v1/legacy/auth/signin
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

### **이메일 회원가입**

입력받은 정보를 통해 회원가입을 완료하는 API입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/legacy/auth/signup
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | 이메일 값입니다. |
| `password` <Badge type="danger" text="required" />| string    | 비밀번호 입니다.|
| `phone` <Badge type="danger" text="required" />| string    | 전화번호 값입니다. <br> - ex: 010-1234-5678|
| `username` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 이름입니다.|
| `relation` <Badge type="danger" text="required" />| string    | 디바이스를 본인이 사용하지 않을 경우 사용자와의 관계를 입력합니다. <br> - 부모 <br> - 자녀|
| `gender` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 성별입니다 <br> - M : 남성 <br> - F : 여성|
| `birthdate` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 생년월일입니다(yyyy-mm-dd). <br> - 예시 : 1997-01-01|
| `gender_real` <Badge type="danger" text="required" />| string    | 디바이스를 본인이 사용하지 않을 경우 사용자의 성별입니다. 만약 본인이 사용한다면 gender값을 그대로 보내주세요. <br> - M : 남성 <br> - F : 여성 |
| `birthdate_real` <Badge type="danger" text="required" />| string    | 디바이스를 본인이 사용하지 않을 경우 사용자의 생년월일입니다(yyyy-mm-dd). 만약 본인이 사용한다면 birthdate값을 그대로 보내주세요. <br> - 예시 : 1997-01-01|
| `social_google_id` <Badge type="info" text="optional" />| string    |구글 소셜 계정의 고유 sub 값 |
| `social_kakao_id` <Badge type="info" text="optional" />| string    |카카오 소셜 계정의 고유 sub 값 |
| `social_naver_id` <Badge type="info" text="optional" />| string    | 네이버 소셜 계정의 고유 sub 값|
| `social_apple_id` <Badge type="info" text="optional" />| string    | apple 소셜 계정의 고유 sub 값|
| `is_marketing_agree` <Badge type="danger" text="required" />| boolean    | 마케팅 수신 동의 여부입니다.|
| `is_push_agree` <Badge type="danger" text="required" />| boolean    | 푸시 알림 동의 여부입니다. |
| `adrs` <Badge type="danger" text="required" />| string    | 회원가입할 유저의 거주 지역입니다. <br> [강원도, 경기도, 경상북도, 광주광역시, 대구광역시, 대전광역시, 부산광역시, 서울특별시, 세종특별자치시, 울산광역시, 인천광역시, 전라남도, 전라북도, 충청남도, 충청북도]|
| `adrs_city` <Badge type="danger" text="required" />| string    | adrs값을 그대로 보내주세요.

**요청 예시**
```http
POST   /api/v1/legacy/auth/signup
Authorization: Bearer valid_token_here
Content-Type: application/json
{
    "email": "jeongtae.kim@nueyne.com",
    "password": "1234",
    "phone": "010-1234-5858",
    "username": "tester1234",
    "relation": "S",
    "gender": "M",
    "gender_real": "M",
    "birthdate": "1990-01-01",
    "birthdate_real": "1990-01-01",
    "social_google_id": "",
    "social_kakao_id": "",
    "social_naver_id": "",
    "social_apple_id": "",
    "is_marketing_agree": true,
    "is_push_agree": true,
    "adrs": "경기도",
    "adrs_city": "경기도"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

회원가입이 성공하면 statuscode 201과 message를 리턴합니다. 
사용자가 회원가입때 사용한 이메일로 인증메일을 전송합니다.

```json
{
    "statusCode": 201,
    "message": "User created successfully"
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
