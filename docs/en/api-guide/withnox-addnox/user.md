# **User**

This page provides an overview of the APIs related to users in the Withnox & Addnox projects.

## **Introduction**

The Withnox & Addnox User APIs allow for operations related to user accounts, such as retrieving and updating user information. We recommend reviewing the authentication section before making API calls.

## **Authentication**

All User APIs require an authentication token. Please include the token in the `Authorization` header to authenticate the API calls.

```
Authorization: Bearer your_token_here
```
Replace `your_token_here` with the access_token obtained during the authentication process.

## **Endpoints**

### **Retrieve User Information**

Fetches information about the logged-in user. The response includes Boolean values indicating whether a password update is required if more than three months have passed since the last password change, and whether personal information needs to be updated.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/user/me
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Request Example**
```http
GET /api/v1/addnox/user/me HTTPS
Authorization: Bearer your_token_here
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "root_user_id": 1,
    "first_name": "test",
    "last_name": "kim",
    "birthdate": "20240722",
    "gender": "M",
    "phone": "+821012345678",
    "is_phone_number_checked": true,
    "register_type": "E",
    "national_code": "KR",
    "need_personal_info_update": false,
    "need_to_pwd_change": true
}
```
@tab <span class="error-tab">ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | No user information found|
| 401              | User is Deleted  | User has been deleted|

```json
{
    "detail": "User is None"
}
```
:::



### **Update User Information**

Updates information for the logged-in user.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/addnox/user/root-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|


**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `first_name` <Badge type="info" text="optional" />| string    | User’s first name (excluding surname)|
| `last_name` <Badge type="info" text="optional" />              | string  | User’s surname     |
| `birthdate` <Badge type="info" text="optional" />| string  | User’s birthdate (yyyymmdd) <br> - ex : 19970101|
| `gender` <Badge type="info" text="optional" />              | string  | User’s gender <br> - M : Male <br> - F : Female <br> - N : Non Binary <br> - P : Prefer Not to Say |


**Request Example**
```http
PATCH /api/v1/addnox/user/root-user HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json

{
  "first_name": "james",
  "last_name": "kim",
  "birthdate": "19970101",
  "gender": "M"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 1,
  "first_name": "james",
  "last_name": "kim",
  "birthdate": "19970101",
  "gender": "M",
  "phone": "+821012345678",
  "is_phone_number_checked": true,
  "register_type": "E"
}
```
@tab <span class="error-tab">ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | No user information found|
| 401              | User is Deleted  | User has been deleted   |

```json
{
    "detail": "Real user not found"
}
```
:::

### **Update User Push and Marketing Notifications**

Updates the user's preferences for push and marketing notifications.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/addnox/user/policy
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `is_push_agree` <Badge type="info" text="optional" />| boolean    | User's consent for push notifications|
| `is_marketing_agree` <Badge type="info" text="optional" />| boolean  | User's consent for marketing communications     |

**Request Example**
```http
PATCH /api/v1/addnox/user/policy HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json

{
  "is_push_agree": true,
  "is_marketing_agree": true
}
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "is_push_agree": true,
  "is_marketing_agree": true,
  "push_agree_date": "2024-10-28T07:47:53.563Z",
  "marketing_agree_date": "2024-10-28T07:47:53.563Z"   
}
```
@tab <span class="error-tab"> ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User not found     | No user information found|
| 404              | User policy not found  | No user policy found.     |

```json
{
    "detail": "User policy not found"
}
```
:::

### **Set User Push Token**

Stores the user's FCM token on the server to enable push notifications.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/user/push/set-token
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `token` <Badge type="danger" text="required" />| string    | FCM token for push notifications|

**Request Example**
```http
POST /api/v1/addnox/user/push/set-token HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json

{
  "token": string
}
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
string
```

@tab <span class="error-tab"> ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Push permisson denied     | User disagreed the push permisson|
| 409              | User push token update failed  | invalid token type|

```json
{
    "detail": "Push permisson denied"
}
```
:::


### **Delete User Account**

Deletes the user account, deactivating the user's profile.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/addnox/user/root-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Request Example**
```http
DELETE /api/v1/addnox/user/root-user HTTPS
Authorization: Bearer your_token_here
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200, 
  "message": "Root user deleted"
}
```

@tab <span class="error-tab"> ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Sign in type is not found| Could not find the user type (email, social)|


```json
{
    "detail": "Sign in type is not found"
}
```
:::


### **Create User Child Account and Register Device**

Creates a child (sub-user) account and registers a device under this account. This endpoint combines the account creation and device registration processes for convenience.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/user/create-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `first_name` <Badge type="danger" text="required" />| string    | First name of the child account|
| `last_name` <Badge type="danger" text="required" />| string  |Last name of the child account|
| `birthdate` <Badge type="danger" text="required" />| string  | Birthdate of the child account (yyyymmdd) <br> - ex : 19970101|
| `gender` <Badge type="danger" text="required" />| string  | Gender of the child account <br> - M : Male <br> - F : Female <br> - N : Non Binary <br> - P : Prefer Not to Say |
| `serial_code` <Badge type="danger" text="required" />| string  | Serial code of the device to be registered   |
| `mac_id` <Badge type="danger" text="required" />| string  | MAC address of the device to be registered    |


**Request Example**
```http
POST /api/v1/addnox/user/create-real-user HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "first_name": "test",
  "last_name": "kim",
  "birthdate": "19970101",
  "gender": "F",
  "serial_code": "SL20401000",
  "mac_id": "00:80:E1:27:4C:84"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "real_user_id": 1,
  "first_name": "test",
  "last_name": "kim",
  "birthdate": "19970101",
  "gender": "F",
  "device_id": 1,
  "now_firmware_id": 1,
  "unique_id": "string",
  "serial_code": "SL20401000",
  "device_alias": "string",
  "mac_id": "00:80:E1:27:4C:84",
  "last_log_file_id": 0,
  "created_at": "2024-10-28T08:09:47.889Z"
}
```
@tab <span class="error-tab"> ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 409              | Real user create failed| Real user creation failed|
| 401              | Not authorized user  | No authorization to delete|
| 404              | Not Found Device  | Could not find the device|
| 409              | Already Connected Device  | Device already connected to other user|

```json
{
    "detail": "Already Connected Device"
}
```
:::



### **Retrieve User Child Account Information**

Fetches information about a child (sub-user) account associated with the user. The `real_user_id` value can be obtained via `/api/v1/addnox/device/get-all-device`.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/user/real-user/{real_user_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | ID of the child account to retrieve |


**Request Example**
```http
GET https://app.nueyne.dev/api/v1/addnox/user/real-user/1 HTTPS
Authorization: Bearer your_token_here
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 0,
  "root_user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "birthdate": "string",
  "gender": "string"
}
```
@tab <span class="error-tab"> ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | No authorization|
| 404              | Real user is not found  | Could not find the real user|

```json
{
    "detail": "User is None"
}
```
:::

### **Update User Child Account Information**

Updates the information of a child (sub-user) account associated with the user.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/addnox/user/update-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `id` <Badge type="danger" text="required" />| integer    | `real_user_id` of the child account to update|
| `first_name` <Badge type="info" text="optional" />| string  | First name of the child account     |
| `last_name` <Badge type="info" text="optional" />| string  | Last name of the child account   |
| `birthdate` <Badge type="info" text="optional" />| string  | Birthdate of the child account (yyyymmdd) <br> - ex : 19970101|
| `gender` <Badge type="info" text="optional" />| string  | Gender of the child account <br> - M : Male <br> - F : Female <br> - N : Non Binary <br> - P : Prefer Not to Say |


**Request Example**
```http
GET https://app.nueyne.dev/api/v1/addnox/user/real-user/1 HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "id": 1,
  "first_name": "tester",
  "last_name": "john",
  "birthdate": "20010608",
  "gender": "P"
}
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 1,
  "root_user_id": 1,
  "first_name": "tester",
  "last_name": "john",
  "birthdate": "20010608",
  "gender": "P"
}
```
@tab <span class="error-tab"> ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | No authorization|
| 404              | Real user is not found  | Could not find the real user|

```json
{
    "detail": "Not authorized user"
}
```
:::

### **Delete User Child Account and Unregister Device**

Deletes a child (sub-user) account and unregisters the associated device.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/addnox/user/delete-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer| ID of the child account to delete |
| `unique_id` <Badge type="danger" text="required" />| string| Unique ID of the device to unregister|

**Request Example**
```http
DELETE /api/v1/addnox/user/delete-real-user HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "real_user_id": 1,
  "unique_id": "string",
}
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200,
  "message": "Real user deleted successfully",
}
```

@tab <span class="error-tab"> ERROR</span>

**Error Responses**

Refer to the table below for the API status codes and messages associated with each HTTP status code.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | No authorization|
| 404              | Real user is not found  | Could not find the real user|
| 409              | Real user delete failed  | Real user delete failed|


```json
{
    "detail": "Real user is not found"
}
```
:::


## **Common Error Handling**

The following error codes apply across all endpoints.

**Error Response Example**
- `400 Bad Request`: The request is invalid or missing required parameters.
  ```json
  {
    "detail": "Invalid request or missing parameters"
  }
  ```
- `401 Unauthorized`: Authentication failed or the token is invalid.
  ```json
  {
    "detail": "Could not validate credentials" // Token is incorrect or expired
  }
  ```
- `404 Not Found`: The specified resource could not be found.
  ```json
  {
    "detail": "Resource not found"
  }
  ```
- `500 Internal Server Error`: An error occurred on the server.
  ```json
  {
    "detail": "Internal server error. Please try again later."
  }
  ```
