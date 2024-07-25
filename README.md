# Node project

A Node project made with Express, where it is carried out thanks to the React course from Coderhouse

[//]: # (## Screenshots)

[//]: # (![WoT App Screenshot]&#40;images/img-home.png&#41;)

[//]: # (![WoT App Screenshot]&#40;images/img-products.png&#41;)

[//]: # (![WoT App Screenshot]&#40;images/img-cart.png&#41;)


## Tools Used

- npm
- Node
- Express


## Installation and Testing

Process of installation (is not necessary if you have this proyect)

* Initialize a new npm project: `npm init -y`

* Modify package.json: `"test": "node --watch src/app.js"`

The following installation is required:

* Install Express: `npm install express`

Testing

```bash
  npm run test
```

# In Postman:

## Products

```http
  GET http://localhost:8080/api/products/
```

```http
  GET http://localhost:8080/api/products/:pid
```

```http
  POST http://localhost:8080/api/products/
```

```http
  PUT http://localhost:8080/api/products/:pid
```

```http
  DELETE http://localhost:8080/api/products/:pid
```

| Parameter     | Type      | Description                           |
|:--------------|:----------|:--------------------------------------|
| `id`          | `number`  | **Not required**. Your product id key |
| `title`       | `string`  | **Required**. Your title              |
| `description` | `string`  | **Required**. Your description        |
| `code`        | `string`  | **Required**. Your code               |
| `price`       | `number`  | **Required**. Your price              |
| `status`      | `boolean` | **Not required**. Your status         |
| `stock`       | `number`  | **Required**. Your stock              |
| `category`    | `string`  | **Required**. Your category           |
| `thumbnails`  | `array`   | **Not required**. Your thumbnails     |

### Note: `price` and `stock` must be >= 0.
