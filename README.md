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
- Handlebars
- Socket.io

## Installation and Testing

Process of installation (is not necessary if you have this proyect)

* Initialize a new npm project: `npm init -y`

* Modify package.json: `"test": "node --watch src/app.js"`

## The following installation is required:

* Install: `npm install express express-handlebars socket.io express-validator`

## Testing

```bash
  npm start
```

## In the browser

```http
  GET http://localhost:8080/
```

```http
  GET http://localhost:8080/realtimeproducts
```

## In Postman:

```http
  POST http://localhost:8080/add-product
```

| Parameter      | Type      | Description                     |
|:---------------|:----------|:--------------------------------|
| `name`         | `string`  | **Required**. Your product name |
| `unitPrice`    | `number`  | **Required**. Your unit price   |
| `unitsInStock` | `number`  | **Required**. Your stock        |
| `discontinued` | `boolean` | **Required**. Your check        |

```http
  PUT http://localhost:8080/delete-product
```

| Parameter      | Type      | Description                     |
|:---------------|:----------|:--------------------------------|
| `name`         | `string`  | **Required**. Your product name |


## Authors

- [@Juan Ignacio Caprioli (ChanoChoca)](https://github.com/ChanoChoca)


## Badges

[//]: # (Add badges from somewhere like: [shields.io]&#40;https://shields.io/&#41;)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
