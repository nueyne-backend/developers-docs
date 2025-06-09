
# **유저**

해당 페이지는 Lux 프로젝트의 유저와 관련된 API를 설명해놓은 페이지입니다.

## **소개**

Lux 유저 API는 사용자 정보 불러오기, 업데이트 등과 연관된 자식 계정 관련 작업을 수행하는 기능입니다.
API를 호출하기전에 인증 페이지를 읽어보시길 추천드립니다.

<!-- API 흐름에 대한 시각적인 흐름도가 필요하다면 [Figma API Flow](https://www.figma.com/board/PhHUx8wj4FGvTMPBxTnzVc/lux-API-Flow?node-id=0-1&node-type=canvas&t=HyUVwsn2ws5yzZVZ-0) 페이지를 참고해주세요. -->

## **인증**

모든 유저 API는 인증 토큰을 필요로 합니다. 인증을 하기위해서 `Authorization` header 에 인증 토큰을 넣어서 API를 호출해주세요.

```
Authorization: Bearer your_token_here
```
`your_token_here` 에 인증 과정에서 획득한 access_token으로 대체해주세요.

## **엔드포인트**

### **유저 정보 가져오기**

로그인한 사용자의 정보를 불러옵니다. 응답에서 사용자가 비밀번호를 교체한지 3개월이 지낫는지, 정보 업데이트가 필요한지 여부를 Boolean 값으로 알려줍니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/lux/user/me
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**요청 예시**
```http
GET /api/v1/lux/user/me HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "root_user_id": 1,
    "first_name": "test",
    "last_name": "kim",
    "birthdate": "20240722",
    "gender": "M",
    "phone": "+821012345678",
    "is_phone_number_checked": true,
    "register_type": "E",
    "national_code": "KR",
    "need_personal_info_update": false,
    "need_to_pwd_change": true,
    "is_device_muted": true,
    "is_device_alim_talk_enabled": true,
    "is_basestation_alert_enabled": true
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | 가입된 유저 정보가 없습니다.|
| 401              | User is Deleted  | 회원탈퇴한 유저입니다.     |

```json
{
    "detail": "User is None"
}
```
:::



### **유저 정보 업데이트**

로그인한 사용자의 정보를 업데이트 합니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/root-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|


**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `first_name` <Badge type="info" text="optional" />| string    | 사용자의 이름(성 제외)|
| `last_name` <Badge type="info" text="optional" />              | string  | 사용자의 성     |
| `birthdate` <Badge type="info" text="optional" />| string  | 사용자의 생일 (yyyymmdd) <br> - 예시 : 19970101|
| `gender` <Badge type="info" text="optional" />              | string  | 사용자의 성별 <br> - M : 남성 <br> - F : 여성 <br> - N : 논바이너리 <br> - P : 알려주고 싶지 않음 |


**요청 예시**
```http
PATCH /api/v1/lux/user/root-user HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json

{
  "first_name": "james",
  "last_name": "kim",
  "birthdate": "19970101",
  "gender": "M"
}
```

**응답 예시**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 1,
  "first_name": "james",
  "last_name": "kim",
  "birthdate": "19970101",
  "gender": "M",
  "phone": "+821012345678",
  "is_phone_number_checked": true,
  "register_type": "E"
}
```
@tab <span class="error-tab">ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | User is None     | 유저 정보를 찾을 수 없습니다.|
| 401              | User is Deleted  | 삭제된 유저입니다.   |


```json
{
    "detail": "User is None"
}
```
:::

### **유저 정책 업데이트**

유저의 푸시 알림 및 마케팅 알림을 업데이트합니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/policy
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `is_push_agree` <Badge type="info" text="optional" />| boolean    | 푸시 동의|
| `is_marketing_agree` <Badge type="info" text="optional" />| boolean  | 마케팅 수신 동의     |

**요청 예시**
```http
PATCH /api/v1/lux/user/policy HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json

{
  "is_push_agree": true,
  "is_marketing_agree": true
}
```

**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "is_push_agree": true,
  "is_marketing_agree": true,
  "push_agree_date": "2024-10-28T07:47:53.563Z",
  "marketing_agree_date": "2024-10-28T07:47:53.563Z"   
}
```
@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User not found     | 가입된 유저 정보가 없습니다.|
| 404              | User policy not found  | 생성된 유저 정책이 없습니다.     |
| 409              | User policy update failed  | 유저의 푸시토큰이 존재하지않습니다.     |

```json
{
    "detail": "User policy update failed"
}
```
:::

### **유저 푸시 토큰 설정**

유저에게 푸시 알림을 보내기 위해 FCM 토큰을 서버에 저장합니다.

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/user/push/set-token
</div>

**Headers:**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters:**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `token` <Badge type="danger" text="required" />| string    | FCM 토큰|

**요청 예시:**
```http
POST /api/v1/lux/user/push/set-token HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json

{
  "token": string
}
```

**응답 예시:**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
string
```

@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Push permisson denied     | 푸시 정책에 동의하지 않았습니다.|
| 409              | User push token update failed  | 토큰 형식을 다시 확인해주세요.     |

```json
{
  "detail" : "User push token update failed"
}
```
:::


### **유저 자식 계정 생성 및 기기 등록**

유저의 자식(자녀) 계정을 생성하고 기기를 등록합니다. API 호출의 편의성을 위해 기기를 등록하는 과정이 합쳐져 있습니다. 

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/user/create-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `first_name` <Badge type="danger" text="required" />| string    | 생성할 자식 계정의 전체 이름입니다|
| `last_name` <Badge type="danger" text="required" />| string  | ~~생성할 자식 계정의 성입니다~~  빈 String 값을 보내주세요  |
| `birthdate` <Badge type="danger" text="required" />| string  | 생성할 자식 계정의 생년월일입니다 (yyyymmdd) <br> - 예시 : 19970101|
| `gender` <Badge type="danger" text="required" />| string  | 사용자의 성별 <br> - M : 남성 <br> - F : 여성 <br> - N : 논바이너리 <br> - P : 알려주고 싶지 않음 |
| `serial_code` <Badge type="danger" text="required" />| string  | 등록할 기기의 시리얼 코드 입니다   |
| `mac_id` <Badge type="danger" text="required" />| string  | 등록할 기기의 MAC 주소 입니다 (끝에 : 을 제외하고 4개의 문자 값을 대문자로 보내주세요)  |
| `unique_id` <Badge type="danger" text="required" />| string  | 등록할 기기의 uuid 입니다   |



**요청 예시:**
```http
POST /api/v1/lux/user/create-real-user HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "first_name": "test",
  "last_name": "",
  "birthdate": "19970101",
  "gender": "F",
  "serial_code": "SL20401000",
  "mac_id": "41AD",
  "unique_id": "unique"
}
```

**응답 예시:**
::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "real_user_id": 1,
  "first_name": "test",
  "last_name": "",
  "birthdate": "19970101",
  "gender": "F",
  "device_id": 1,
  "now_firmware_id": 1,
  "unique_id": "unique",
  "serial_code": "SL20401000",
  "device_alias": "string",
  "last_log_file_id": 0,
  "created_at": "2024-10-28T08:09:47.889Z"
}
```
@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 409              | Real user create failed| 자식 계정 생성 실패.|
| 400              | Serial code is not valid| 올바르지 않은 시리얼 코드입니다.|
| 401              | Not authorized user  | 권한이 없는 유저입니다.     |
| 404              | Not Found Device  | 해당 기기를 찾을 수 없습니다.     |
| 409              | Already Connected Device  | 이미 다른 유저에게 연결된 기기입니다.     |

```json
{
    "detail": "Already Connected Device"
}
```
:::


### **유저 자식 계정 조회**

유저의 자식(자녀) 계정 정보를 조회합니다. real_user_id 값은 /api/v1/lux/device/get-all-device 로 얻을 수 있습니다.

<div class="api-endpoint">
  <span class="api-method">GET</span>
  /api/v1/lux/user/real-user/{real_user_id}
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer    | 자식 계정의 id|


**요청 예시**
```http
GET https://app.nueyne.dev/api/v1/lux/user/real-user/1 HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 0,
  "root_user_id": 0,
  "first_name": "string",
  "last_name": "string",
  "birthdate": "string",
  "gender": "string"
}
```
@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 권한이 없는 유저입니다.|
| 404              | Real user is not found  | 자식 계정 정보를 찾을 수 없습니다.     |

```json
{
    "detail": "Real user is not found"
}
```
:::

### **유저 자식 정보 업데이트**

유저의 자식(자녀) 계정 정보를 업데이트합니다. 

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/update-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `id` <Badge type="danger" text="required" />| integer    | 업데이트할 자식 계정의 real_user_id 값입니다|
| `first_name` <Badge type="info" text="optional" />| string  | 업데이트할 자식 계정의 이름입니다     |
| `last_name` <Badge type="info" text="optional" />| string  | 업데이트할 자식 계정의 성입니다     |
| `birthdate` <Badge type="info" text="optional" />| string  | 업데이트할 자식 계정의 생년월일입니다 (yyyymmdd) <br> - 예시 : 19970101|
| `gender` <Badge type="info" text="optional" />| string  | 업데이트할 자식 계정의 성별입니다 <br> - M : 남성 <br> - F : 여성 <br> - N : 논바이너리 <br> - P : 알려주고 싶지 않음 |


**요청 예시**
```http
PATCH https://app.nueyne.dev/api/v1/lux/user/real-user/1 HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "id": 1,
  "first_name": "tester",
  "last_name": "john",
  "birthdate": "20010608",
  "gender": "P"
}
```

**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "id": 1,
  "root_user_id": 1,
  "first_name": "tester",
  "last_name": "john",
  "birthdate": "20010608",
  "gender": "P"
}
```
@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 권한이 없는 유저입니다.|
| 404              | Real user is not found  | 자식 계정 정보를 찾을 수 없습니다.     |

```json
{
    "detail": "User is None"
}
```
:::


### **유저 전화번호 업데이트**

유저의 전화번호 정보를 업데이트합니다. 
SMS 전송 호출 -> 유저 전화번호 업데이트 API 호출

<div class="api-endpoint">
  <span class="api-method">POST</span>
  /api/v1/lux/user/change-phone
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `phone` <Badge type="danger" text="required" />| string    | 변경할 새로운 전화번호입니다.|
| `validnum` <Badge type="info" text="optional" />| string  | SMS 인증 번호 입니다.     |

**요청 예시**
```http
POST https://app.nueyne.dev/api/v1/lux/user/change-phone HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "phone": "+821012345678",
  "validnum": "123456"
}
```

**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200,
  "message": "Root user phone updated"
}
```
@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 400              | Validation code is expired     | 인증번호가 만료되었습니다.|
| 400              | Validation code is invalid  | 인증번호가 일치하지않습니다.     |
| 403              | User previously deleted  | 탈퇴한 사용자입니다.     |
| 409              | Phone number is already registered  | 이미 사용중인 전화번호입니다.     |

```json
{
    "detail": "Validation code is expired"
}
```
:::

### **유저 알림 정보 업데이트**

유저의 알림 정보를 업데이트합니다. 모든 알림의 default 값은 false입니다.

<div class="api-endpoint">
  <span class="api-method">PATCH</span>
  /api/v1/lux/user/notification
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Body Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `is_device_muted` <Badge type="danger" text="required" />| boolean    | 위드녹스 디바이스 음소거 모드 활성화 |
| `is_device_alim_talk_enabled` <Badge type="danger" text="required" />| boolean  | 위드녹스 디바이스 전극 접촉 카카오톡 알림 활성화     |
| `is_basestation_alert_enabled` <Badge type="danger" text="required" />| boolean  | 베이스 스테이션 센서 알림 활성화     |



**요청 예시**
```http
PATCH https://app.nueyne.dev/api/v1/lux/user/notification HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
    "is_device_muted": 1,
    "is_device_alim_talk_enabled": 1,
    "is_basestation_alert_enabled": 1
}
```

**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
    "is_device_muted": 1,
    "is_device_alim_talk_enabled": 1,
    "is_basestation_alert_enabled": 1
}
```
@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | User not found    | 유저 정보를 찾을 수 없습니다.|
| 409              | User notification update failed  | 유저 알림 업데이트 실패(서버 문의).     |

```json
{
    "detail": "User not found"
}
```
:::

### **유저 자식 계정 삭제 및 기기 등록 해제**

유저의 자식(자녀) 계정을 삭제하고 등록된 기기를 해제합니다.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/lux/user/delete-real-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**Parameters**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `real_user_id` <Badge type="danger" text="required" />| integer| 삭제할 자식 계정의 id 입니다|
| `unique_id` <Badge type="danger" text="required" />| string| 연결 해제할 기기의 unique_id 입니다|

**요청 예시**
```http
DELETE /api/v1/lux/user/delete-real-user HTTPS
Authorization: Bearer your_token_here
Content-Type: application/json
{
  "real_user_id": 1,
  "unique_id": "string",
}
```

**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200,
  "message": "Real user deleted successfully",
}
```

@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 401              | Not authorized user     | 권한이 없는 유저입니다.|
| 404              | Real user is not found  | 자식 계정 정보를 찾을 수 없습니다.|
| 409              | Real user delete failed  | 자식 계정 삭제 실패.|

```json
{
    "detail": "Real user is not found"
}
```
:::

### **회원 탈퇴**

유저가 회원탈퇴 또는 삭제할때 사용합니다.

<div class="api-endpoint">
  <span class="api-method">DELETE</span>
  /api/v1/lux/user/root-user
</div>

**Headers**

| Name | Type           | description             |
|------------------|------------------|-------------------------|
| `Authorization` <Badge type="danger" text="required" />| Bearer    | access_token|

**요청 예시**
```http
DELETE /api/v1/lux/user/root-user HTTPS
Authorization: Bearer your_token_here
```

**응답 예시**

::: tabs

@tab <span class="ok-tab">200 OK</span>

```json
{
  "statusCode": 200, 
  "message": "Root user deleted"
}
```

@tab <span class="error-tab"> ERROR</span>

**오류 응답**

HTTP 상태 코드별로 API 상태 코드와 메시지를 제공합니다. 아래의 표를 참고하세요.

| HTTP status code | detail           | description             |
|------------------|------------------|-------------------------|
| 404              | Sign in type is not found| 유저가 가입한 형식(이메일, 소셜)을 찾을 수 없습니다.|


```json
{
    "detail": "Sign in type is not found"
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