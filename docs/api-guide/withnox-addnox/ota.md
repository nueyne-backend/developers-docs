# **OTA**

해당 페이지는 Withnox & Addnox 프로젝트의 펌웨어 OTA에 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Withnox & Addnox OTA API는 디바이스 또는 베이스 스테이션의 펌웨어를 OTA(Over the Air) 방식을 통해 업데이트하기 위한 작업을 수행합니다. API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/ADDNOX-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요.

## **인증**

모든 OTA 관련 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **최신 펌웨어 버전 확인하기**

등록된 기기의 펌웨어 버전을 확인합니다. 
device_id와 real_user_id를 가지고 최신 펌웨어를 확인합니다.


<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/firmware/latest/{device_id}/{real_user_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|


**요청 예시**
```http
GET /api/v1/addnox/firmware/latest/1/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

해당 디바이스에 업데이트 할 수 있는 펌웨어가 있을시 return값으로 업데이트할 펌웨어 정보가 담겨서 옵니다.
디바이스가 구버전일 경우 업데이트 가능한 펌웨어가 여러개일수 있어서 배열 형태로 전달됩니다.

디바이스가 **최신 펌웨어**일경우 빈 [] 배열값이 옵니다.

```json
[
    {
        "id": int,    
        "created_at": "2025-02-28T06:05:32",  // firmware 등록 날짜
        "firmware_id": int, // firmware_id
        "hardware_id": int, // hardware_id
        "firmware": {
            "project_id": int,  // project_id
            "name": "Addnox_MP_59781a09.bin",  // firmware file name
            "description": "withnox firmware release version 1.0.0",  // firmware descripiton
            "is_active": true,  // firmware active 여부
            "created_at": "2025-02-28T06:05:31",
            "id": int,  // firmware_id
            "version": "1.0.0",   // firmware version
            "file_key": "firmwares/ADDNOX/Addnox_MP_59781a09.bin",  // s3 file location
            "updated_at": "2025-02-28T06:05:31"
        }, 
        "hardware": {  // hardware 정보
            "name": "withnox",
            "version": "1.0.0",
            "is_active": true,
            "updated_at": "2025-02-28T06:03:15",
            "id": int,
            "description": "withnox release version",
            "created_at": "2024-07-01T00:00:00"
        }
    }
]
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 자식 계정을 확인해주세요.|
| 403              | Permission denied  | 유저의 기기가 아닙니다.     |
| 404              | Device not found  | 기기를 찾을 수 없습니다.     |
| 404              | Firmware not found  | 현재 기기의 펌웨어가 존재하지않습니다.     |

```json
{
    "detail": "Permission denied"
}
```
:::

### **펌웨어 다운로드하기**

펌웨어 다운로드를 위해 파일을 요청합니다. 
**최신 펌웨어 버전 확인하기** API를 통해 업데이트할 firmware_id값을 얻을 수 있습니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/addnox/firmware/file/{device_id}/{firmware_id}/{real_user_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `firmware_id` <Badge type="danger" text="required" />| integer    | 다운로드할 펌웨어 id |
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|


**요청 예시**
```http
GET /api/v1/addnox/firmware/file/1/1/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

AWS S3 정책으로 스토리지의 파일을 직접적으로 전송할 수 없습니다. 대신 pre-signed URL을 통해 서버에서 리다이렉션을 시켜줍니다.
```json
firmware file stream
```


- **OkHttp**

    OkHttp는 기본적으로 GET 요청 시 자동으로 리디렉션을 따라갑니다.
    즉, 별도의 설정 없이도 서버에서 redirect 응답을 받으면 자동으로 Location 헤더에 지정된 URL로 요청을 전환합니다.

    다만, 만약 자동 리디렉션 처리를 원치 않거나 수동으로 처리하고 싶다면, OkHttpClient를 생성할 때 다음과 같이 followRedirects 옵션을 false로 설정할 수 있습니다:

```java
OkHttpClient client = new OkHttpClient.Builder()
    .followRedirects(false)
    .build();
```

- **Alamofire**

    Alamofire 역시 기본적으로 URLSession의 동작을 따르기 때문에, GET 요청 시 서버의 리디렉션 응답을 자동으로 따라가게 됩니다. 별도의 설정 없이도 자동 리디렉션이 적용되지만, 만약 리디렉션을 직접 처리하거나 중지하고 싶다면 Session을 생성할 때 redirectHandler를 설정할 수 있습니다.

    예를 들어, 자동 리디렉션을 중지하려면 아래와 같이 사용할 수 있습니다:
```swift
let session = Session(redirectHandler: Redirector(behavior: .doNotFollow))
```

@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Invalid firmware     | 현재 펌웨어보다 낮은 버전입니다.|
| 401              | No credentials     | 권한이 만료되었습니다(서버 문의).|
| 404              | Firmware file not found  | 펌웨어 파일이 존재하지않습니다(서버 문의).     |
| 500              | Internal server error | 서버 문의     |

```json
{
    "detail": "Invalid firmware"
}
```
:::

### **펌웨어 버전 업데이트하기**

OTA 완료 후 현재 디바이스의 펌웨어 버전을 업데이트합니다.

<div class="api-endpoint">
  <span class="api-method">Patch</span>
  /api/v1/addnox/firmware/update-result/{device_id}/{firmware_id}/{real_user_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `device_id` <Badge type="danger" text="required" />| integer    | 기기의 id |
| `firmware_id` <Badge type="danger" text="required" />| integer    | 업데이트한 펌웨어 id |
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|


**요청 예시**
```http
PATCH /api/v1/addnox/firmware/update-result/1/2/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>
업데이트 완료한 디바이스의 정보를 리턴합니다.
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
  "created_at": "2025-03-06T05:08:06.745Z",
  "last_log_file_id": 0
}
```

@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Firmware not matched with device     | 펌웨어 id를 확인해주세요.|


```json
{
    "detail": "Firmware not matched with device"
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