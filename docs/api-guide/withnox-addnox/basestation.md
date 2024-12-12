# **베이스 스테이션**

해당 페이지는 Withnox & Addnox 프로젝트의 베이스 스테이션과 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Withnox & Addnox 베이스 스테이션 API는 기기 연결, 센서 데이터 불러오기 등 베이스 스테이션과 관련된 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요.

## **인증**

모든 베이스 스테이션 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **모든 베이스 스테이션 정보 가져오기**

계정에 연결되어 있는 모든 베이스 스테이션의 정보를 배열 형태로 가져옵니다. 연결된 베이스 스테이션이 없을 경우 빈 배열이 리턴됩니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/basestation/list
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**요청 예시**
```http
GET /api/v1/addnox/basestation/list HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
[
  {
    "id": 0,
    "root_user_id": 0,
    "unique_id": "string",
    "serial_code": "string",
    "device_alias": "string",
    "mac_id": "string",
    "project_id": 0,
    "hardware_id": 0,
    "now_firmware_id": 0,
    "created_at": "2024-11-29T07:20:53.639Z"
  }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal server error     | 서버 에러.|

```json
{
    "detail": "Internal server error"
}
```
:::
### **베이스 스테이션 등록 확인**

베이스 스테이션이 성공적으로 등록이 되었는지 확인하는 API입니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/basestation/check-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_uuid` <Badge type="danger" text="required" />| string    | 베이스 스테이션의 uuid 입니다.|

**요청 예시**
```http
GET /api/v1/addnox/basestation/check-device?device_uuid=1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
True
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Not Found Device     | 서버 에러|
| 409              | Already Connected Device     | 이미 다른 사용자에게 연결되어있습니다|
| 400              | Check Device Failed     | 등록 실패 |


```json
{
    "detail": "Already Connected Device"
}
```
:::

### **베이스 스테이션 별칭 업데이트**

특정 베이스 스테이션의 별칭을 변경합니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/addnox/basestation/{basestation_id}/alias
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `basestation_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션의 id 입니다.|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_alias` <Badge type="danger" text="required" />| integer    | 베이스 스테이션의 별칭 입니다.|


**요청 예시**
```http
PATCH /api/v1/addnox/basestation/1/alias HTTPS
Authorization: Bearer your_token_here
{
  "device_alias": "alias_test"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "id": 1,
    "root_user_id": 4,
    "unique_id": "400023001950304B57303420",
    "serial_code": "test_base1",
    "device_alias": "alias_test",
    "mac_id": null,
    "project_id": 3,
    "hardware_id": 3,
    "now_firmware_id": 5,
    "created_at": "2024-09-02T07:55:48"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device not found     | 베이스 스테이션을 찾을 수 없습니다.|
| 403              | This device does not belong to the user     | 해당 베이스 스테이션은 계정에 등록되어 있지 않습니다.|


```json
{
    "detail": "Device not found"
}
```
:::

### **베이스 스테이션 등록 해제**

계정에 등록된 특정 베이스 스테이션의 등록을 해제합니다.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/addnox/basestation/{basestation_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `basestation_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션의 id 입니다.|

**요청 예시**
```http
DELETE /api/v1/addnox/basestation/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "message": "Device disconnected"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device not found     | 베이스 스테이션을 찾을 수 없습니다.|
| 403              | This device does not belong to the user     | 해당 베이스 스테이션은 계정에 등록되어 있지 않습니다.|


```json
{
    "detail": "Device not found"
}
```
:::

### **베이스 스테이션 센서 데이터 불러오기**

특정 베이스 스테이션의 가장 최근 센서 데이터 1개를 불러옵니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/basestation/latest-data/{basestation_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `basestation_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션의 id 입니다.|

**요청 예시**
```http
GET /api/v1/addnox/basestation/latest-data/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "device_uuid": "string",
  "user_id": 0,
  "humidity": 0,
  "light": 0,
  "noise": 0,
  "temperature": 0,
  "timestamp": 0
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device not found     | 베이스 스테이션을 찾을 수 없습니다.|
| 403              | This device does not belong to the user     | 해당 베이스 스테이션은 계정에 등록되어 있지 않습니다.|
| 400              | Get sensor data failed     | 센서 데이터를 가져오는데 실패했습니다.|


```json
{
    "detail": "Device not found"
}
```
:::

### **베이스 스테이션 센서 알람 정책 가져오기**

베이스 스테이션의 센서 알람 정책을 가져옵니다. 정책이 없다면 []로 리턴합니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/basestation/threshold/{basestation_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `basestation_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션의 id 입니다.|

**요청 예시**
```http
GET /api/v1/addnox/basestation/threshold/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
[
    {
        "id": 2,
        "root_user_id": 4,
        "basestation_id": 4,
        "mv_high": 30,
        "hum_low": 32,
        "hum_high": 40,
        "light_high": 30,
        "temp_low": 10,
        "temp_high": 90,
        "noise_high": 15,
        "created_at": "2024-11-19T11:26:44",
        "updated_at": "2024-11-19T11:27:32"
    }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device not found     | 베이스 스테이션을 찾을 수 없습니다.|
| 403              | This device does not belong to the user     | 해당 베이스 스테이션은 계정에 등록되어 있지 않습니다.|


```json
{
    "detail": "Device not found"
}
```
:::

### **베이스 스테이션 센서 알람 정책 설정하기**

베이스 스테이션의 센서 알람 정책을 설정합니다. 베이스 스테이션은 한 개의 정책만 가질 수 있습니다.
이미 정책을 가지고 있는 베이스 스테이션의 정책을 설정할 경우 가장 마지막 정책으로 덮어씌워집니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/basestation/set-threshold
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `basestation_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션의 id 입니다.|
| `mv_high` <Badge type="info" text="optional" />| integer    | 베이스 스테이션의 id 입니다.|
| `hum_low` <Badge type="info" text="optional" />| integer    | 베이스 스테이션의 id 입니다.|
| `hum_high` <Badge type="info" text="optional" />| integer    | 베이스 스테이션의 id 입니다.|
| `temp_low` <Badge type="info" text="optional" />| integer    | 베이스 스테이션의 id 입니다.|
| `temp_high` <Badge type="info" text="optional" />| integer    | 베이스 스테이션의 id 입니다.|
| `noise_high` <Badge type="info" text="optional" />| integer    | 베이스 스테이션의 id 입니다.|

**요청 예시**
```http
GET /api/v1/addnox/basestation/threshold/1 HTTPS
Authorization: Bearer your_token_here
{
  "basestation_id": 0,
  "mv_high": 0,
  "hum_low": 0,
  "hum_high": 0,
  "light_high": 0,
  "temp_low": 0,
  "temp_high": 0,
  "noise_high": 0
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
[
    {
        "id": 2,
        "root_user_id": 4,
        "basestation_id": 4,
        "mv_high": 30,
        "hum_low": 32,
        "hum_high": 40,
        "light_high": 30,
        "temp_low": 10,
        "temp_high": 90,
        "noise_high": 15,
        "created_at": "2024-11-19T11:26:44",
        "updated_at": "2024-11-19T11:27:32"
    }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device not found     | 베이스 스테이션을 찾을 수 없습니다.|
| 403              | This device does not belong to the user     | 해당 베이스 스테이션은 계정에 등록되어 있지 않습니다.|


```json
{
    "detail": "Device not found"
}
```
:::

### **베이스 스테이션 센서 알람 정책 삭제하기**

베이스 스테이션의 센서 알람 정책을 삭제합니다.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/addnox/basestation/threshold/delete/{threshold_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `threshold_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션 정책 id 입니다.|


**요청 예시**
```http
DELETE /api/v1/addnox/basestation/threshold/delete/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "message": "Threshold deleted"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Threshold not found     | 베이스 스테이션 정책을 찾을 수 없습니다.|
| 403              | This threshold does not belong to the user     | 해당 베이스 스테이션 정책은 다른 계정 소유입니다.|


```json
{
    "detail": "Threshold not found"
}
```
:::

### **베이스 스테이션 밝기 설정하기**

베이스 스테이션의 조명 밝기를 설정합니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/addnox/basestation/threshold/{basestation_id}/light
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `basestation_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션 정책 id 입니다.|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `brightness` <Badge type="danger" text="required" />| integer    | 설정할 베이스 스테이션의 밝기 값입니다.|

::: tip brightness 값 설명

`brightness`는 다음과 같은 값을 지원합니다:

| 값 | 의미 |
|----|------|
| 100  | Brightness 100% (밝기 최대 상태) |
| 75  | Brightness 100% (밝기 75% 상태) |
| 50  | Brightness 100% (밝기 50% 상태) |
| 25  | Brightness 100% (밝기 25% 상태) |
| 0  | Brightness OFF (밝기 꺼짐 상태) |
| 1  | Brightness AUTO (밝기 자동 조절 상태) |

:::

**요청 예시**
```http
PATCH /api/v1/addnox/basestation/threshold/1/light HTTPS
Authorization: Bearer your_token_here
{
  "brightness": "1"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "message": "Command sent"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device not found     | 베이스 스테이션을 찾을 수 없습니다.|
| 403              | This device does not belong to the user     | 해당 베이스 스테이션은 계정에 등록되어 있지 않습니다.|


```json
{
    "detail": "Device not found"
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