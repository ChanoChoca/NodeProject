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

## Carts

```http
  POST http://localhost:8080/api/carts/
```

```http
  GET http://localhost:8080/api/carts/:cid
```

```http
  POST http://localhost:8080/api/carts/:cid/product/:pid
```

| Parameter  | Type     | Description                        |
|:-----------|:---------|:-----------------------------------|
| `id`       | `number` | **Not required**. Your cart id key |
| `products` | `array`  | **Required**. Your products        |

### For products parameter
| Parameter   | Type     | Description                                   |
|:------------|:---------|:----------------------------------------------|
| `productId` | `number` | **Not required**. Your product id key         |
| `quantity`  | `array`  | **Required only in `'/' POST`**. Your quantity|

### Note: `quantity` must be > 0.

## Authors

- [@Juan Ignacio Caprioli (ChanoChoca)](https://github.com/ChanoChoca)


## Badges

[//]: # (Add badges from somewhere like: [shields.io]&#40;https://shields.io/&#41;)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
