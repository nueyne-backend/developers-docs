# **Authentication**

This page describes the APIs related to authentication for the LUX project.

## **Introduction**

The LUX Authentication API provides functions to perform authentication-related tasks such as user registration (sign-up), social media sign-up, login, and SMS number verification.

<!-- API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요. -->

## **Authentication**

Some authentication APIs require an authentication token. Please include the authentication token in the `Authorization` header to make authenticated API requests.
```
Authorization: Bearer your_token_here
```
Replace `your_token_here` with the access token obtained during the authentication process.

## **Endpoints**


### **Signin**

This API allows a user to log in with the provided email and password.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/email/signin
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `username` <Badge type="danger" text="required" />| string    | Email value|
| `password` <Badge type="danger" text="required" />| string    | Password value|

**Request Example**
```http
POST /api/v1/lux/auth/email/signin
Content-Type: application/x-www-form-urlencoded
{
  "username ": "string",
  "password ": "string"
}
```


**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the login is successful, the API provides an `access_token` and a refresh_token. Use `access_token` for API calls. The `refresh_token` is used to renew the `access_token` upon expiration.

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

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Password is invalid     |  Incorrect password.|
| 401              | Sign-up not completed     |  Sign-up is not completed.|
| 403              | SMS verification required     |  SMS verification is not completed.|
| 404              | User not found     |  User could not be found.|
| 410              | User is Deleted     |  Account has been deleted.|
| 423              | Access denied. Account blocked |  Account has been blocked.|

```json
{
    "detail": "Password is invalid"
}
```
:::

### **Token Refresh**

This is an API that reissues a token using a refresh_token.
If the user information in the refresh_token matches, but the token itself does not match the refresh_token stored in the DB (database),
it is considered a duplicate login, and the refresh_token in the DB is deleted.
On the front-end, a "401 Refresh token is not valid" error should be handled by branching to a logout process.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/refresh-token
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `refresh_token` <Badge type="danger" text="required" />| string    | Original Refresh Token|

**Request Example**
```http
POST /api/v1/lux/auth/refresh-token
Content-Type: application/json
{
  "refresh_token": "string"
}
```


**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "access_token": "access_token",
    "expires_in": 900, // 15 minutes 
    "refresh_token": "new_refresh_token",
    "refresh_expires_in": 1209600,  // 2 weeks
    "id": "uuid",
    "token_type": "bearer",
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Token is expired     |  refresh_token is expired, proceed logout process. |
| 401              | Could not validate credentials     |  wrong refresh_token, proceed logout process.|
| 401              | Refresh token is not valid     |  Considered a duplicate login, proceed logout process.|

```json
{
    "detail": "Refresh token is not valid"
}
```
:::

### **Send SMS Verification Message**

This API sends an SMS verification message to the provided phone number.
It is used not only for signup but also to help users retrieve lost accounts.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/send-sms-auth
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | Phone number to send the verification message(E.164 format) <br> - ex: +1012345678|

**Request Example**
```http
POST /api/v1/lux/auth/send-sms-auth
Content-Type: application/json
{
  "phone": "+1012345678"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the SMS verification message is successfully sent, it returns a `true`.

```json
  true
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Phone number is invalid    |  Phone number format is invalid|
| 409              | Phone number is already registered    |  This phone number is already registered|
| 409              | Failed to send SMS    |  Send sms message with Twillo service has failed|

```json
{
  "detail": "Phone number is invalid"
}
```
:::

### **Verify SMS Verification Code**

This API verifies the SMS verification code sent to the user's phone number.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/phone-number-validation
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | Phone number to send the verification message(E.164 format) <br> - ex: +14155552671|
| `validnum` <Badge type="danger" text="required" />| string    | 6-digit verification code received via SMS|

**Request Example**
```http
POST /api/v1/lux/auth/phone-number-validation
Content-Type: application/json
{
  "phone": "+1012345678",
  "validnum": "123456"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the SMS verification code is successfully verified, it returns `valid_token`.
When calling the [signup](#email-signup), include the `valid_token` in the Authorization header.

```json
{
  "valid_token": "string"
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.


| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Validation code is expired    |  The code has expired.|
| 400              | Validation code is invalid    |  The code provided is invalid.|
| 403              | User previously deleted    |  Account has been deleted.|
| 409              | Phone number is already registered    |  Already signed up phone number.|
```json
{
  "detail": "Validation code is expired"
}
```
:::

### **Email Signup**

This API allows a user to complete the signup process with an email and password. 
Include the `access_token` in the Authorization header for authentication.

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
| `email` <Badge type="danger" text="required" />| string    | Email address |
| `password` <Badge type="danger" text="required" />| string    | Password value.|
| `first_name` <Badge type="danger" text="required" />| string    | User's Fullname|
| `last_name` <Badge type="danger" text="required" />| string    | Depreacted, please send empty string|
| `birthdate` <Badge type="danger" text="required" />| string    | User's birthdate in the format(yyyymmdd) <br> - ex : 19970101|
| `gender` <Badge type="danger" text="required" />| string    | User's gender <br> - M : Male <br> - F : Female <br> - P : Prefer Not to Say|
| `phone` <Badge type="danger" text="required" />| string    | Phone number in E.164 format <br> - ex: +14155552671|
| `register_type` <Badge type="danger" text="required" />| string    | Registration type <br> - E : Email <br> - S : Social|
| `is_push_agree` <Badge type="danger" text="required" />| boolean    | Whether the user agrees to receive push notifications |
| `is_marketing_agree` <Badge type="danger" text="required" />| boolean    |Whether the user agrees to receive marketing communications|
| `national_code` <Badge type="danger" text="required" />| string    |  Country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 

**Request Example**
```http
POST /api/v1/lux/auth/email/signup
Authorization: Bearer valid_token_here
Content-Type: application/json
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "",
  "birthdate": "string",
  "gender": "string",
  "phone": "string",
  "register_type": "string",
  "is_push_agree": true,
  "is_marketing_agree": true,
  "national_code": "string"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the signup is successful, it returns an `access_token` and `refresh_token`, similar to a login response.

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

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Email is not valid    |  Invalid email format|
| 401             | Token is invalid    |  Invalid auth token |
| 409              | Same email is already registered    |  Already registered email.|
| 500              | Failed to sign up user    |  Please contact server admin.|

```json
{
  "detail": "Email is not valid"
}
```
:::

### **Password Reset**

This API allows a user to reset their password using their email.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/send-reset-mail
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | Email address |

**Request Example**
```http
POST /api/v1/lux/auth/phone-number-validation
Content-Type: application/json
{
  "email": "string"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
{
  "statusCode": 200,
  "message": "User reset password email send successfully"
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | User signed up using a social account |  This email is signed up with social account|
| 404              | User ID not found    |  No account is associated with the provided email|
| 500              | Email send failed    |  Failed to send email|

```json
{
  "detail": "User id is not found"
}
```
:::

### **Account Recovery (Find Account)**

This API allows a user to retrieve their account ID (email) using their registered phone number and a [verification code](#verify-sms-verification-code) sent via SMS.


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/auth/find-id-by-phone
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | Phone number in E.164 format <br> - ex: +14155552671|
| `validnum` <Badge type="danger" text="required" />| string    |6-digit verification code received via SMS|

**Request Example**
```http
POST /api/v1/lux/auth/phone-number-validation
Content-Type: application/json
{
  "phone": "string",
  "validnum": "string"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
{
  "email": "your@email.com",
  "provider": "naver"
}
```

@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Validation code is expired    |  The provided code is expired|
| 400              | Validation code is invalid    |  The provided code is invalid|
| 403              | User previously deleted    |  Account has been deleted. |
| 404              | User id is not found    |  Can not find related account info|

```json
{
  "detail": "Validation code is expired"
}
```
:::

## **Common Error Handling**

These are error codes that are commonly returned by all endpoints.

**Error Response Example**

- `401 Unauthorized`: The token is invalid.
  ```json
  {
    "detail": "Could not validate credentials" // The token is invalid
  }
  ```
- `401 Unauthorized`: The token has expired.
  ```json
  {
    "detail": "Token is expired" // The token has expired.
  }
  ```
- `404 Not Found`: The resource cannot be found. Please check the URI again.
  ```json
  {
    "detail": "Resource not found"
  }
  ```
- `500 Internal Server Error`: This is a server error.
  ```json
  {
    "detail": "Internal server error. Please try again later."
  }
  ```