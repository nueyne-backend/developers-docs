# **Analysis & History**

This page describes the Analysis & History APIs for the Withnox & Addnox projects.

## **Introduction**

The Withnox & Addnox Analysis & History APIs provides functionalities for get recent chart, get event data, create event data, and export pdf report.

If you need some imagination of API Flow please checkout the [Figma API Flow!](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0)

## **Authentication**

Some authentication APIs require an authentication token. Please include the authentication token in the `Authorization` header to make authenticated API requests.

```
Authorization: Bearer your_token_here
```
Replace `your_token_here` with the access token obtained during the authentication process.

## **Endpoints**

### **Get Recent Chart Data**

The API below fetches chart data based on the given date. It returns data from the past 7 days or the past 30 days.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/chart/recent
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | Child account ID|
| `select_mode` <Badge type="info" text="optional" />| integer    | Time period selection (Default: 0)|
| `current_date` <Badge type="info" text="optional" />| integer    | Base date for data retrieval (YYYY-MM-DD) (Default: Server's current date) |

::: tip Parameter Details

`select_mode`: Determines the time period for data aggregation.

| select_mode | Description | 
|----|------|
| 0  | Weekly data	 | 
| 1  | Monthly data |

`current_date`: Although optional, it is recommended to send this parameter to avoid potential time zone discrepancies caused by server time (Eastern Time, USA).
:::

**Request Examples**
1. **Fetch Chart Data for the Past 7 Days**
```http
GET /api/v1/addnox/chart/recent?real_user_id=1?current_date=2025-01-15 HTTPS
Authorization: Bearer your_token_here
```
**Description**: Retrieves data from the past 7 days.

2. **Fetch Chart Data for the Past 30 Days**
```http
GET /api/v1/addnox/chart/recent?real_user_id=1?current_date=2025-01-15?select_mode=1 HTTPS
Authorization: Bearer your_token_here
```
**Description**: Retrieves data from the past 30 days.

**Response Example**
::: tabs

@tab <span class="ok-tab">200 OK (Weekly or Monthly Data)</span>
- For both weekly (select_mode = 0) and monthly (select_mode = 1) data retrieval, the API aggregates data by date.
- Currently, the API only returns dates with recorded data. In the future, it will be updated to return all dates within the selected period, even if no data is available.

When there are multiple treatment records on the same date:

- **treatment_time** and **movement** values are summed.
- **last_intensity** is averaged to **one decimal place**.

Fields prefixed with `avg_` are of type **Float** with a default value of **0**.

```json
{
    "treatment_time_data": [
        {
            "treatment_date": "2024-11-21", // str 
            "treatment_time": 25200 // int 
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
            "treatment_date": "2024-11-21", // str
            "last_intensity": 5.0  // float
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
            "treatment_date": "2024-11-21", // str
            "movement": 80  // int
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
    "avg_treatment_time": 27771.4,  // float
    "avg_treatment_intensity": 4.9,  // float
    "avg_movement": 51.4  // float
}
```

@tab <span class="ok-tab">200 OK (no-data)</span>
If there is no data available for the selected period, the response will be empty as shown below.
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

**Error Responses**

The API returns error codes and messages based on the HTTP status code. Refer to the table below for details.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Invalid mode. Use 0 for recent 7 days or 1 for recent 30 days     | Check the select_mode value.|
| 401              | Not authorized user     | Verify the real_user_id value.|

```json
{
    "detail": "Invalid mode. Use 0 for recent 7 days or 1 for recent 30 days"
}
```
:::

### **Get Integrated Chart Data**

This is the API used to fetch usage trend charts and sleep environment charts from the analysis tab. 
It returns data for either the past 7 days or the past 30 days based on the provided date.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/chart/analysis
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | Child account ID|
| `select_mode` <Badge type="info" text="optional" />| integer    | Unit of time for data retrieval (default is 0)|
| `current_date` <Badge type="info" text="optional" />| string    | Date for data retrieval (YYYY-MM-DD) (default is today's date based on server) |

::: tip Parameter Value Explanation

`select_mode` supports the following values:

| select_mode | Description | 
|----|------|
| 0  | Weekly data retrieval	 | 
| 1  | Monthly data retrieval |

`current_date`is optional, but the default value is today's date based on the server (Eastern Time), so there might be discrepancies depending on the user's location. It’s recommended to provide this value.

:::

**Request Examples**
1. **Fetch data for the past 7 days**
```http
GET /api/v1/addnox/chart/analysis?real_user_id=1?current_date=2025-01-15 HTTPS
Authorization: Bearer your_token_here
```
**설명**: Retrieves data for the past 7 days.

2. **Fetch data for the past 30 days**
```http
GET /api/v1/addnox/chart/analysis?real_user_id=1?current_date=2025-01-15?select_mode=1 HTTPS
Authorization: Bearer your_token_here
```
**설명**: Retrieves data for the past 30 days.

**Response Examples**
::: tabs

@tab <span class="ok-tab">200 OK (Weekly, Monthly Data Retrieval)</span>
- When `select_mode` = 0 or 1, data is aggregated by day.
- If there is no data for the selected date, it returns 0 or 0.0.
- Basestation is selected automatically by server-side.

If there are multiple treatment records for the same date, usage time and movement are **summed**, and the last intensity is **averaged** (rounded to one decimal place). Values starting with avg_ are of type **float**, with a default value of **0.0**.

```json
{
    "treatment_time_data": [
        {
            "treatment_date": "2024-12-25", // string
            "treatment_time": 50400 // int
        },
        {
            "treatment_date": "2024-12-26",
            "treatment_time": 0
        },
        {
            "treatment_date": "2024-12-27",
            "treatment_time": 0
        },
        // and more..
    ],
    "treatment_intensity_data": [
        {
            "treatment_date": "2024-12-25",
            "last_intensity": 22.5 // float
        },
        {
            "treatment_date": "2024-12-26",
            "last_intensity": 0.0
        },
        {
            "treatment_date": "2024-12-27",
            "last_intensity": 0.0
        },
        // and more..
    ],
    "movement_data": [
        {
            "treatment_date": "2024-12-25",
            "movement": 1 // int
        },
        {
            "treatment_date": "2024-12-26",
            "movement": 0
        },
        {
            "treatment_date": "2024-12-27",
            "movement": 0
        },
        // and more..
    ],
    "avg_treatment_time": 2520.0, // float
    "avg_treatment_intensity": 1.3, // float
    "avg_movement": 0.3, // float
    "sleep_env_data": [
        {
            "date": "2024-12-25",
            "temperature": 22.55, // float
            "humidity": 43.41, // float
            "brightness": 2, // int
            "noise": 1 // int
        },
        {
            "date": "2024-12-26",
            "temperature": 0.0,
            "humidity": 0.0,
            "brightness": 0,
            "noise": 0
        },
        {
            "date": "2024-12-27",
            "temperature": 0.0,
            "humidity": 0.0,
            "brightness": 0,
            "noise": 0
        },
        // and more..
    ]
}
```

@tab <span class="ok-tab">200 OK (no-data)</span>
If there is no data for the selected period, it returns 0 or 0.0 for the retrieved dates.
```json
{
    "treatment_time_data": [
        {
            "treatment_date": "2025-01-17", // string
            "treatment_time": 0 // int
        },
        {
            "treatment_date": "2025-01-18",
            "treatment_time": 0
        },
        {
            "treatment_date": "2025-01-19",
            "treatment_time": 0
        },
        // and more..
    ],
    "treatment_intensity_data": [
        {
            "treatment_date": "2025-01-17", // string
            "last_intensity": 0.0 //float
        },
        {
            "treatment_date": "2025-01-18",
            "last_intensity": 0.0
        },
        {
            "treatment_date": "2025-01-19",
            "last_intensity": 0.0
        },
        // and more..
    ],
    "movement_data": [
        {
            "treatment_date": "2025-01-17", // string
            "movement": 0 // int
        },
        {
            "treatment_date": "2025-01-18",
            "movement": 0
        },
        {
            "treatment_date": "2025-01-19",
            "movement": 0
        },
        // and more..
    ],
    "avg_treatment_time": 0.0, // float
    "avg_treatment_intensity": 0.0, // float
    "avg_movement": 0.0, // float
    "sleep_env_data": [
        {
            "date": "2025-01-17", // string
            "temperature": 0.0, // float
            "humidity": 0.0, // float
            "brightness": 0, // int
            "noise": 0 // int
        },
        {
            "date": "2025-01-18",
            "temperature": 0.0,
            "humidity": 0.0,
            "brightness": 0,
            "noise": 0
        },
        {
            "date": "2025-01-19",
            "temperature": 0.0,
            "humidity": 0.0,
            "brightness": 0,
            "noise": 0
        },
        // and more..
    ]
}
```

@tab <span class="error-tab">ERROR</span>

**Error Responses**

The API provides status codes and messages based on the HTTP status code. Please refer to the table below.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Invalid mode. Use 0 for recent 7 days or 1 for recent 30 days     | Check the `select_mode` value.|
| 401              | Not authorized user     | Check the `real_user_id` value.|
| 403              | Device not found     | Check the `basestation_id` value.|
| 404              | This device does not belong to the user     | The basestation is not connected to the user.|


```json
{
    "detail": "Invalid mode. Use 0 for recent 7 days or 1 for recent 30 days"
}
```
:::

### **Event History Retrieval**

This API is used to fetch calendar records from the Analysis tab. By default, it retrieves data based on the server's current date.
In the current Figma design, the calendar supports weekly and monthly views. However, custom date ranges can be used to accommodate future design changes.

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
| `real_user_id` <Badge type="danger" text="required" />| integer    | Child account ID|
| `select_mode` <Badge type="info" text="optional" />| integer    | Time period selection (Default: 0)|
| `year` <Badge type="info" text="optional" />| integer    | Year selection (Default: 0) |
| `select_data` <Badge type="info" text="optional" />| integer    | Specify data for the selected period (Default: 0)|


**Request Examples**
1. **Fetch Records for This Week**
```http
GET /api/v1/addnox/event/history?real_user_id=1 HTTPS
Authorization: Bearer your_token_here
```
**Description**: Retrieves data for the current week.

2. **Fetch Records for This Month**
```http
GET /api/v1/addnox/event/history?real_user_id=1&select_mode=1 HTTPS
Authorization: Bearer your_token_here
```
**Description**: Retrieves data for the current month.

3. **Fetch Custom Date Range Records**
```http
/api/v1/addnox/event/history?real_user_id=1&select_mode=0&select_data=15 //  Retrieves data for the 15th week.
/api/v1/addnox/event/history?real_user_id=1&select_mode=1&select_data=5 // Retrieves data for May.
/api/v1/addnox/event/history?real_user_id=1&select_mode=2&select_data=0 // Retrieves data for the current quarter.
/api/v1/addnox/event/history?real_user_id=1&select_mode=3 // Retrieves data for the current year.
```
**Description**: Retrieves records for the specified period.


**Response Examples**

::: tabs

@tab <span class="ok-tab">200 OK</span>

Only dates with treatment or event records are returned.
- **is_devlog** : Treatment record
- **is_event**: Event record

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

**Error Responses**

The API returns error codes and messages based on the HTTP status code. Refer to the table below for details.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Invalid mode     | Check the select_mode value.|
| 422              | select_data for mode 0 (week) must be between 0 and 54     | Check the select_data value.|
| 422              | select_data for mode 1 (month) must be between 0 and 12     | Check the select_data value.|
| 422              | select_data for mode 2 (quarter) must be between 0 and 4     | Check the select_data value.|
| 422              | The year must be between 1 and 9999     | Check the year value.|

```json
{
    "detail": "Invalid mode"
}
```
:::

### **Event Details Retrieval**

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
| `memo` <Badge type="info" text="optional" />| string    | 메모 (최대 1000자)|
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