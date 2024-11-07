# **Authentication**

This page describes the authentication APIs for the Withnox & Addnox projects.

## **Introduction**

The Withnox & Addnox Authentication API provides functionalities for user registration, social registration, login, and SMS number verification.

If you need some imagination of API Flow please checkout the [Figma API Flow!](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0)

## **Authentication**

Some authentication APIs require an authentication token. Please include the authentication token in the `Authorization` header to make authenticated API requests.
```
Authorization: Bearer your_token_here
```
Replace `your_token_here` with the access token obtained during the authentication process.

## **Endpoints**

### **Check Registration Status**

This API checks if a user is registered with the given email.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/auth/sign-in/check/{email}
</div>

**Parameters:**

| Name            | Type   | Description       |
|-----------------|--------|-------------------|
| `email` <Badge type="danger" text="required" /> | string | Email value |

**Request Example**
```http
GET /api/v1/addnox/auth/sign-in/check/test@gmail.com
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the user is already registered, a 200 OK response is returned, indicating that the user can proceed to login.

```json
{
  "message": "User already signed up please login"
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on HTTP status codes. Refer to the table below.


| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User not found     | No registered user found for this email.|

```json
{
    "detail": "User not found"
}
```
:::

### **Pre-Signup**

This API pre-registers a user with the provided email and password.

**Endpoint**

**POST** `/api/v1/addnox/auth/email/pre-signup`

**Body Parameters**

| Name       | Type   | Description          |
|------------|--------|----------------------|
| `email`    | string | **Required**. Email value. |
| `password` | string | **Required**. Password value. |

**Request Example**
```http
POST /api/v1/addnox/auth/email/pre-signup
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```


**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the pre-signup is successful, it returns a pre-generated email_user_id. Save this value for use in the signup API.

```json
{
  "email_user_id": 0,
  "email": "string"
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 409              |  Same email already registered     |  Email already registered|

```json
{
    "detail": "Same email already registered"
}
```
:::

### **Login**

This API allows a user to log in with the provided email and password.

**Endpoint**

**POST** `/api/v1/addnox/auth/email/signin`

**Body Parameters**

| Name       | Type   | Description                |
|------------|--------|----------------------------|
| `username` | string | **Required**. Email value. |
| `password` | string | **Required**. Password value. |

**Request Example**
```http
POST /api/v1/addnox/auth/email/signin
Content-Type: application/x-www-form-urlencoded

{
  "username": "string",
  "password": "string"
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

```json
{
    "detail": "Password is invalid"
}
```
:::

### **Email ID Lookup**

This API retrieves the user ID associated with the provided email address.
When [Login](#login) returns 401 ERROR that user signup is not complete, you need to call this API
to retreives `email_user_id` for signup API.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/email/get-id/{email}
</div>

**Parameters:**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    | Email address to look up|

**Request Example**
```http
POST /api/v1/addnox/auth/email/get-id/test@gmail.com
```


**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
{
  "email_user_id": 0
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Failed to get user id     |  No such user that has presigned up with this email|

```json
{
  "detail": "Failed to get user id"
}
```
:::

### **Send SMS Verification Message**

This API sends an SMS verification message to the provided phone number.
It is used not only for signup but also to help users retrieve lost accounts.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/send-sms-auth
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | Phone number to send the verification message(E.164 format) <br> - ex: +14155552671|

**Request Example**
```http
POST /api/v1/addnox/auth/send-sms-auth
Content-Type: application/json
{
  "phone": "string"
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
  /api/v1/addnox/auth/phone-number-validation
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | Phone number to send the verification message(E.164 format) <br> - ex: +14155552671|
| `validnum` <Badge type="danger" text="required" />| string    | 6-digit verification code received via SMS|

**Request Example**
```http
POST /api/v1/addnox/auth/phone-number-validation
Content-Type: application/json
{
  "phone": "string",
  "validnum": "string"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the SMS verification code is successfully verified, it returns `valid_token`.
When calling the [signup](#email-signup) and [social signup](#email-signup), include the `valid_token` in the Authorization header.

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
| 400              | Validation code is expired    |The code has expired. Please request a new one  |
| 400              | Validation code is invalid    |  The code provided is invalid|
```json
{
  "detail": "Validation code is expired"
}
```
:::

### **Email Signup**

This API allows a user to complete the signup process with an email and password. 
Include the `access_token` in the Authorization header for authentication.
`email_user_id` value can obtained from [pre-signup](#pre-signup) or [get-id](#email-id-lookup).

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
| `email` <Badge type="danger" text="required" />| string    | Email address |
| `email_user_id` <Badge type="danger" text="required" />| integer    | pre-sign up user's id|
| `first_name` <Badge type="danger" text="required" />| string    | User's first name|
| `last_name` <Badge type="danger" text="required" />| string    | User's last name|
| `birthdate` <Badge type="danger" text="required" />| string    | User's birthdate in the format(yyyymmdd) <br> - ex : 19970101|
| `gender` <Badge type="danger" text="required" />| string    | User's gender <br> - M : Male <br> - F : Femal <br> - N : Non-Binary <br> - P : Prefer Not to Say|
| `phone` <Badge type="danger" text="required" />| string    | Phone number in E.164 format <br> - ex: +14155552671|
| `register_type` <Badge type="danger" text="required" />| string    | Registration type <br> - E : Email <br> - S : Social|
| `is_push_agree` <Badge type="danger" text="required" />| boolean    | Whether the user agrees to receive push notifications |
| `is_marketing_agree` <Badge type="danger" text="required" />| boolean    | Whether the user agrees to receive marketing communications|
| `national_code` <Badge type="danger" text="required" />| string    | Country code <br> - WITHNOX : KR <br> - ADDNOX : ISO code (2)

**Request Example**
```http
POST /api/v1/addnox/auth/email/signup
Authorization: Bearer valid_token_here
Content-Type: application/json
{
  "email": "string",
  "email_user_id": 0,
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

**Response Example**
::: tabs

@tab <span class="ok-tab">201 Created</span>

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
| 401             | Not authenticated    |  valid_token is missing or invalid.|
| 404              | User not found    |  No presigned up user found|
| 500              | Failed to sign up user    |  Some required fields are missing or incorrectly formatted.|

```json
{
  "detail": "User not found"
}
```
:::

### **Password Reset**

This API allows a user to reset their password using their email.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/send-reset-mail
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `email` <Badge type="danger" text="required" />| string    |  Email address |

**Request Example**
```http
POST /api/v1/addnox/auth/phone-number-validation
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
| 404              | User id is not found    |  No account is associated with the provided email|
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
  /api/v1/addnox/auth/find-id-by-phone
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | Phone number in E.164 format <br> - ex: +14155552671|
| `validnum` <Badge type="danger" text="required" />| string    | 6-digit verification code received via SMS|

**Request Example**
```http
POST /api/v1/addnox/auth/phone-number-validation
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
  "email": "your@email.com"
}
```

@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages based on the HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Validation code is expired    |  The provided code is expired|
| 400              | Validation code is invalid    |  The provided code is invalid|

```json
{
  "detail": "Validation code is expired"
}
```
:::

### **Social Login**

This API enables social login with a specified social provider. 
You need to pass the provider as a parameter, and only one of the two token parameters is required depending on the provider.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/auth/social-signin/{provider}
</div>

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `provider` <Badge type="danger" text="required" />| string    | Social provider <br> - apple <br> - google <br> - facebook <br> - naver <br> - kakao|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `id_token` <Badge type="info" text="optional" />| string    | It is essential if provider is `google`, `apple`, `naver`, `kakao`.|
| `access_token` <Badge type="info" text="optional" />| string    | It is essential if provider is `facebook`.|

**Request Example**
```http
POST /api/v1/addnox/auth/social-signin/google
Content-Type: application/json
{
  "id_token": "string",
  "access_token": "string"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the social login is successful, the API returns an `access_token` and `refresh_token`.

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
| 403              | User is not valid, please sign up    |  User has not completed social sign-up. Redirect to social sign-up|
| 400              | User is signed up with email type   |  User has sign up with email type|
| 404              | User is signed up with {social_type} type   |  User has sign up with other social provider|
| 409              | Invalid {provider} access token   |  The provided token is invalid or expired.|

```json
{
  "detail": "User is not valid, please sign up"
}
```
:::

### **Social Sign-Up**

This API allows a user to complete social sign-up using their social account information. 
Similar to the standard [email sign-up](#email-signup), an [SMS-verified](#verify-sms-verification-code) `valid_token` is required for verification.

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
| `email` <Badge type="danger" text="required" />| string    | Email address. |
| `first_name` <Badge type="danger" text="required" />| string    | User's first name|
| `last_name` <Badge type="danger" text="required" />| string    | User's last name|
| `birthdate` <Badge type="danger" text="required" />| string    | User's birthdate in the format(yyyymmdd) <br> - ex : 19970101|
| `gender` <Badge type="danger" text="required" />| string    | User's gender <br> - M : Male <br> - F : Femal <br> - N : Non-Binary <br> - P : Prefer Not to Say|
| `phone` <Badge type="danger" text="required" />| string    | Phone number in E.164 format <br> - ex: +14155552671|
| `register_type` <Badge type="danger" text="required" />| string    | Registration type <br> - E : Email <br> - S : Social|
| `social_id` <Badge type="danger" text="required" />| string    | Please send social_token refer to provider  <br> - id_token : If provider is google, apple, naver, kakao <br> - access_token : If provider is facebook |
| `social_type` <Badge type="danger" text="required" />| string    | Social provider value <br> - google <br> - apple  <br> - facebook <br> - naver  <br> - kakao |
| `is_push_agree` <Badge type="danger" text="required" />| boolean    | Whether the user agrees to receive push notifications |
| `is_marketing_agree` <Badge type="danger" text="required" />| boolean    | Whether the user agrees to receive marketing communications|
| `national_code` <Badge type="danger" text="required" />| string    | Country code <br> - WITHNOX : KR <br> - ADDNOX : ISO code (2)

**Request Example**
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

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the social sign-up is successful, it returns an `access_token` and `refresh_token`, similar to a login response.

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
| 401              | Not authenticated    |  The valid_token is invalid or expired|


```json
{
  "detail": "Not authenticated"
}
```
:::