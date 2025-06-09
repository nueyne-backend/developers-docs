
# **User**

This page describes the APIs related to authentication for the LUX project.

## **Introduction**

The LUX User API provides functions to perform user-related tasks such as Get User information, user info update and etc.

<!-- API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/lux-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요. -->

## **Authentication**

Some authentication APIs require an authentication token. Please include the authentication token in the `Authorization` header to make authenticated API requests.
```
Authorization: Bearer your_token_here
```
Replace `your_token_here` with the access token obtained during the authentication process.

## **Endpoints**

### **Get User Information**

Retrieves the information of the logged-in user. The response indicates via boolean values whether it has been more than 3 months since the user last changed their password and whether a personal information update is required.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/lux/user/me
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Request Example**
```http
GET /api/v1/lux/user/me HTTPS
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
    "need_to_pwd_change": true,
    "is_device_muted": true,
    "is_device_alim_talk_enabled": true,
    "is_basestation_alert_enabled": true
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | No registered user information found.|
| 401              | User is Deleted  | The user has deleted their account.     |

```json
{
    "detail": "User is None"
}
```
:::



### **Update User Information**

Updates the information of the logged-in user.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/root-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|


**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `first_name` <Badge type="info" text="optional" />| string    | User's first name.|
| `last_name` <Badge type="info" text="optional" />              | User's last name.   |
| `birthdate` <Badge type="info" text="optional" />| string  | User's birthdate (yyyymmdd) <br> - Example : 19970101|
| `gender` <Badge type="info" text="optional" />              | string  | User's gender <br> - M : Male  <br> - F : Female  <br> - N :  Non-binary <br> - P : Prefer not to say |


**Request Example**
```http
PATCH /api/v1/lux/user/root-user HTTPS
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

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | User information not found.|
| 401              | User is Deleted  | User has been deleted.  |


```json
{
    "detail": "User is None"
}
```
:::

### **Update User Policy**

Updates the user's push notification and marketing notification settings.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/policy
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `is_push_agree` <Badge type="info" text="optional" />| boolean    |Consent to receive push notifications.|
| `is_marketing_agree` <Badge type="info" text="optional" />| boolean  | Consent to receive marketing communications.    |

**Request Example**
```http
PATCH /api/v1/lux/user/policy HTTPS
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

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User not found     | No registered user information found.|
| 404              | User policy not found  | No user policy has been created. |
| 409              | User policy update failed  | The user's push token does not exist. |

```json
{
    "detail": "User policy update failed"
}
```
:::

### **Set User Push Token**

Saves the FCM token to the server to send push notifications to the user.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/user/push/set-token
</div>

**Headers:**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters:**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `token` <Badge type="danger" text="required" />| string    |FCM Token.|

**Request Example:**
```http
POST /api/v1/lux/user/push/set-token HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json

{
  "token": string
}
```

**Response Example:**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
string
```

@tab <span class="error-tab"> ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Push permisson denied     | Push permission has not been granted in the user policy.|
| 409              | User push token update failed  | Please check the token format again.    |

```json
{
  "detail" : "User push token update failed"
}
```
:::


### **Create Child User Account and Register Device**

Creates a child account for the user and registers a device. The device registration process is combined for convenience of API calls.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/user/create-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `first_name` <Badge type="danger" text="required" />| string    |The full name of the child account to be created.|
| `last_name` <Badge type="danger" text="required" />| string  | ~~The full name of the child account to be created.~~  Please send an empty string.  |
| `birthdate` <Badge type="danger" text="required" />| string  |The birthdate of the child account to be created (yyyymmdd) <br> - Example : 19970101|
| `gender` <Badge type="danger" text="required" />| string  | ring	The gender of the user. <br> - M : Male  <br> - F : Female  <br> - N :  Non-binary <br> - P : Prefer not to say |
| `serial_code` <Badge type="danger" text="required" />| string  | The serial code of the device to register.  |
| `mac_id` <Badge type="danger" text="required" />| string  |The MAC address of the device to register (send the last 4 characters in uppercase, excluding the colon).  |
| `unique_id` <Badge type="danger" text="required" />| string  | The UUID of the device to register.  |



**Request Example:**
```http
POST /api/v1/lux/user/create-real-user HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "first_name": "test",
  "last_name": "",
  "birthdate": "19970101",
  "gender": "F",
  "serial_code": "SL20401000",
  "mac_id": "41AD",
  "unique_id": "unique"
}
```

**Response Example:**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "real_user_id": 1,
  "first_name": "test",
  "last_name": "",
  "birthdate": "19970101",
  "gender": "F",
  "device_id": 1,
  "now_firmware_id": 1,
  "unique_id": "unique",
  "serial_code": "SL20401000",
  "device_alias": "string",
  "last_log_file_id": 0,
  "created_at": "2024-10-28T08:09:47.889Z"
}
```
@tab <span class="error-tab"> ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 409              | Real user create failed| Failed to create child account.|
| 400              | Serial code is not valid| The serial code is invalid.|
| 401              | Not authorized user  | User is not authorized.    |
| 404              | Not Found Device  | The specified device could not be found.     |
| 409              | Already Connected Device  | The device is already connected to another user. |

```json
{
    "detail": "Already Connected Device"
}
```
:::


### **Get Child User Account**

Retrieves the information of a user's child account. The `real_user_id` can be obtained from the `/api/v1/lux/device/get-all-device` endpoint.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/lux/user/real-user/{real_user_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | The ID of the child account.|


**Request Example**
```http
GET https://app.nueyne.dev/api/v1/lux/user/real-user/1 HTTPS
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

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Real user is not found  | Child account information not found. |

```json
{
    "detail": "Real user is not found"
}
```
:::

### **Update Child User Information**

Updates the information of a user's child account.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/update-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `id` <Badge type="danger" text="required" />| integer    | The `real_user_id` of the child account to update.|
| `first_name` <Badge type="info" text="optional" />| string  | The new first name for the child account.     |
| `last_name` <Badge type="info" text="optional" />| string  | The new last name for the child account.     |
| `birthdate` <Badge type="info" text="optional" />| string  | The new birthdate for the child account (yyyymmdd) <br> - Example : 19970101|
| `gender` <Badge type="info" text="optional" />| string  | The new gender for the child account. <br> - M : Male <br> - F : Female <br> - N : Non-binary <br> - P : Prefer not to say |


**Request Example**
```http
PATCH https://app.nueyne.dev/api/v1/lux/user/real-user/1 HTTPS
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

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized. |
| 404              | Real user is not found  | Child account information not found.    |

```json
{
    "detail": "User is None"
}
```
:::


### **Update User Phone Number**

Updates the user's phone number. Flow: Call SMS sending API -> Call this API.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/user/change-phone
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | The new phone number to change to.|
| `validnum` <Badge type="info" text="optional" />| string  | The verification code received via SMS.   |

**Request Example**
```http
POST https://app.nueyne.dev/api/v1/lux/user/change-phone HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "phone": "+821012345678",
  "validnum": "123456"
}
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200,
  "message": "Root user phone updated"
}
```
@tab <span class="error-tab"> ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Validation code is expired     | Verification code has expired.|
| 400              | Validation code is invalid  | Verification code does not match.     |
| 403              | User previously deleted  | The user has previously deleted their account.     |
| 409              | Phone number is already registered  | The phone number is already in use.  |

```json
{
    "detail": "Validation code is expired"
}
```
:::

### **Update User Notification Settings**

Updates the user's notification settings. The default value for all notifications is false.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/notification
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `is_device_muted` <Badge type="danger" text="required" />| boolean    | Enable mute mode for the WithNox device. |
| `is_device_alim_talk_enabled` <Badge type="danger" text="required" />| boolean  | Enable KakaoTalk notifications for WithNox device electrode contact.     |
| `is_basestation_alert_enabled` <Badge type="danger" text="required" />| boolean  | Enable notifications for the base station sensor.     |



**Request Example**
```http
PATCH https://app.nueyne.dev/api/v1/lux/user/notification HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
    "is_device_muted": 1,
    "is_device_alim_talk_enabled": 1,
    "is_basestation_alert_enabled": 1
}
```

**Response Example**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "is_device_muted": 1,
    "is_device_alim_talk_enabled": 1,
    "is_basestation_alert_enabled": 1
}
```
@tab <span class="error-tab"> ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User not found    | User information not found.|
| 409              | User notification update failed  | User notification update failed (contact server admin).    |

```json
{
    "detail": "User not found"
}
```
:::

### **Delete Child User Account and Unregister Device**

Deletes a user's child account and unregisters the associated device.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/lux/user/delete-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer| The ID of the child account to delete.|
| `unique_id` <Badge type="danger" text="required" />| string| The unique_id of the device to unregister.|

**Request Example**
```http
DELETE /api/v1/lux/user/delete-real-user HTTPS
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

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Real user is not found  | Child account information not found.|
| 409              | Real user delete failed  | Failed to delete child account.|

```json
{
    "detail": "Real user is not found"
}
```
:::

### **Delete Account**

Used when a user wants to withdraw or delete their account.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/lux/user/root-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Request Example**
```http
DELETE /api/v1/lux/user/root-user HTTPS
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

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Sign in type is not found| The user's sign-up method (email, social) could not be found.|


```json
{
    "detail": "Sign in type is not found"
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