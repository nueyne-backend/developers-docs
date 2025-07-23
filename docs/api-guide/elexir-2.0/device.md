# **기기**

해당 페이지는 Elexir 2.0 프로젝트의 치료기기와 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Elexir 2.0 기기 API는 사용 기록 저장, 기기 등록 등 치료기기와 관련된 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

<!-- API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요. -->

## **인증**

모든 기기 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **해당 날짜의 히스토리 가져오기**

해당하는 날짜의 기기 사용 기록과 설문 기록을 모두 가져옵니다.
모든 date값은 Timezone(UTC) 정보가 포함되어있습니다. 

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/prod/device/history/{date}?timezone=Asia/Seoul
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `date` <Badge type="danger" text="required" />| strng    | 조회할 date 값(yyyy-mm-dd)|
| `timezone` <Badge type="danger" text="required" />| strng    | 현재 클라이언트의 Timezone 값|


**요청 예시**
```http
GET /api/v1/prod/device/history/2025-07-07?timezone=Asia/Seoul HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

현재 `survey_data` 필드는 예전 설문 형식입니다. simple_survey format에 맞춰서 변경될 예정입니다.

@tab <span class="ok-tab">200 OK</span>

```json
{
    "device_logs": [
        {
            "id": int, // device_log_id, survey_data의 log_id랑 같은 값
            "user_id": int,
            "device_id": int,
            "unique_id": string,
            "detail_data": {
                "treatment_date": "2025-07-07T01:17:32+00:00", // UTC 시간
                "mode": 2,
                "finish_flag": "2",
                "last_intensity": 1,
                "treatment_time": 6011,
                "event_num": 1,
                "log_data": ""
            },
            "is_temp": false, //false = 완성된 기록, True = 완성되지 않은 사용기록
            "log_file_id": int,
            "survey_id": int // 연결된 survey_id가 있으면 값 리턴 없을 경우 Null
        },
        // and more..
    ],
    "survey_data": [
        {
            "id": int, // survey_id
            "user_id": int,
            "log_id": int,
            "survey_data": {
                "treatment_before": 1,
                "treatment_after": 3,
                "symptom": [
                    "Dizziness"
                ],
                "residual_symptoms": [
                    "Tingling"
                ],
                "pain_area": [
                    "FrontHeadRight"
                ],
                "medication": [
                    {
                        "medication_name": "iBuprofen",
                        "medication_dose": 2
                    }
                ],
                "pain_start_time": null, // 사용하지 않는 legacy field
                "notes_before_treatment": null, // 사용하지 않는 legacy field
                "notes_after_treatment": "head",
                "trigger": [
                    "Sunlight"
                ]
            },
            "is_completed": true,  // 사전 설문 + 사후 설문 모두 완료되었는지 여부
            "created_at": "2025-07-08T05:03:02+00:00" // // UTC 시간
        },
        // and more..
    ]
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Read Device Log Failed     | 읽기 실패 (서버 관리자 문의)|

```json
{
    "detail": "Read Device Log Failed"
}
```
:::

### **기기 임시 사용 기록 생성**

기기 임시 사용 기록을 생성하는 API입니다. 

급성모드 (mode 1)의 경우 return값에 설문 관련 데이터가 들어옵니다.

 - 또한 Push Notification이 트리거 되어 사용자에게 설문 알림이 전송됩니다. (푸시 동의 상태일 경우)

예방모드 (mode 2)일 경우 return값에 설문 관련 데이터가 Null로 들어옵니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/prod/device/devlog/temp
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `user_id` <Badge type="danger" text="required" />| integer    | 유저 계정의 id|
| `unique_id` <Badge type="danger" text="required" />| stirng    | 기기의 고유 unique_id값 |
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `detail_data` <Badge type="danger" text="required" />| json    | 기기 사용기록 |

<details>
<summary><strong>📌 detail_data 구조 보기</strong></summary>

`detail_data`는 다음과 같은 필드를 포함합니다:

| Name | Type  | Description |
|------|-------|-------------|
| `mode` <Badge type="danger" text="required" />| integer | 기기 사용 모드 유형(급성모드: 1, 예방모드: 2)|

</details>


**요청 예시**

`detail_data`안의 `mode`값에 따라 survey_id가 리턴됩니다.

```http
POST /api/v1/prod/device/devlog/temp HTTPS
Authorization: Bearer your_token_here
{
  "unique_id": "test2",
  "user_id": int,
  "device_id": int,
  "detail_data": {"mode": 2}
}
```


**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK(급성모드)</span>

데이터를 잘 저장하였으면 다음과 같이 저장한 기기 임시 사용 기록을 리턴합니다.

급성모드의 경우 임시 설문 id를 생성하여 보내줍니다.

```json
{
    "id": 1840,
    "device_id": 2,
    "unique_id": "test2",
    "detail_data": {
        "treatment_date": "2025-07-23T03:50:04+00:00",
        "mode": 2,
        "finish_flag": null,
        "last_intensity": null,
        "treatment_time": null,
        "event_num": null,
        "log_data": null
    },
    "survey_id": 100, 
    "survey_data": null,
    "is_temp": true
}
```

@tab <span class="ok-tab">200 OK(예방모드)</span>

데이터를 잘 저장하였으면 다음과 같이 저장한 기기 임시 사용 기록을 리턴합니다.

예방모드의 경우 설문 id가 Null로 옵니다.

```json
{
    "id": 1840,
    "device_id": 2,
    "unique_id": "test2",
    "detail_data": {
        "treatment_date": "2025-07-23T03:50:04+00:00",
        "mode": 2,
        "finish_flag": null,
        "last_intensity": null,
        "treatment_time": null,
        "event_num": null,
        "log_data": null
    },
    "survey_id": null,
    "survey_data": null,
    "is_temp": true
}
```

@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Not Found User     | 사용자 계정 id를 찾을 수 없음.|
| 404              | Not Found Device     | 기기가 존재하지 않습니다.|
| 409              | Not Connected Device     | 등록되어있는 기기가 아닙니다. |
| 409              | Create Device Log Failed     | 기기 임시 사용 기록 생성 실패(서버 관리자 문의).|


```json
{
    "detail": "Not Found User"
}
```
:::


### **기기 사용 기록 업로드**

기기 사용 기록을 생성하는 API입니다.

기기 사용을 시작하였을때 기기안에 미전송된 사용 기록이 있을경우 호출하는 API입니다. (아닐 경우 Temp 호출)
기기 사용시 사용한 모드값을 Parameter에 담아서 보내줘야 합니다. 요청 예시 참고


<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/prod/device/devlog
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `mode` <Badge type="danger" text="required" />| strng    | 현재 기기 사용 모드 유형(급성모드: 1, 예방모드: 2)|


**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_log` <Badge type="danger" text="required" />| array    | 로그 기록 컨테이너|
| ├ `user_id` <Badge type="danger" text="required" />| integer    |  유저 계정의 id|
| ├ `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| ├ `unique_id` <Badge type="danger" text="required" />| string    | 기기의 unique_id (uuid) |
| ├ `detail_data` <Badge type="danger" text="required" />| json    | 기기 사용기록 |
| ├ `log_file_id` <Badge type="danger" text="required" />| integer    | 기기 사용기록 id (shortlog file_id 를 말한다)|

<details>
<summary><strong>📌 detail_data 구조 보기</strong></summary>

`detail_data`는 다음과 같은 필드를 포함합니다:

| Name | Type  | Description |
|------|-------|-------------|
| `treatment_date` <Badge type="danger" text="required" />| string | 기기의 사용 시작 시간 (ISO 8601 형식) |
| `mode` <Badge type="danger" text="required" />| string | 기기 사용 모드 유형(급성모드: 1, 예방모드: 2) |
| `finish_flag` <Badge type="info" text="optional" />| string | 기기 사용 종료 유형, 자세한 구조는 아래 참조|
| `last_intensity`   <Badge type="danger" text="required" />| integer | 마지막 사용 강도 |
| `treatment_time`   <Badge type="danger" text="required" />| integer | 사용 시간 (초 단위) |
| `event_num`   <Badge type="danger" text="required" />| integer | 사용하지않는값 |
| `log_data`   <Badge type="danger" text="required" />| string | 사용하지않는값 |

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
다수의 기록들을 업로드할 수 있습니다.
* 서버에 임시 사용 기록이 남아있다면 제일 처음으로 보내주는 배열 첫번째 기록을 임시 사용기록에 덮어 씌웁니다.

```http
POST /api/v1/prod/device/devlog?mode=2 HTTPS
Authorization: Bearer your_token_here
{
    "device_log": [
        {
            "user_id": 1,
            "device_id": 2,
            "unique_id": "elexir_temp",
            "detail_data": {
                "treatment_date": "2025-02-14T15:48:49+00:00", // 가운데 T 생략 가능
                "finish_flag": 2,
                "mode": 2,
                "last_intensity": 25,
                "treatment_time": 3600,
                "event_num": 1, 
                "log_data": ""
            },
            "log_file_id": 1
        },
        {
            "user_id": 1,
            "device_id": 2,
            "unique_id": "elexir_temp",
            "detail_data": {
                "treatment_date": "2025-02-15T15:48:49+00:00", // 가운데 T 생략 가능
                "finish_flag": 2,
                "mode": 2,
                "last_intensity": 25,
                "treatment_time": 3600,
                "event_num": 1, 
                "log_data": ""
            },
            "log_file_id": 2
        },
        // 등등
    ]
}
```


**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK(급성모드)</span>

데이터를 잘 저장하였으면 다음과 같이 저장한 기기 임시 사용 기록을 리턴합니다.

급성모드의 경우 임시 설문 id를 생성하여 보내줍니다. (POST /api/v1/prod/device/devlog?mode=1)

```json
{
    "id": 1840,
    "device_id": 2,
    "unique_id": "test2",
    "detail_data": {
        "treatment_date": "2025-07-23T03:50:04+00:00",
        "mode": 2,
        "finish_flag": null,
        "last_intensity": null,
        "treatment_time": null,
        "event_num": null,
        "log_data": null
    },
    "survey_id": 100, 
    "survey_data": null,
    "is_temp": true
}
```

@tab <span class="ok-tab">200 OK(예방모드)</span>

데이터를 잘 저장하였으면 다음과 같이 저장한 기기 임시 사용 기록을 리턴합니다.

예방모드의 경우 설문 id가 Null로 옵니다. (POST /api/v1/prod/device/devlog?mode=2)

```json
{
    "id": 1840,
    "device_id": 2,
    "unique_id": "test2",
    "detail_data": {
        "treatment_date": "2025-07-23T03:50:04+00:00", 
        "mode": 2,
        "finish_flag": null,
        "last_intensity": null,
        "treatment_time": null,
        "event_num": null,
        "log_data": null
    },
    "survey_id": null,
    "survey_data": null,
    "is_temp": true
}
```

@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Not Found User     | 사용자 계정 id를 찾을 수 없음.|
| 404              | Not Found Device     | 기기가 존재하지 않습니다.|
| 409              | Not Connected Device     | 등록되어있는 기기가 아닙니다. |
| 409              | Create Device Log Failed     | 기기 임시 사용 기록 생성 실패(서버 관리자 문의).|


```json
{
    "detail": "Not Found User"
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