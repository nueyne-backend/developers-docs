# **Device**

This page describes the APIs related to authentication for the LUX project.

## **Introduction**

The LUX Device API provides functions to perform device-related tasks such as create device log, set-my-device, get-all-device and etc.

<!-- API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/lux-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요. -->

## **Authentication**

Some authentication APIs require an authentication token. Please include the authentication token in the `Authorization` header to make authenticated API requests.
```
Authorization: Bearer your_token_here
```
Replace `your_token_here` with the access token obtained during the authentication process.

## **Endpoints**

### **Get Single Device Information**

Retrieves information for a single device belonging to a user's child account.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/lux/device/child-device
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
GET /api/v1/lux/device/child-device?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 0,
  "real_user_id": 0,
  "project_id": 0,
  "hardware_id": 0,
  "now_firmware_id": 0,
  "unique_id": "string",
  "serial_code": "string",
  "device_alias": "string",
  "mac_id": "string",
  "created_at": "2024-11-28T02:15:53.610Z",
  "last_log_file_id": 0
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Device not found  | Device does not exist.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **Get All Child Accounts and Device Information**

Retrieves all child accounts and their associated device information for the current user. This should always be called first on the Home screen to obtain the real_user_id and device_id.
Note: The API name is not intuitive and is planned to be changed.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/lux/device/get-all-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|


**Request Example**

```http
GET /api/v1/lux/device/get-all-device HTTPS
Authorization: Bearer your_token_here
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

Returns data in an array format. An empty array is returned if there are no connected devices or child accounts. 
<br> last_log_file_id is the number of the last log file stored on the server. Compare this with the log file number from the device. If the device's log file number is greater than last_log_file_id, it means there are unsent logs on the device, and you should call the POST /devlog endpoint. If the numbers are the same, all logs have been successfully transmitted.

```json
[
  {
    "id": 0,
    "real_user_id": 0,
    "project_id": 0,
    "hardware_id": 0,
    "now_firmware_id": 0,
    "firmware_version": "1.0.0",
    "unique_id": "string",
    "serial_code": "string",
    "device_alias": "string",
    "mac_id": "string",
    "created_at": "2024-11-28T02:27:34.136Z",
    "last_log_file_id": 0,
    "root_user_id": 0,
    "first_name": "string",
    "last_name": "string",
    "birthdate": "string",
    "gender": "string"
  }
]
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.


| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | User is not authorized.|

```json
{
    "detail": "User is None"
}
```
:::

### **Register a Device**

Manually registers a device to a child account.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/device/set-my-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `serial_code` <Badge type="danger" text="required" />| string    |The serial code of the device.|
| `mac_id` <Badge type="danger" text="required" />| string    |The MAC address of the device.|
| `unique_id` <Badge type="danger" text="required" />| string    |The unique ID (UUID) of the device.|
| `real_user_id` <Badge type="danger" text="required" />| integer    | The ID of the child account.|

**Request Example**
```http
POST /api/v1/lux/device/set-my-device?serial_code=test1&mac_id=test1234&unique_id=test1234&real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statuscode": 200,
  "message": "device connected"
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Not Found Device  | Device does not exist.    |
| 409              | Already Connected Device  | The device is already connected to another user.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **Unregister a Device**

Unregisters a device from a child account.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/device/un-connect
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | The unique ID (UUID) of the device.|
| `real_user_id` <Badge type="danger" text="required" />| integer    |The ID of the child account.|

**Request Example**
```http
PATCH /api/v1/lux/device/un-connect?unique_id=test1&real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200,
  "message": "device unconnected"
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Not Found Device  | Device does not exist.    |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **Check Device Status**

This API verifies if a device can be connected or registered. It must be called before attempting to connect a device.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/lux/device/check-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | The unique ID (UUID) of the device.|

**Request Example**
```http
GET /api/v1/lux/device/check-device?unique_id=test1 HTTPS
Authorization: Bearer your_token_here
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 ok (Device Connectable)</span>

If the device is already registered to the user, you can proceed with the connection flow. The detail message will indicate "Connection Confirmed".

```json
{
  "detail": "Connection Confirmed",
  "device_data": {
    "id": 0,
    "real_user_id": 0,
    "project_id": 0,
    "hardware_id": 0,
    "now_firmware_id": 0,
    "unique_id": "string",
    "serial_code": "string",
    "device_alias": "string",
    "mac_id": "string",
    "created_at": "2024-11-28T04:19:43.007Z",
    "last_log_file_id": 0
  }
}
```
@tab <span class="ok-tab">200 ok (Device Registrable)</span>

If the device is available for registration, the detail message will indicate that it is registrable.

```json
{
  "detail": "Device Registerable",
  "device_data": {
    "id": 0,
    "real_user_id": 0,
    "project_id": 0,
    "hardware_id": 0,
    "now_firmware_id": 0,
    "unique_id": "string",
    "serial_code": "string",
    "device_alias": "string",
    "mac_id": "string",
    "created_at": "2024-11-28T04:19:43.007Z",
    "last_log_file_id": 0
  }
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Not Found Device  | Device does not exist.    |
| 409              | Already Connected Device  | The device is already connected to another user.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **Update Device Alias**

Updates the alias of a device.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/device/update-alias
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_id` <Badge type="danger" text="required" />| integer    | The ID of the device. |
| `real_user_id` <Badge type="danger" text="required" />| integer    |The ID of the child account.|
| `device_alias` <Badge type="danger" text="required" />| string    |The new alias for the device.|

**Request Example**
```http
PATCH /api/v1/lux/device/update-alias HTTPS
Authorization: Bearer your_token_here
{
  "device_id": 0,
  "real_user_id": 0,
  "device_alias": "string"
}
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 0,
  "real_user_id": 0,
  "project_id": 0,
  "hardware_id": 0,
  "now_firmware_id": 0,
  "unique_id": "string",
  "serial_code": "string",
  "device_alias": "string",
  "mac_id": "string",
  "created_at": "2024-11-28T04:32:07.540Z",
  "last_log_file_id": 0
}
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Not Found Device  | Device does not exist.    |
| 409              | Not Connected Device  | The device is already connected to another user.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **Upload Device Usage Log**
This is a unified API to meet new requirements. It has the following functions:
- Creates a temporary usage log by being called 30 seconds after device - usage starts.
- Updates the temporary usage log when the Bluetooth connection is lost - during use.
- Updates the temporary log to a complete log when device usage ends.
- Saves usage logs when there are logs to be sent from the device.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/device/devlog
</div>

**Headers**
| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**
| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `log_arrays` <Badge type="danger" text="required" />| array    | Container for log records.|
| ├ `real_user_id` <Badge type="danger" text="required" />| integer    |The ID of the child account.|
| ├ `device_id` <Badge type="danger" text="required" />| integer    | The ID of the device. |
| ├ `unique_id` <Badge type="danger" text="required" />| string    | The unique ID (UUID) of the device. |
| ├ `detail_data` <Badge type="danger" text="required" />| json    | Device usage log. |
| ├ `log_file_id` <Badge type="info" text="optional" />| integer    |Device usage log ID (refers to the shortlog file_id).|

<details>
<summary><strong>📌 detail_data Structure</strong></summary>

`detail_data` includes the following fields:

| Name | Type  | Description |
|------|-------|-------------|
| `treatment_date` <Badge type="danger" text="required" />| string | Start time of device usage (ISO 8601 format). |
| `finish_flag` <Badge type="info" text="optional" />| integer | Type of shutdown. See below for details.|
| `last_intensity`   <Badge type="danger" text="required" />| integer | Last used intensity. |
| `treatment_time`   <Badge type="danger" text="required" />| integer | Usage duration in seconds. |

::: tip finish_flag Value Descriptions

`finish_flag` indicates the following shutdown states:

| 값 | 의미 |
|----|------|
| 1  | Normal Shutdown (Treatment completed normally). |
| 2  |Button Shutdown (Device turned off by long-pressing the power button during treatment). |
| 3  | App Shutdown (Device turned off by a command from the app during treatment).|
| 4  | Faulty Contacts Shutdown (Device turned off due to poor electrode contact with the skin). |
| 5  | VBUS Shutdown (Treatment stopped because the device was connected to a charger). |
| 6  | Factory Shutdown (Shutdown for factory testing). |

:::

</details>

**Request Example**

**1. Upload Temporary Usage Log**

Sending `finish_flag` as null creates a temporary usage log. The `log_file_id` field can be omitted entirely.
For `treatment_date`, if the app sends the current time (formatted) 30 seconds after usage starts, the server will subtract 30 seconds before saving it.

```http
POST /api/v1/lux/device/devlog HTTPS
Authorization: Bearer your_token_here
{
    "log_arrays": [
        {
            "real_user_id": 1,
            "device_id": 2,
            "unique_id": "withnox_temp",
            "detail_data": {
                "treatment_date": "2025-02-21T15:48:49",
                "finish_flag": null,  
                "last_intensity": 2,
                "treatment_time": 255555
            }
        }
    ]
}
```

**2. Update Temporary Usage Log**

If a temporary usage log exists on the server, it will be updated with the data provided.

```http
POST /api/v1/lux/device/devlog HTTPS
Authorization: Bearer your_token_here
{
    "log_arrays": [
        {
            "real_user_id": 1,
            "device_id": 2,
            "unique_id": "withnox_temp",
            "detail_data": {
                "treatment_date": "2025-02-21T15:48:49",
                "finish_flag": null,
                "last_intensity": 2,
                "treatment_time": 255555
            }
        }
    ]
}
```
**3. Complete Temporary Usage Log**

Sending `finish_flag` and `log_file_id` completes the temporary usage log.

```http
POST /api/v1/lux/device/devlog HTTPS
Authorization: Bearer your_token_here
{
    "log_arrays": [
        {
            "real_user_id": 1,
            "device_id": 2,
            "unique_id": "withnox_temp",
            "detail_data": {
                "treatment_date": "2025-02-14T15:48:49",
                "finish_flag": 2,
                "last_intensity": 25,
                "treatment_time": 500000
            },
            "log_file_id": 1
        }
    ]
}
```
**4. Upload Usage Logs**

Multiple logs can be uploaded.

* If a temporary usage log exists on the server, the first record in the submitted array will overwrite the temporary log.

```http
POST /api/v1/lux/device/devlog HTTPS
Authorization: Bearer your_token_here
{
    "log_arrays": [
        {
            "real_user_id": 1,
            "device_id": 2,
            "unique_id": "withnox_temp",
            "detail_data": {
                "treatment_date": "2025-02-14T15:48:49",
                "finish_flag": 2,
                "last_intensity": 25,
                "treatment_time": 500000
            },
            "log_file_id": 1
        },
                {
            "real_user_id": 1,
            "device_id": 2,
            "unique_id": "withnox_temp",
            "detail_data": {
                "treatment_date": "2025-02-15T15:48:49",
                "finish_flag": 2,
                "last_intensity": 25,
                "treatment_time": 500000
            },
            "log_file_id": 2
        },
        // 등등
    ]
}
```

**Response Example**
::: tabs
@tab <span class="ok-tab">200 OK (Temporary Usage Log)</span>
The following response is returned when creating or updating a temporary usage log.

```json
{
    "statusCode": 200,
    "message": "Temp devlog saved successfully"
}
```

@tab <span class="ok-tab">200 OK (Usage Log Upload)</span>
The following response is returned when completing a temporary log or uploading complete logs.

```json
{
    "statusCode": 200,
    "message": "Devlog saved successfully"
}
```

@tab <span class="error-tab">ERROR</span>
**Error Response**
Provides API status codes and messages for each HTTP status code. Refer to the table below.
| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | User is not authorized.|
| 404              | Not Found Device  | Device does not exist.    |
| 404              | Not Found User  | Child account does not exist.     |
| 409              | Not Connected Device  | The device is already connected to another user.     |
| 409              | Update Device Log Failed or Create Device Log Failed | 서버 에러     |

```json
{
    "detail": "Not Found Device"
}
```
:::

### **Send Device Impedance Error Notification**

API to send a notification (Alimtalk) when an impedance error occurs on the device.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/device/alimtalk
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|


**Request Example**
```http
POST /api/v1/lux/device/alimtalk HTTPS
Authorization: Bearer your_token_here
```

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK</span>

If the notification is sent successfully, it returns 200 OK with no body.

```json
null
```
@tab <span class="error-tab">ERROR</span>

**Error Response**

Provides API status codes and messages for each HTTP status code. Refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 403              | Phone number is not found     | User's phone number cannot be found.|
| 409              | Alimtalk send failed  | Notification sending failed (contact server admin).  |
| 500              | Internal Server Error  | Contact server admin.     |

```json
{
    "detail": "Alimtalk send failed"
}
```
:::


## **Common Error Handling**

모든 엔드포인트에서 공통적으로 응답하는 에러코드입니다.

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