# **기기**

해당 페이지는 Withnox & Addnox 프로젝트의 치료기기와 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Withnox & Addnox 기기 API는 사용 기록 저장, 기기 등록 등 치료기기와 관련된 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요.

## **인증**

모든 기기 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **단일 기기 정보 가져오기**

유저 자식 계정의 단일 기기 정보를 가져옵니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/device/child-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|

**요청 예시**
```http
GET /api/v1/addnox/device/child-device?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
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

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Device not found  | 기기가 존재하지 않습니다.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **모든 자식 계정 및 기기 정보 가져오기**

유저 계정의 자식 계정과 기기 정보를 모두 가져옵니다. Home 화면에서 항상 먼저 불러서 real_user_id와 device_id를 얻을 수 있습니다.
API 이름이 직관적이지 않아 변경할 계획입니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/device/get-all-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|


**요청 예시**
```http
GET /api/v1/addnox/device/get-all-device HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

배열 형태로 가져옵니다. 연결된 기기와 자식 계정이 없을 경우 빈 배열로 들어옵니다. <br> last_log_file_id는 서버에 저장되어있는 마지막 로그 파일 번호입니다.
기기에서 로그 파일 번호를 가져와 비교합니다. last_log_file_id 번호가 더 작을 시 서버에 전송하지 않은 로그가 남아있는 것으로 판단하여 POST devlog를 부르시면 되고
번호가 같으면 모든 로그가 전송되어 있는것으로 판단하시면 됩니다.

```json
[
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

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | 유저 권한이 없습니다.|

```json
{
    "detail": "User is None"
}
```
:::

### **기기 등록하기**

기기를 수동으로 자식 계정에 등록하는 기능입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/device/set-my-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `serial_code` <Badge type="danger" text="required" />| string    | 기기의 시리얼 코드|
| `mac_id` <Badge type="danger" text="required" />| string    | 기기의 MAC 주소|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|

**요청 예시**
```http
POST /api/v1/addnox/device/set-my-device?serial_code=test1&mac_id=test1234&real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statuscode": 200,
  "message": "device connected"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 409              | Already Connected Device  | 이미 다른 사람에게 연결된 기기입니다.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **기기 등록 해제하기**

기기를 자식계정에서 등록 해제하는 기능입니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/addnox/device/un-connect
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid)|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|

**요청 예시**
```http
PATCH /api/v1/addnox/device/un-connect?unique_id=test1&real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200,
  "message": "device unconnected"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **기기 정보 확인하기**

기기를 연결할때 연결이 가능한지 등록이 가능한지 검증하는 API 입니다. 기기 연결전에 반드시 불러야 합니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/device/check-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid)|

**요청 예시**
```http
GET /api/v1/addnox/device/check-device?unique_id=test1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 ok (기기 연결 가능)</span>

기기가 이미 유저에게 등록이 되어있을 경우 연결 Flow로 넘어갈 수 있습니다.
detail 메시지에서 "Connection Confirmed" 로 알려줍니다.

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
@tab <span class="ok-tab">200 ok (기기 등록 가능)</span>

기기가 유저에게 등록이 가능하다면 detail 메시지로 등록 가능함을 알려줍니다.

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

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 409              | Already Connected Device  | 이미 다른 사람에게 연결된 기기입니다.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **기기 별칭 업데이트하기**

기기의 별칭을 업데이트하는 기능입니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/addnox/device/update-alias
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `device_alias` <Badge type="danger" text="required" />| string    | 기기의 별칭|

**요청 예시**
```http
PATCH /api/v1/addnox/device/update-alias HTTPS
Authorization: Bearer your_token_here
{
  "device_id": 0,
  "real_user_id": 0,
  "device_alias": "string"
}
```

**응답 예시**
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

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 409              | Not Connected Device  | 등록되어있는 기기가 아닙니다.     |

```json
{
    "detail": "Not authorized user"
}
```
:::

### **기기 사용 기록 업로드**

기기의 사용기록들을 업로드하는 기능입니다. 사용기록이 여러개 일 수 있기 때문에 배열로 받습니다.


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/device/devlog
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid) |
| `detail_data` <Badge type="danger" text="required" />  | json       | 기기 사용기록, 자세한 구조는 아래 참조 |
| `log_file_id` <Badge type="danger" text="required" />| integer    | 기기 사용기록 id (shortlog file_id 를 말한다)|

<details>
<summary><strong>📌 detail_data 구조 보기</strong></summary>

`detail_data`는 다음과 같은 필드를 포함합니다:

| Name | Type  | Description |
|------|-------|-------------|
| `treatment_date` <Badge type="danger" text="required" />| string | 기기의 사용 시작 시간 (ISO 8601 형식) |
| `movement`   <Badge type="danger" text="required" />| integer | 기기의 IMU 센서 값 (현재 사용하지 않음, any number) |
| `finish_flag` <Badge type="danger" text="required" />| string | 기기 사용 종료 유형, 자세한 구조는 아래 참조 (추후 integer로 변경) |
| `last_intensity`   <Badge type="danger" text="required" />| integer | 마지막 사용 강도 |
| `treatment_time`   <Badge type="danger" text="required" />| integer | 사용 시간 (초 단위) |
| `log_data`   <Badge type="danger" text="required" />| string | 사용 로그 데이터 (현재 사용하지 않음, 빈 string 값)|

::: tip finish_flag 값 설명

`finish_flag`는 다음과 같은 종료 상태를 나타냅니다:

| 값 | 의미 |
|----|------|
| 1  | Normal Shutdown (정상적으로 치료를 끝낸 경우) |
| 2  | Button Shutdown (치료 도중 전원 버튼을 길게 눌러 기기를 종료한 경우) |
| 3  | App Shutdown (치료 도중 앱에서 기기 종료 명령을 눌러 기기를 종료한 경우) |
| 4  | Faulty Contacts Shutdown (전극이 피부에 제대로 접촉되지 않아 기기가 종료된 경우) |
| 5  | VBUS Shutdown (치료 도중 기기를 충전하여 치료가 종료된 경우) |
| 6  | Factory Shutdown (공장 테스트로 종료된 경우) |

:::


</details>

**요청 예시**
```http
POST /api/v1/addnox/device/devlog HTTPS
Authorization: Bearer your_token_here
[
  {
    "real_user_id": 0,
    "device_id": 0,
    "unique_id": "string",
    "detail_data": {
      "treatment_date": "2024-12-05T14:06:47",
      "movement": 1,
      "finish_flag": "2",
      "last_intensity": 2,
      "treatment_time": 416,
      "log_data": ""
    },
    "log_file_id": 0
  } 
]
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

데이터를 잘 저장하였으면 다음과 같이 리턴합니다.

```json
{
    "statusCode": 200,
    "message": "Devlog saved successfully"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 409              | Not Connected Device  | 등록되어있는 기기가 아닙니다.     |

```json
{
    "detail": "Not Found Device"
}
```
:::

### **기기 IMU 센서 기록 업로드**

기기의 움직임 센서에서 측정한 값들을 업로드하는 기능입니다.


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/device/movement
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `movement_data` <Badge type="danger" text="required" />  | array of objects       | 기기 IMU 센서기록, 자세한 구조는 아래 참조 |

<details>
<summary><strong>📌 movement_data 구조 보기</strong></summary>

`movement_data`는 다음과 같은 필드를 포함합니다:

| Name | Type  | Description |
|------|-------|-------------|
| `val` <Badge type="danger" text="required" />| integer | IMU 센서값 |
| `timestamp`   <Badge type="danger" text="required" />| integer | IMU 센서가 측정된 Timestamp(unix timestamp 형식) |


</details>

**요청 예시**
```http
POST /api/v1/addnox/device/movement HTTPS
Authorization: Bearer your_token_here
{
  "real_user_id": 1,
  "device_id": 2,
  "movement_data": [
      {"val": 10, "timestamp": 1736411840},
      {"val": 10, "timestamp": 1736411841},
      {"val": 10, "timestamp": 1736411842},
      {"val": 10, "timestamp": 1736411843},
      {"val": 10, "timestamp": 1736411844},
      {"val": 10, "timestamp": 1736411845},
      {"val": 10, "timestamp": 1736411846},
      {"val": 10, "timestamp": 1736411847},
      {"val": 10, "timestamp": 1736411848},
      {"val": 10, "timestamp": 1736411849},
      {"val": 10, "timestamp": 1736411850},
      // and more..
  ],
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

데이터를 잘 저장하였으면 다음과 같이 리턴합니다.

```json
{
    "statusCode": 200,
    "message": "Movement log saved successfully"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Not Found User  | 자식계정이 존재하지 않습니다.     |
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 409              | Not Connected Device  | 등록되어있는 기기가 아닙니다.     |

```json
{
    "detail": "Not Found Device"
}
```
:::

### **기기 사용 기록 업로드 (V2)**
새로운 요구사항에 맞춰 통일된 API를 사용합니다. 다음과 같은 기능을 가집니다.
- 기기의 사용을 시작하고 30초 뒤에 호출하여 임시 사용 기록을 만듭니다.
- 기기 사용중 블루투스 연결이 끊어졌을때 호출하여 임시 사용 기록을 업데이트 합니다.
- 기기 사용이 종료되었을때 호출하여 임시 사용 기록을 완성 기록으로 업데이트 합니다.
- 기기에서 보낼 사용 기록이 있을때 호출하여 사용 기록을 저장합니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v2/addnox/device/devlog
</div>

**Headers**
| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**
| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `log_arrays` <Badge type="danger" text="required" />| array    | 로그 기록 컨테이너|
| ├ `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| ├ `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| ├ `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid) |
| ├ `detail_data` <Badge type="danger" text="required" />| json    | 기기 사용기록 |
| ├ `log_file_id` <Badge type="info" text="optional" />| integer    | 기기 사용기록 id (shortlog file_id 를 말한다)|

<details>
<summary><strong>📌 detail_data 구조 보기</strong></summary>

`detail_data`는 다음과 같은 필드를 포함합니다:

| Name | Type  | Description |
|------|-------|-------------|
| `treatment_date` <Badge type="danger" text="required" />| string | 기기의 사용 시작 시간 (ISO 8601 형식) |
| `finish_flag` <Badge type="info" text="optional" />| integer | 기기 사용 종료 유형, 자세한 구조는 아래 참조|
| `last_intensity`   <Badge type="danger" text="required" />| integer | 마지막 사용 강도 |
| `treatment_time`   <Badge type="danger" text="required" />| integer | 사용 시간 (초 단위) |

::: tip finish_flag 값 설명

`finish_flag`는 다음과 같은 종료 상태를 나타냅니다:

| 값 | 의미 |
|----|------|
| 1  | Normal Shutdown (정상적으로 치료를 끝낸 경우) |
| 2  | Button Shutdown (치료 도중 전원 버튼을 길게 눌러 기기를 종료한 경우) |
| 3  | App Shutdown (치료 도중 앱에서 기기 종료 명령을 눌러 기기를 종료한 경우) |
| 4  | Faulty Contacts Shutdown (전극이 피부에 제대로 접촉되지 않아 기기가 종료된 경우) |
| 5  | VBUS Shutdown (치료 도중 기기를 충전하여 치료가 종료된 경우) |
| 6  | Factory Shutdown (공장 테스트로 종료된 경우) |

:::

</details>

**요청 예시**

**1. 임시 사용 기록 업로드**

finish_flag를 null로 보내주면 임시 사용기록을 만듭니다. log_file_id 필드는 아예 안보내도 괜찮습니다.
treatment_date 또한 앱에서 30초후에 현재 시간을 형식에 맞게 보내주면 서버에서 30초를 빼서 저장합니다.

```http
POST /api/v2/addnox/device/devlog HTTPS
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

**2. 임시 사용 기록 업데이트**

서버에 임시 사용 기록이 있을 경우 해당 임시 기록을 보내준 데이터로 업데이트합니다.
```http
POST /api/v2/addnox/device/devlog HTTPS
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
**3. 임시 사용 기록 완성**

finish_flag와 log_file_id를 보내주면 임시 사용 기록을 완성 시킵니다.
```http
POST /api/v2/addnox/device/devlog HTTPS
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
**4. 사용 기록 업로드**

다수의 기록들을 업로드할 수 있습니다.
* 서버에 임시 사용 기록이 남아있다면 제일 처음으로 보내주는 배열 첫번째 기록을 임시 사용기록에 덮어 씌웁니다.
```http
POST /api/v2/addnox/device/devlog HTTPS
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

**응답 예시**
::: tabs
@tab <span class="ok-tab">200 OK (임시 사용 기록)</span>
임시 사용기록을 만들거나 업데이트할 경우 아래와 같이 응답합니다.

```json
{
    "statusCode": 200,
    "message": "Temp devlog saved successfully"
}
```

@tab <span class="ok-tab">200 OK (사용 기록 업로드)</span>
임시 사용 기록을 완성시키거나 완성 기록들을 업로드 할 경우 아래와 같이 응답합니다.

```json
{
    "statusCode": 200,
    "message": "Devlog saved successfully"
}
```

@tab <span class="error-tab">ERROR</span>
**오류 응답**
HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.
| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 404              | Not Found User  | 자식 계정이 존재하지 않습니다.     |
| 409              | Not Connected Device  | 등록되어있는 기기가 아닙니다.     |
| 409              | Update Device Log Failed or Create Device Log Failed | 서버 에러     |

```json
{
    "detail": "Not Found Device"
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