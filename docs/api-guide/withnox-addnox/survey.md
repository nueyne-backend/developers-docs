# **설문**

해당 페이지는 Withnox & Addnox 프로젝트의 설문에 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Withnox & Addnox 설문 API는 콘텐츠에서 WITHNOX 증상 설문지를 기반으로 설문 응답, 결과, 통계 등의 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요.

## **인증**

모든 설문 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **설문지 리스트 가져오기**

진행 가능한 설문지 리스트를 가져옵니다.


<div class="api-endpoint">
  <span class="api-method">GET</span>
    /api/v1/addnox/survey
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|


**요청 예시**
```http
GET /api/v1/addnox/survey HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

배너에 표시하기 위한 설문지 제목과 설명을 반환합니다. 진행 가능한 설문지가 없는 경우 빈 배열로 반환됩니다.

```json
[
  {
    "id": 0,
    "title": "우리 아이 마음 설문",
    "description": "우리 아이의 성향은?",
    "created_at": "2025-03-07T04:42:51.436Z"
  }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     | 서버 문의|


```json
{
    "detail": "Internal Server Error"
}
```
:::


### **설문지 질문 리스트 가져오기**

해당 설문지의 질문 리스트를 반환합니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
    /api/v1/addnox/survey/questions/{survey_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `survey_id` <Badge type="danger" text="required" />| integer    | 설문지 id 입니다.|


**요청 예시**
```http
GET /api/v1/addnox/survey/questions/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

해당 설문지의 질문 리스트를 모두 가져옵니다.

```json
[
    {
        "id": 21,
        "survey_id": 1,
        "text": "세세한 부분에 집중하지 못하거나, 학업에서 실수를 종종 저지른다.", // 질문 제목
        "order": 1,  // 질문 순서
        "created_at": "2024-12-11T04:51:56"
    },
    {
        "id": 22,
        "survey_id": 1,
        "text": "과제나 업무를 수행하는데 있어서 쉽게 주의가 분산된다",
        "order": 2,
        "created_at": "2024-12-11T04:51:56"
    },
    {
        "id": 23,
        "survey_id": 1,
        "text": "상대방과 대화를 하는 상황에서, 이야기를 잘 듣지 않는 것처럼 보인다.",
        "order": 3,
        "created_at": "2024-12-11T04:51:56"
    },
    // and more
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     | 서버 문의|


```json
{
    "detail": "Internal Server Error"
}
```
:::

### **월별 설문 결과 조회하기**

해당 년도와 월을 기준으로 설문 결과 목록을 반환합니다. is_temp가 False인 즉 완료된 설문만 return 하며 미완성된 설문은 return 하지 않습니다. 추후 Flow 추가시 활용할 예정입니다.
order 순서는 created_at 값을 기준으로 내림차순으로 정렬해서 보내줍니다. (최근 날짜 부터)


<div class="api-endpoint">
  <span class="api-method">GET</span>
    /api/v1/addnox/survey/response?date={yyyy-mm}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameter**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `date` <Badge type="danger" text="required" />| string    | 조회할 년도와 월입니다.(yyyy-mm)|


**요청 예시**
```http
GET /api/v1/addnox/survey/response?date=2024-12 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

설문 결과들을 반환합니다. is_temp가 true인 설문은 완료되지 않은 설문입니다.

```json
[
    {
        "id": 3,
        "survey_id": 1,
        "root_user_id": 4,
        "real_user_id": 7,
        "att_score": null,
        "imp_score": null,
        "dis_score": null,
        "grade": "초등학교2학년",
        "class_type": "정규반",
        "relation": "어머니",
        "is_temp": true,
        "created_at": "2025-02-25T15:10:00"
    },
    {
        "id": 1,
        "survey_id": 1,
        "root_user_id": 4,
        "real_user_id": 7,
        "att_score": 15,
        "imp_score": 18,
        "dis_score": 16,
        "grade": null,
        "class_type": null,
        "relation": null,
        "is_temp": false,
        "created_at": "2025-02-24T14:10:00"
    }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     | 서버 문의|


```json
{
    "detail": "Internal Server Error"
}
```
:::

### **설문 시작하기**

사용자 정보를 입력받아 설문 응답 객체를 DB에 생성합니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
    /api/v1/addnox/survey/response
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameter**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `survey_id` <Badge type="danger" text="required" />| integer    | 설문지 id 입니다.|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 설문 대상자 자식 계정의 id입니다.|
| `grade` <Badge type="info" text="optional" />| string    | 설문 대상자의 학년입니다.|
| `class_type` <Badge type="info" text="optional" />| string    | 설문 대상자의 수업 형식입니다.|
| `relation` <Badge type="info" text="optional" />| string    | 설문 응답자와 대상자와의 관계입니다.|
| `created_at` <Badge type="danger" text="required" />| datetime    | 설문을 시작한 날짜입니다. (yyyy-mm-dd hh:mm:ss)|


**요청 예시**
```http
POST /api/v1/addnox/survey/response HTTPS
Authorization: Bearer your_token_here
{
    "survey_id": 1,
    "real_user_id": 7,
    "created_at": "2024-12-11 14:10:00",
    "grade": "초등학교2학년",
    "class_type": "정규반",
    "relation": "어머니"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

생성한 설문 객체의 정보를 반환합니다. 
```json
{
    "id": 5,   // response_id입니다.
    "survey_id": 1,
    "root_user_id": 4,
    "real_user_id": 7,
    "att_score": null,
    "imp_score": null,
    "dis_score": null,
    "grade": null,
    "class_type": null,
    "relation": null,
    "is_temp": true,
    "created_at": "2024-12-11 14:10:00"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 500              | Internal Server Error     | 서버 문의|


```json
{
    "detail": "Internal Server Error"
}
```
:::

### **설문 응답하기**

사용자가 응답한 질문 결과들을 저장합니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
    /api/v1/addnox/survey/response/detail/list
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameter**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `response_details` <Badge type="danger" text="required" />| array    | 질문 응답 배열입니다.|
| `memo` <Badge type="info" text="optional" />| string    | 메모 값입니다.|

<details>
<summary><strong>📌 response_details 구조 보기</strong></summary>

`response_details`는 질문 갯수에 맞게 보내주셔야 합니다.

ex) 질문이 26개 -> response_detail 배열안에 26개의 응답객체가 있어야합니다.

| Name | Type  | Description |
|------|-------|-------------|
| `response_id` <Badge type="danger" text="required" />| integer | 생성한 설문 객체의 id입니다. |
| `question_id` <Badge type="danger" text="required" />| integer | 질문 id 입니다.|
| `score`   <Badge type="danger" text="required" />| integer | 해당 질문 id에 대한 사용자 응답 결과값입니다. (0~3) |

</details>

**요청 예시**
```http
POST /api/v1/addnox/survey/response/detail/list HTTPS
Authorization: Bearer your_token_here
{
    "response_details": [ // 26개
        {
            "response_id": 1,
            "question_id": 1,
            "score": 1
        },
        {
            "response_id": 1,
            "question_id": 2,
            "score": 2
        },
        {
            "response_id": 1,
            "question_id": 3,
            "score": 3
        },
        {
            "response_id": 1,
            "question_id": 4,
            "score": 0
        },
        {
            "response_id": 1,
            "question_id": 5,
            "score": 2
        },
        {
            "response_id": 1,
            "question_id": 6,
            "score": 3
        },
        // and more
    ],
    “memo” : "test”
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

응답한 설문 결과를 반환합니다. 
```json
{
    "id": 5,
    "survey_id": 1,
    "root_user_id": 4,
    "real_user_id": 7,
    "att_score": 15,
    "imp_score": 18,
    "dis_score": 17,
    "grade": null,
    "class_type": null,
    "relation": null,
    "is_temp": false,
    "created_at": "2025-03-07T10:34:00"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Survey is not finished     | 설문이 완료되지 않았습니다.|
| 404              | Survey response not found     | 설문 객체 id를 확인해주세요.|


```json
{
    "detail": "Internal Server Error"
}
```
:::
