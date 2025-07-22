# **설문**

해당 페이지는 Elexir 2.0 프로젝트의 설문과 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Elexir 2.0 설문 API는 설문 생성, 조회, 업데이트 등 설문과 관련된 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

<!-- API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요. -->

## **인증**

모든 설문 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **설문 생성하기**

기기 사용 없이 설문을 단독으로 생성하는 기능입니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/prod/survey
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `user_id` <Badge type="danger" text="required" />| int    | 유저 아이디 |
| `survey_data` <Badge type="danger" text="required" />| JSON    | 설문 데이터(아래 예시 참조)|
| `survey_date` <Badge type="danger" text="required" />| datetime    | 설문을 생성할 날짜(yyyy-mm-dd hh:mm:ss)|

<details>
<summary><strong>📌 survey_data 구조 보기</strong></summary>

| Key           | Type                  | 설명                                                                                                                                      |
| :------------ | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `pain`        | `Number`              | 통증 강도, **1 ~ 5** 사이의 값을 가집니다.                                                                                                |
| `trigger`     | `Array<String>`       | 편두통 유발 요인 배열입니다.<br>**선택 가능 값:** `Stress`, `Lack of Sleep`, `Alcohol`, `Caffeine`, `Menstruation`, `Bright Sun`, `Work` 등 |
| `symptom`     | `Array<String>`       | 동반 증상 배열입니다.<br>**선택 가능 값:** `Tingling`, `Head Pounding`, `Sickness`, `Throw Up`, `Photophobic`, `Hyperacusis`, `Neck Pain` 등 |
| `pain_area`   | `Object`              | 통증 부위 정보입니다. **(자세한 내용은 아래 '통증 부위(pain_area) 표현' 참고)** |
| `medication`  | `Array<Object>`       | 복용한 약물 정보 배열입니다.<br>**객체 형식:** `{"medication_dose": Number, "medication_name": String}`                                         |
| `medication.medication_name` | `String` | 약물 이름입니다. <br>**선택 가능 값:** `Zomic`, `Relpax`, `Maxalt`, `Paracetamol`, `Ibuprofen`, `Topiramate`, `Sumatriptan` |

**통증 부위(pain_area) 표현**

- **Fronthead**

`FrontCheekLeft`, `FrontCheekRight`, `FrontChinLeft`, `FrontChinRight`, `FrontEarLeft`, `FrontEarRight`, `FrontEyeLeft`, `FrontEyeRight`, `FrontHeadLeft`, `FrontHeadRight`, `FrontMouth`, `FrontNeck`, `FrontNose`

- **Backhead**

`BackEarLeft`, `BackEarRight`, `BackHeadLeft`, `BackHeadRight`, `BackNeckLeft`, `BackNeckRight`

<AnatomyCard />

</details>

**요청 예시**
```http
POST /api/v1/prod/survey HTTPS
Authorization: Bearer your_token_here
{
  "user_id": 1,
  "survey_data": {
    "pain": 3,
    "trigger": ["Caffein"],
    "symptom": ["Tingling"],
    "pain_area": ["BackEarLeft"],
    "medication":[{"medication_dose": 2, "medication_name": "Ibuprofen"}],
    "memo": "This is test"
  },
  "survey_date": "2025-07-21 10:00:00"
}
```



**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "user_id": int,
  "survey_data": {
    "pain": 3,
    "trigger": ["Caffein"],
    "symptom": ["Tingling"],
    "pain_area": ["BackEarLeft"],
    "medication":[{"medication_dose": 2, "medication_name": "Ibuprofen"}],
    "memo": "This is test"
  },
  "survey_date": "2025-07-21 10:00:00"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User id is not valid     | 유저 아이디가 일치하지 않음|
| 400              | Failed to store user survey     | 서버 오류 (관리자 문의)|

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