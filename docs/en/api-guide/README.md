# **API Guide**

## **Introduction**
Nu Eyne Developers provides APIs that can be used within the app.

The Nu Eyne Developers API is a REST API that communicates over HTTPS, allowing it to be accessed on any platform that supports HTTPS. A valid authentication token is required to call the API, which can be obtained through the login API provided on each platform. For test accounts to use during development, please contact the administrator, @Jeongtae Kim.

## **Endpoint**
The format for endpoints in the Nu Eyne Developers API is as follows:

```
https://{host}/{api-path}?{query-string}  
```

- `host`: The API server host, which can be one of the following:
    - dev: app.nueyne.dev
    - prod: prod.nueyne.dev
- `api-path`: The path of the specific API being called. You can find details for each endpoint in the API documentation, and API versioning is included in this path.
- `path-variable`: is a variable within the path, represented by {variable_name}, which is replaced by a specific value.

## **Requests**
Nu Eyne Developers API requests follow these guidelines:

- All API requests are transmitted over HTTPS.
- Parameters can be included as query parameters or within the JSON request body.

## **Request Headers**

For APIs that use a JSON request body for parameters, set the HTTP `Content-Type` header to "application/json."