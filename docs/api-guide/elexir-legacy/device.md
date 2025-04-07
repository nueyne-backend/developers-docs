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