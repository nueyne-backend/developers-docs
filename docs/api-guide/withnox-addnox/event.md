# **분석 & 기록**

해당 페이지는 Withnox & Addnox 프로젝트의 분석과 기록에 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Withnox & Addnox 분석 & 기록 API는 캘린더에서 사용 기록 조회, 병원 & 복약 기록, 분석 차트 등의 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요.

## **인증**

모든 분석 & 기록 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **차트 데이터 조회**

분석 탭에서 차트를 그리기 위해 불러오는 API입니다. 파라미터의 기본값은 0으로 서버 기준 당일 날짜로 조회합니다.
Figma 기획상 차트는 최근 7일과 최근 한달, 두 가지 기간만 존재하고 있습니다. (요청 예시 참고)

다만 추후 기획이 변경될 수 있기에 기간을 커스텀할 수 있습니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/chart
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `select_mode` <Badge type="info" text="optional" />| integer    | 조회할 데이터의 기간 단위 선택 (기본값 0)|
| `year` <Badge type="info" text="optional" />| integer    | 조회할 연도 선택 (기본값 0) |
| `select_data` <Badge type="info" text="optional" />| integer    | 선택한 기간에 따라 특정 값 지정 (기본값 0)|

::: tip 파라미터 값 설명

`select_mode`는 다음과 같은 값을 지원합니다:

| select_mode | 설명 | 
|----|------|
| 0  | 주 단위 조회	 | 
| 1  | 월 단위 조회 |
| 2  | 분기 단위 조회 |
| 3  | 연 단위 조회 |

**`select_data` 값 설명**

`select_mode`에 따라 `select_data` 값의 범위가 달라집니다.

**`select_mode = 0` (주 단위)**
- **0**: 오늘 주 (`today.week`)  
- **1 ~ 54**: 주 번호 선택 (`weeknum`)  

**`select_mode = 1` (월 단위)**
- **0**: 오늘 월 (`today.month`)  
- **1 ~ 12**: 월 번호 선택 (`monthnum`)  

**`select_mode = 2` (분기 단위)**
- **0**: 오늘 분기 (`today.quarter`)  
- **1 ~ 4**: 분기 번호 선택 (`quarternum`)  

**`select_mode = 3` (연 단위)**
- 연단위는 select_data를 사용하지않습니다. year 파라미터를 사용해주세요.

:::

**요청 예시**
1. **이번 주 차트 데이터 불러오기**
```http
GET /api/v1/addnox/chart?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```
**설명**: 이번 주의 데이터를 조회합니다.

2. **이번 달 차트 데이터 불러오기**
```http
GET /api/v1/addnox/chart?real_user_id=1&select_mode=1 HTTPS
Authorization: Bearer your_token_here
```
**설명**: 이번 달의 데이터를 조회합니다.

3. **커스텀 기간의 차트 데이터 불러오기**
```http
/api/v1/addnox/chart?real_user_id=1&select_mode=0&select_data=15 // 15번째 주의 데이터를 조회합니다.
/api/v1/addnox/chart?real_user_id=1&select_mode=1&select_data=5 // 5월 데이터를 조회합니다.
/api/v1/addnox/chart?real_user_id=1&select_mode=2&select_data=0 // 오늘 기준 분기를 조회합니다.
/api/v1/addnox/chart?real_user_id=1&select_mode=3 // 오늘 연도의 데이터를 조회합니다.
```
**설명**: 원하는 기간의 데이터를 조회합니다.

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK (주, 월 단위 조회)</span>
select_mode에 따라 데이터 집계 방식이 다릅니다. 
- 주, 월 단위 조회 (select_mode = 0 or 1) 일 경우 일 별로 데이터를 집계.
- 분기, 년도 단위 조회일 경우 월 별로 데이터를 집계.

동일한 날짜에 치료기록이 여러개일 경우 사용 시간과 움직임은 **합계**, 마지막 사용 강도는 **평균**(소수점 1자리)으로 계산합니다.

```json
{
    "treatment_time_data": [
        {
            "treatment_date": "2024-11-21", // str 형
            "treatment_time": 25200 // int 형
        },
        {
            "treatment_date": "2024-11-22",
            "treatment_time": 25200
        },
        {
            "treatment_date": "2024-11-23",
            "treatment_time": 28800
        },
        {
            "treatment_date": "2024-11-24",
            "treatment_time": 32400
        },
        {
            "treatment_date": "2024-11-25",
            "treatment_time": 32400
        },
        {
            "treatment_date": "2024-11-26",
            "treatment_time": 25200
        },
        {
            "treatment_date": "2024-11-27",
            "treatment_time": 25200
        }
    ],
    "treatment_intensity_data": [
        {
            "treatment_date": "2024-11-21", // str 형
            "last_intensity": 5.0  // float 형
        },
        {
            "treatment_date": "2024-11-22",
            "last_intensity": 5.0
        },
        {
            "treatment_date": "2024-11-23",
            "last_intensity": 2.0
        },
        {
            "treatment_date": "2024-11-24",
            "last_intensity": 4.0
        },
        {
            "treatment_date": "2024-11-25",
            "last_intensity": 8.0
        },
        {
            "treatment_date": "2024-11-26",
            "last_intensity": 5.0
        },
        {
            "treatment_date": "2024-11-27",
            "last_intensity": 5.0
        }
    ],
    "movement_data": [
        {
            "treatment_date": "2024-11-21", // str 형
            "movement": 80  // int 형
        },
        {
            "treatment_date": "2024-11-22",
            "movement": 50
        },
        {
            "treatment_date": "2024-11-23",
            "movement": 50
        },
        {
            "treatment_date": "2024-11-24",
            "movement": 40
        },
        {
            "treatment_date": "2024-11-25",
            "movement": 50
        },
        {
            "treatment_date": "2024-11-26",
            "movement": 60
        },
        {
            "treatment_date": "2024-11-27",
            "movement": 30
        }
    ],
    "avg_treatment_time": 27771.4,  // float 형
    "avg_treatment_intensity": 4.9,  // float 형
    "avg_movement": 51.4  // float 형
}
```

@tab <span class="ok-tab">200 OK (월, 분기 단위 조회)</span>
select_mode에 따라 데이터 집계 방식이 다릅니다. 
- 주, 월 단위 조회 (select_mode = 0 or 1) 일 경우 일 별로 데이터를 집계.
- 분기, 년도 단위 조회일 경우 월 별로 데이터를 집계.

동일한 날짜에 치료기록이 여러개일 경우 사용 시간과 움직임은 **합계**, 마지막 사용 강도는 **평균**(소수점 1자리)으로 계산합니다.

```json
{
    "treatment_time_data": [
        {
            "treatment_date": "2024-11-30", // str 형
            "treatment_time": 194400 // int 형
        },
        {
            "treatment_date": "2024-12-31",
            "treatment_time": 75600
        }
    ],
    "treatment_intensity_data": [
        {
            "treatment_date": "2024-11-30", // str 형
            "last_intensity": 4.9  // float 형
        },
        {
            "treatment_date": "2024-12-31",
            "last_intensity": 20.3  
        }
    ],
    "movement_data": [
        {
            "treatment_date": "2024-11-30", // str 형
            "movement": 360 // int 형
        },
        {
            "treatment_date": "2024-12-31",
            "movement": 117
        }
    ], 
    "avg_treatment_time": 135000.0,  // float 형
    "avg_treatment_intensity": 12.6,  // float 형
    "avg_movement": 238.5  // float 형
}
```

@tab <span class="ok-tab">200 OK (no-data)</span>
해당 기간에 데이터가 없을 경우 빈값으로 옵니다.
```json
{
    "treatment_time_data": [],
    "treatment_intensity_data": [],
    "movement_data": [],
    "avg_treatment_time": 0,
    "avg_treatment_intensity": 0,
    "avg_movement": 0
}
```

@tab <span class="error-tab">ERROR</span>

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


### **기록 데이터 조회**

분석 탭에서 캘린더 기록을 불러오는 API입니다. 파라미터의 기본값은 0으로 서버 기준 당일 날짜로 조회합니다.
Figma 기획상 캘린더는 주 단위와 월 단위, 두 가지 기간만 존재하고 있습니다. (요청 예시 참고)

다만 추후 기획이 변경될 수 있기에 기간을 커스텀할 수 있습니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/event/history
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `select_mode` <Badge type="info" text="optional" />| integer    | 조회할 데이터의 기간 단위 선택 (기본값 0)|
| `year` <Badge type="info" text="optional" />| integer    | 조회할 연도 선택 (기본값 0) |
| `select_data` <Badge type="info" text="optional" />| integer    | 선택한 기간에 따라 특정 값 지정 (기본값 0)|


**요청 예시**
1. **이번 주 기록 데이터 불러오기**
```http
GET /api/v1/addnox/event/history?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```
**설명**: 이번 주의 데이터를 조회합니다.

2. **이번 달 기록 데이터 불러오기**
```http
GET /api/v1/addnox/event/history?real_user_id=1&select_mode=1 HTTPS
Authorization: Bearer your_token_here
```
**설명**: 이번 달의 데이터를 조회합니다.

3. **커스텀 기간의 기록 데이터 불러오기**
```http
/api/v1/addnox/event/history?real_user_id=1&select_mode=0&select_data=15 // 15번째 주의 데이터를 조회합니다.
/api/v1/addnox/event/history?real_user_id=1&select_mode=1&select_data=5 // 5월 데이터를 조회합니다.
/api/v1/addnox/event/history?real_user_id=1&select_mode=2&select_data=0 // 오늘 기준 분기를 조회합니다.
/api/v1/addnox/event/history?real_user_id=1&select_mode=3 // 오늘 연도의 데이터를 조회합니다.
```
**설명**: 원하는 기간의 데이터를 조회합니다.


**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

치료기록 또는 이벤트가 있는 날짜만 가져옵니다.
- **is_devlog** : 치료기록
- **is_event**: 이벤트

```json
[
    {
        "date": "2024-12-01",
        "is_devlog": 1,
        "is_event": 0
    },
    {
        "date": "2024-12-03",
        "is_devlog": 1,
        "is_event": 1
    },
    {
        "date": "2024-12-09",
        "is_devlog": 0,
        "is_event": 1
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

### **기록 데이터 상세 조회**

캘린더 기록에서 특정 날짜의 상세 데이터를 불러오는 API입니다. 파라미터의 기본값은 0으로 서버 기준 당일 날짜로 조회합니다.


<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/event
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `event_date` <Badge type="info" text="optional" />| string    | 조회할 데이터의 기간 선택 yyyy-mm-dd (기본값 today)|


**요청 예시**
1. **오늘 자 상세 데이터 불러오기**
```http
GET /api/v1/addnox/event?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```
**설명**: 오늘 자 상세 데이터를 조회합니다.

2. **특정 날짜의 상세 데이터 불러오기**
```http
GET /api/v1/addnox/event?real_user_id=1&event_date=2024-12-08 HTTPS
Authorization: Bearer your_token_here
```
**설명**: 특정 날짜의 상세 데이터를 조회합니다.



**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

치료기록 또는 이벤트가 있는 날짜만 가져옵니다.
- **event_id** : 이벤트 고유 id
- **treatment_data**: 상세 치료 기록 (날짜, 사용시간, 마지막 사용 강도)
- **memo**: 메모
- **event_data**: 상세 이벤트(약, 병원)

```json
{
    "real_user_id": 7,
    "event_id": 4,
    "treatment_data": [
        {
            "treatment_date": "2024-12-03T04:00:57",
            "treatment_time": 25200,
            "last_intensity": 25
        },
        {
            "treatment_date": "2024-12-03T05:00:57",
            "treatment_time": 25200,
            "last_intensity": 16
        }
    ],
    "memo": "testtesttest",
    "event_data": {
        "medication": [
            {
                "medication_name": "hello",
                "medication_dose": 1
            }
        ],
        "hospital": [
            "Nu Eyne"
        ]
    }
}
```

@tab <span class="ok-tab">200 OK (치료기록만 있을 경우)</span>

치료기록만 있는 경우 event_data는 빈 배열, event_id는 null 입니다.
- **event_id** : 이벤트 고유 id
- **treatment_data**: 상세 치료 기록 (날짜, 사용시간, 마지막 사용 강도)
- **memo**: 메모
- **event_data**: 상세 이벤트(약, 병원)

```json
{
    "real_user_id": 7,
    "event_id": null,
    "treatment_data": [
        {
            "treatment_date": "2024-11-21T02:00:57",
            "treatment_time": 25200
        }
    ],
    "memo": "",
    "event_data": {
        "medication": [],
        "hospital": []
    }
}
```

@tab <span class="ok-tab">200 OK (이벤트만 있을 경우)</span>

이벤트만 있는 경우 treatment_data는 빈 배열입니다.
- **event_id** : 이벤트 고유 id
- **treatment_data**: 상세 치료 기록 (날짜, 사용시간, 마지막 사용 강도)
- **memo**: 메모
- **event_data**: 상세 이벤트(약, 병원)

```json
{
    "real_user_id": 7,
    "event_id": 1,
    "treatment_data": [],
    "memo": "test",
    "event_data": {
        "medication": [
            {
                "medication_name": "test1",
                "medication_dose": 1
            },
            {
                "medication_name": "test2",
                "medication_dose": 3
            }
        ],
        "hospital": [
            "test_center",
            "KU Hospital"
        ]
    }
}
```

@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Failed to read detail event     | 서버 에러.|
| 422              | Input should be a valid date or datetime    | event_date 값을 확인해 주세요.|


```json
{
     "detail": [
        {
            "type": "date_from_datetime_parsing",
            "loc": [
                "query",
                "event_date"
            ],
            "msg": "Input should be a valid date or datetime, invalid datetime separator, expected `T`, `t`, `_` or space",
            "input": "2024-12-123",
            "ctx": {
                "error": "invalid datetime separator, expected `T`, `t`, `_` or space"
            },
            "url": "https://errors.pydantic.dev/2.5/v/date_from_datetime_parsing"
        }
    ]
}
```
:::


### **이벤트 데이터 생성 & 업데이트**

상세 기록에서 특정 날짜에 이벤트를 생성 또는 업데이트 하는 API입니다.

**Body Parameter에 event_id를 포함하면 업데이트로 간주합니다.**
<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/addnox/event
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `event_id` <Badge type="info" text="optional" />| integer    | 업데이트할 이벤트의 id|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `memo` <Badge type="info" text="optional" />| string    | 메모 |
| `event_data` <Badge type="info" text="optional" />| json    | 이벤트 데이터 (아래 형식 참고)|
| `created_at` <Badge type="danger" text="required" />| string    | 생성 또는 업데이트할 이벤트의 날짜|

::: tip event_data 값 설명

`event_data`는 다음과 같은 필드를 포함합니다:

**1. medication (약물 정보)**
- 유형(Type): List[Dictionary]
- 설명(Description): 약물의 이름과 복용량 정보를 포함하는 리스트입니다.
```json
"medication": [
    {
        "medication_name": "test1",
        "medication_dose": 1
    },
    {
        "medication_name": "test2",
        "medication_dose": 3
    }
]
```
**구조 설명**
- medication_name (string): 약물의 이름
- medication_dose (integer): 약물 복용량

**2. hospital (병원 정보)**
- 유형(Type): List[Dictionary]
- 설명(Description): 병원의 이름이 포함된 문자열 리스트입니다.
```json
"hospital": [
    "test_center",
    "KU Hospital"
]
```
**구조 설명**
- 병원 리스트의 각 요소는 병원 이름을 나타냅니다.

:::

**요청 예시**
1. **이벤트 생성하기**
```http
GET /api/v1/addnox/event?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
{
  "real_user_id": "7",
  "memo": "안녕하세요.",
  "event_data": {
    "hospital": [
      "Nu Eyne",
      "건국대병원",
      "중앙대병원"
    ],
    "medication": [
      {
        "medication_name": "medication_1",
        "medication_dose": 3
      }
    ]
  },
  "created_at": "2024-12-09"
}
```

2. **이벤트 업데이트하기**
```http
GET /api/v1/addnox/event?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
{
  "event_id": 9,
  "real_user_id": "7",
  "memo": "수정했습니다",
  "event_data": {
    "hospital": [
      "건국대병원",
      "중앙대병원"
    ],
    "medication": [
      {
        "medication_name": "medication_1",
        "medication_dose": 7
      }
    ]
  },
  "created_at": "2024-12-09"
}
```

::: tabs

@tab <span class="ok-tab">200 OK </span>

생성 & 업데이트된 이벤트를 반환합니다.

```json
{
    "event_id": 1,
    "real_user_id": 7,
    "memo": "test",
    "event_data": {
        "medication": [
            {
                "medication_name": "test1",
                "medication_dose": 1
            },
            {
                "medication_name": "test2",
                "medication_dose": 3
            }
        ],
        "hospital": [
            "test_center",
            "KU Hospital"
        ]
    }
}
```

@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Failed to store user event     | 서버 에러.|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Event not found    | event_id를 찾을 수 없습니다.|
| 404              | Real User id is not valid    | real_user_id를 확인해주세요.|


```json
{
  "detail":  "Event not found"
}
```
:::


### **PDF 리포트 내보내기**

선택한 기간의 PDF report를 생성하는 API 입니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/pdf/report
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|
| `basestation_id` <Badge type="danger" text="required" />| integer    | 베이스 스테이션의 id|
| `start_date` <Badge type="danger" text="required" />| string    | 데이터 조회 시작 날짜 (YYYY-MM-DD)|
| `end_date` <Badge type="danger" text="required" />| string    | 데이터 조회 끝 날짜 (YYYY-MM-DD) |
| `language` <Badge type="info" text="optional" />| string    | PDF report 언어 (기본값: KR)|


**요청 예시**
```http
GET /api/v1/addnox/pdf/report?real_user_id=7&basestation_id=2&start_date=2024-11-21&end_date=2024-11-27 HTTPS
Authorization: Bearer your_token_here
```


::: tabs

@tab <span class="ok-tab">200 OK </span>

생성된 PDF Report 파일을 반환합니다.
- Content-Type: application/pdf
- content-dispostition: attachment; filename=Withnox_Report.pdf

```file
Withnox_Report.pdf
```

@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 유저 권한이 없습니다.|
| 404              | Real user is not found     | real_user_id를 확인해주세요.|
| 403              | This device does not belong to the user    | 유저에게 등록된 베이스 스테이션이 아닙니다.|
| 404              | Device not found    | basestation_id를 확인해주세요.|


```json
{
  "detail":  "Not authorized user"
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