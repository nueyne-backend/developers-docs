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