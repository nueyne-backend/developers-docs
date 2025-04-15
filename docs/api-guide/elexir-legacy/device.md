# **기기**

해당 페이지는 Elexir Legacy 프로젝트의 치료기기와 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Elexir Legacy 기기 API는 사용 기록 저장, 기기 등록 등 치료기기와 관련된 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/4ku2F0sWUBycYZAP5Zo1gZ/Elexir-Legacy-API-Flow?node-id=0-1&p=f&t=2SiQxHwy08Cs6NfT-0) 페이지를 참고해주세요.

## **인증**

모든 기기 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**


### **유저 기기 가져오기**

유저에게 등록된 기기 리스트를 가져옵니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/legacy/device/my-devices
</div>


**요청 예시**
```http
GET /api/v1/legacy/device/my-devices HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>


```json
[
    {
        "id": 1,
        "serialcode": "test",
        "user_id": 1,
        "model_id": 2,
        "mac_id": "2023-06-29 15:07:25",
        "unique_id": "270038000C50524833343720",
        "modelname": "ELEXIR",
        "regdate": "2023-06-01T00:00:00"
    }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     | 서버 에러|

```json
{
    "detail": "Internal Server Error"
}
```
:::

### **기기 정보 확인하기**

기기를 연결할때 연결이 가능한지 등록이 가능한지 검증하는 API 입니다. 기기 연결전에 반드시 불러야 합니다.
파라미터의 unique_id 값은 서버에서 **대문자변환** 처리합니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/legacy/device/check-device
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
GET /api/v1/legacy/device/check-device?unique_id=test1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 ok </span>

기기가 이미 유저에게 등록이 되어있을 경우 연결 Flow로 넘어갈 수 있습니다.

```json
{
    "serial_code": "string",
    "user_id": 0,
    "mac_id": "string",
    "model_id": 0,
    "unique_id": "string",
    "id": 0,
    "regdate": "2024-11-28T04:19:43.007Z",
}
```

@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | This device is not registered     | 공장에서 시리얼코드를 부여하지 않은 기기입니다.|
| 400              | Device Connection Failed     | 기기 확인 실패(서버 관리자 문의)|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 409              | Already Connected Device  | 이미 다른 사람에게 연결된 기기입니다.     |

```json
{
    "detail": "Already Connected Device"
}
```
:::

### **기기 등록하기**

기기를 수동으로 계정에 등록하는 기능입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/legacy/device/set-my-device
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `serial_code` <Badge type="danger" text="required" />| string    | 기기의 시리얼 코드|
| `mac_id` <Badge type="info" text="optional" />| string    | 기기의 MAC 주소(필수 아님)|
| `unique_id` <Badge type="danger" text="required" />| integer    | 기기의 unique_id (uuid)|

**요청 예시**
```http
POST /api/v1/legacy/device/set-my-device?serial_code=test1&mac_id=test1234&unique_id=1 HTTPS
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
| 400              | Device Connection Failed     | 기기 연결 실패(서버 관리자 문의)|
| 404              | Serial code is not valid  | 시리얼 코드가 올바르지 않습니다.     |
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |
| 409              | Already Connected Device  | 이미 다른 사람에게 연결된 기기입니다.     |

```json
{
    "detail": "Serial code is not valid"
}
```
:::

### **기기 등록 해제하기**

기기를 계정에서 등록 해제하는 기능입니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/legacy/device/un-connect
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
PATCH /api/v1/addnox/device/un-connect?unique_id=test1 HTTPS
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
| 400              | Device unconnect failed     | 기기 등록 해제 실패(서버 관리자 문의)|
| 404              | Not Found Device  | 기기가 존재하지 않습니다.     |

```json
{
    "detail": "Not Found Device"
}
```
:::

### **기기 사용 기록 업로드**

기기의 사용기록들을 업로드하는 기능입니다. 사용 기록은 한개만 받을 수 있으며
일부 파라미터들은 구형 서버에서 마이그레이션하여 히스토리가 없는 관계로 설명이 부정확할 수 있습니다.


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/legacy/device/devlog
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `model_id` <Badge type="danger" text="required" />| integer    | 기기의 모델 id |
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `fversion` <Badge type="danger" text="required" />| float    | 펌웨어 버전으로 추정 |
| `logdate` <Badge type="danger" text="required" />| datetime    | 기기의 사용 시작 시간으로 추정 (ISO 8601 형식) |
| `mode` <Badge type="danger" text="required" />| integer    | 기기 사용 모드 (0 또는 1)|
| `finish_flag` <Badge type="danger" text="required" />| integer    | 기기 사용 종료 유형(구형 서버에서는 string이었는데 integer로 변경) |
| `last_intensity` <Badge type="danger" text="required" />| float    | 마지막 사용 강도(전압 단위로 추정)|
| `treatment_time` <Badge type="danger" text="required" />| integer    |  사용 시간 (초 단위)|
| `event_num` <Badge type="danger" text="required" />| integer    | 이벤트 번호? 추정 불가 |
| `log_data` <Badge type="danger" text="required" />| string    | 기기 로그 데이터로 추정|


::: tip finish_flag 값 설명

구형 서버 로그에는 1,2,3,4,7 의 finish_flag만 확인 할 수 있었습니다. 아래 설명은 **추정**입니다.

`finish_flag`는 다음과 같은 종료 상태를 나타냅니다:

| 값 | 의미 |
|----|------|
| 1  | Normal Shutdown (정상적으로 치료를 끝낸 경우) |
| 2  | Button Shutdown (치료 도중 전원 버튼을 길게 눌러 기기를 종료한 경우) |
| 3  | App Shutdown (치료 도중 앱에서 기기 종료 명령을 눌러 기기를 종료한 경우) |
| 4  | Faulty Contacts Shutdown (전극이 피부에 제대로 접촉되지 않아 기기가 종료된 경우) |
| 7  | Factory Shutdown (공장 테스트로 종료된 경우) |

:::


**요청 예시**
```http
POST /api/v1/legacy/device/devlog HTTPS
Authorization: Bearer your_token_here
{
  "user_id": 0,
  "model_id": 0,
  "device_id": 0,
  "fversion": 0,
  "logdate": "2025-04-14T02:09:21.380Z",
  "mode": 0,
  "finish_flag": 0,
  "last_intensity": 0,
  "treatment_time": 0,
  "event_num": 0,
  "log_data": "string"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

데이터를 잘 저장하였으면 다음과 같이 저장한 기기 사용 기록을 리턴합니다.

```json
{
  "user_id": 0,
  "model_id": 0,
  "device_id": 0,
  "fversion": 0,
  "logdate": "2025-04-14T02:09:21.381Z",
  "mode": 0,
  "finish_flag": 0,
  "last_intensity": 0,
  "treatment_time": 0,
  "event_num": 0,
  "log_data": "string"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal server error     | 기기 사용 기록 저장 실패(서버 관리자 문의).|


```json
{
    "detail": "Internal server error"
}
```
:::

### **기기 임시 사용 기록 업로드**

기기 임시 사용 기록을 업로드 하여 기기 시작 시간을 실시간으로 알 수 있게 사용하는 API입니다.

히스토리 상으로 설명하면 일렉시아 1.0 기기같은경우 사용이 종료되어도 사용기록을 업로드 하지않고
다음 연결할때 기기 사용기록을 저장하는 방식이다. 따라서 시작할때 임시 사용 기록을 POST하여 시작 시간 기록,
사용이 종료되고 POST하여 종료시간을 기록하여 기기 연결 없이도 사용 기록을 보고싶어서 만든 API로 추정된다.


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/elexir/device/devlog/temp
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `model_id` <Badge type="danger" text="required" />| integer    | 기기의 모델 id |
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid)|
| `finish_flag` <Badge type="danger" text="required" />| integer    | 기기 사용 종료 유형(구형 서버에서는 string이었는데 integer로 변경) |
| `start_date` <Badge type="danger" text="required" />| datetime    | 기기의 사용 시작 시간으로 추정 (ISO 8601 형식) |
| `last_date` <Badge type="danger" text="required" />| datetime    | 기기의 사용 종료 시간으로 추정 (ISO 8601 형식) |


::: tip finish_flag 값 설명

구형 서버 로그에는 1,2,3,4,7 의 finish_flag만 확인 할 수 있었습니다. 아래 설명은 **추정**입니다.

`finish_flag`는 다음과 같은 종료 상태를 나타냅니다:

| 값 | 의미 |
|----|------|
| 1  | Normal Shutdown (정상적으로 치료를 끝낸 경우) |
| 2  | Button Shutdown (치료 도중 전원 버튼을 길게 눌러 기기를 종료한 경우) |
| 3  | App Shutdown (치료 도중 앱에서 기기 종료 명령을 눌러 기기를 종료한 경우) |
| 4  | Faulty Contacts Shutdown (전극이 피부에 제대로 접촉되지 않아 기기가 종료된 경우) |
| 7  | Factory Shutdown (공장 테스트로 종료된 경우) |

:::


**요청 예시**

1. **기기 사용 시작**

finish_flag값을 0으로 last_date를 빈 String으로 보내주세요.

```http
POST /api/v1/addnox/device/devlog/temp HTTPS
Authorization: Bearer your_token_here
{
  "user_id": 0,
  "model_id": 0,
  "device_id": 0,
  "unique_id": "string",
  "finish_flag": 0,  // 0 으로 보내기
  "start_date": "2025-04-14T03:53:49.261Z",
  "last_date": ""   // 빈 String으로 보내기
}
```
2. **기기 사용 종료**

```http
POST /api/v1/addnox/device/devlog/temp HTTPS
Authorization: Bearer your_token_here
{
  "user_id": 0,
  "model_id": 0,
  "device_id": 0,
  "unique_id": "string",
  "finish_flag": 1,  // 값 지정해 보내기
  "start_date": "2025-04-14T03:53:49.261Z",
  "last_date": "2025-04-14T04:53:49.261Z"   // 사용 종료 시간 보내기
}
```


**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

데이터를 잘 저장하였으면 다음과 같이 저장한 기기 임시 사용 기록을 리턴합니다.

```json
{
    "user_id": 0,
    "model_id": 0,
    "device_id": 0,
    "unique_id": "string",
    "finish_flag": 0,
    "start_date": "2025-04-14T02:09:21.381Z",
    "last_date": "2025-04-14T02:09:21.381Z"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal server error     | 기기 사용 기록 저장 실패(서버 관리자 문의).|


```json
{
    "detail": "Internal server error"
}
```
:::

### **기기 마지막 사용 날짜 읽어오기**

기기의 마지막 사용 기록 날짜를 조회하는 기능입니다. (용도 불명)

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/legacy/device/devlog/lasttime/{device_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_id` <Badge type="danger" text="required" />| int    | 기기의 id|


**요청 예시**
```http
GET /api/v1/legacy/device/devlog/lasttime/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```string
"2025-04-11 15:58:00"
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | No Content     | 마지막 사용 기록이 없습니다.|


```json
{
    "detail": "No Content"
}
```
:::


### **기기 사용 기록 조회하기(월 단위)**

기기의 사용 기록을 월 단위로 조회하는 기능입니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/legacy/device/devlog/lasttime/{device_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `year_month` <Badge type="danger" text="required" />| string    | 조회할 연도와 월 (yyyy-mm)|


**요청 예시**
```http
GET /api/v1/legacy/device/my-devlog/2025-04 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
[
    {
        "user_id": 2,
        "model_id": 2,
        "device_id": 2,
        "fversion": 22.0,
        "logdate": "2025-04-11T15:58:00",
        "mode": 1,
        "finish_flag": 1,
        "last_intensity": 161.0,
        "treatment_time": 1200,
        "event_num": 2,
        "log_data": "06008101f793466e1100800cb0043304",
        "id": 3,
        "regdate": "2025-04-11T23:14:56"
    },
    {
        "user_id": 2,
        "model_id": 2,
        "device_id": 2,
        "fversion": 22.0,
        "logdate": "2025-04-10T05:58:00",
        "mode": 1,
        "finish_flag": 3,
        "last_intensity": 161.0,
        "treatment_time": 1200,
        "event_num": 2,
        "log_data": "06008101f793466e1100800cb0043304",
        "id": 2,
        "regdate": "2025-04-10T23:14:56"
    },
    {
        "user_id": 2,
        "model_id": 2,
        "device_id": 2,
        "fversion": 22.0,
        "logdate": "2025-04-09T05:58:00",
        "mode": 0,
        "finish_flag": 4,
        "last_intensity": 89.0,
        "treatment_time": 2280,
        "event_num": 6,
        "log_data": "040081015f93b16f1a0082590f00020318008059501f9b1e5c02810350927c71350280593520f31eb40481030a92dc71",
        "id": 1,
        "regdate": "2025-04-09T22:33:56"
    }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Read Device Log Failed     | 서버 관리자 문의 |


```json
{
    "detail": "Read Device Log Failed"
}
```
:::