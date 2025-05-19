# **기기**

해당 페이지는 ADT 임상프로젝트와 관련된 API를 설명해놓은 페이지입니다.

## **소개**

ADT 기기 API는 사용 기록 저장, 사용 기록 삭제, 사용 기록 내보내기 등의 임상과 관련된 작업을 수행하는 API들로 구성되어있습니다.



## **인증**

모든 기기 API는 인증 토큰을 요구하지않습니다.


## **엔드포인트**


### **기기 사용 기록 업로드**

기기의 사용기록들을 업로드하는 기능입니다. 사용기록이 여러개 일 수 있기 때문에 배열로 받습니다.


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/adt/device/devlog
</div>

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid) |
| `detail_data` <Badge type="danger" text="required" />  | json       | 기기 사용기록, 자세한 구조는 아래 참조 |
| `intensity_record` <Badge type="danger" text="required" />  | json       | 기기 사용강도기록, 자세한 구조는 아래 참조 |
| `log_file_id` <Badge type="danger" text="required" />| integer    | 기기 사용기록 id (shortlog file_id 를 말한다)|

<details>
<summary><strong>📌 JSON 데이터 구조 보기</strong></summary>

`detail_data`는 다음과 같은 필드를 포함합니다:

| Name | Type  | Description |
|------|-------|-------------|
| `treatment_date` <Badge type="danger" text="required" />| string | 기기의 사용 시작 시간 (ISO 8601 형식) |
| `finish_flag` <Badge type="danger" text="required" />| string | 기기 사용 종료 유형, 자세한 구조는 아래 참조 (추후 integer로 변경) |
| `last_intensity`   <Badge type="danger" text="required" />| integer | 마지막 사용 강도 |
| `treatment_time`   <Badge type="danger" text="required" />| integer | 사용 시간 (초 단위) |

`intensity_record`는 다음과 같은 필드를 포함합니다:

| Name | Type  | Description |
|------|-------|-------------|
| `intensity`   <Badge type="danger" text="required" />| integer | 사용 강도(기기는 6분마다 사용 강도를 로그에 저장함) |

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
POST /api/v1/adt/device/devlog HTTPS
[
  {
    "unique_id": "string",
    "detail_data": {
      "treatment_date": "2024-12-05T14:06:47",
      "finish_flag": "2",
      "last_intensity": 2,
      "treatment_time": 416,
    },
    "intensity_record": [
        {
        "intensity": 2,
        },
        {
        "intensity": 12,
        },
        {
        "intensity": 22,
        }
    ]
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


### **기기 사용 기록 삭제**

기기의 사용기록들을 모두 소프트 삭제하는 기능입니다. 
주로 공장에서 테스트 과정으로 생긴 기록들을 모두 삭제하고 출고전에 사용하는 용도입니다.


<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/adt/device/devlog
</div>

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid) |


**요청 예시**
```http
DELETE /api/v1/adt/device/devlog?unique_id=1 HTTPS
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

데이터를 잘 삭제하였으면 다음과 같이 리턴합니다.

```json
{
    "statusCode": 200,
    "message": "Deleted {지운 개수} device log(s) successfully"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device Log not found  | 지울 기록이 없습니다.     |
| 500              | Internal error while deleting device logs  | 서버 문의.    |

```json
{
    "detail": "Device Log not found"
}
```
:::

### **기기 사용 기록 내보내기**

기기의 사용기록들을 모두 엑셀 파일 형식으로 내보내는 기능입니다.
파일이름은 ADT_DEVICE_{unique_id}_{start_date}~{end_date}.xlsx 을 따릅니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/adt/device/export
</div>

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid) |
| `start_date` <Badge type="danger" text="required" />| string    | 시작 날짜 (yyyy-mm-dd) |
| `end_date` <Badge type="danger" text="required" />| string    | 종료 날짜 (yyyy-mm-dd) |


**요청 예시**
```http
GET /api/v1/adt/device/devlog?unique_id=1&start_date=2025-05-01&end_date=2025-05-10 HTTPS
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

엑셀 파일을 전달합니다.

```string
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Device Log not found  | 지울 기록이 없습니다.     |
| 500              | Internal error while deleting device logs  | 서버 문의.    |

```json
{
    "detail": "Device Log not found"
}
```
:::

### **기기 사용 기록 조회**

분석 탭에서 캘린더 기록을 불러오는 API입니다. 파라미터의 기본값은 0으로 서버 기준 당일 날짜로 조회합니다.
Figma 기획상 캘린더는 주 단위와 월 단위, 두 가지 기간만 존재하고 있습니다. (요청 예시 참고)

다만 추후 기획이 변경될 수 있기에 기간을 커스텀할 수 있습니다.

치료기록을 가져오는 조건은 다음과 같습니다.
1. 삭제되지않은 모든 기록

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/adt/device/history
</div>

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| integer    | 기기의 unique_id|
| `select_mode` <Badge type="info" text="optional" />| integer    | 조회할 데이터의 기간 단위 선택 (기본값 0)|
| `year` <Badge type="info" text="optional" />| integer    | 조회할 연도 선택 (기본값 0) |
| `select_data` <Badge type="info" text="optional" />| integer    | 선택한 기간에 따라 특정 값 지정 (기본값 0)|


**요청 예시**
1. **이번 주 기록 데이터 불러오기**
```http
GET /api/v1/adt/device/history?unique_id=1 HTTPS
```
**설명**: 이번 주의 데이터를 조회합니다.

2. **이번 달 기록 데이터 불러오기**
```http
GET /api/v1/adt/device/history?unique_id=1&select_mode=1 HTTPS
```
**설명**: 이번 달의 데이터를 조회합니다.

3. **커스텀 기간의 기록 데이터 불러오기**
```http
/api/v1/addnox/event/history?unique_id=1&select_mode=0&select_data=15 // 15번째 주의 데이터를 조회합니다.
/api/v1/addnox/event/history?unique_id=1&select_mode=1&select_data=5 // 5월 데이터를 조회합니다.
/api/v1/addnox/event/history?unique_id=1&select_mode=2&select_data=0 // 오늘 기준 분기를 조회합니다.
/api/v1/addnox/event/history?unique_id=1&select_mode=3 // 오늘 연도의 데이터를 조회합니다.
```
**설명**: 원하는 기간의 데이터를 조회합니다.


**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

치료기록이 있는 날짜만 가져옵니다.
- **is_devlog** : 치료기록

```json
[
    {
        "date": "2024-12-01",
        "is_devlog": 1
    },
    {
        "date": "2024-12-03",
        "is_devlog": 1
    }
]
```
@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Invalid mode     | select_mode 값을 확인해 주세요.|
| 422              | select_data for mode 0 (week) must be between 0 and 54     | select_data 값을 확인해 주세요.|
| 422              | select_data for mode 1 (month) must be between 0 and 12     | select_data 값을 확인해 주세요.|
| 422              | select_data for mode 2 (quarter) must be between 0 and 4     | select_data 값을 확인해 주세요.|
| 422              | The year must be between 1 and 9999     | year 값을 확인해 주세요.|

```json
{
    "detail": "Invalid mode"
}
```
:::


### **기기 사용 기록 상세 조회**

해당 날짜의 기기 상세 사용 기록을 조회하는 API입니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/adt/device/detail
</div>

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid) |
| `event_date` <Badge type="danger" text="required" />| string    | 조회 날짜 (yyyy-mm-dd) |


**요청 예시**
```http
GET /api/v1/adt/device/detail?unique_id=1&event_date=2025-05-01 HTTPS
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "treatment_data": [
        {
            "treatment_date": "2000-01-01T20:48:00",
            "treatment_time": 3255,
            "last_intensity": 17
        },
        {
            "treatment_date": "2000-01-01T00:00:02",
            "treatment_time": 724,
            "last_intensity": 1
        }
    ]
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Failed to read detail event  | 서버 문의.    |

```json
{
    "detail": "Failed to read detail event"
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