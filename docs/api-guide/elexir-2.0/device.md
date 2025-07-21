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

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/prod/device/history/{date}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `date` <Badge type="danger" text="required" />| strng    | 조회할 date 값(yyyy-mm-dd)|

**요청 예시**
```http
GET /api/v1/prod/device/history/2025-07-07 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

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
                "treatment_date": "2025-07-07T01:17:32", // 기기에서 보내준 시간이라 그대로 사용해도 무방
                "mode": 2,
                "finish_flag": "2",
                "last_intensity": 1,
                "treatment_time": 6011,
                "event_num": 1,
                "log_data": ""
            },
            "is_temp": false, //false = 완성된 기록, True = 완성되지 않은 사용기록
            "log_file_id": int
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
            "created_at": "2025-07-08T05:03:02" // UTC 포맷이기 때문에 클라이언트 단에서 Timezone을 더해야 함
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