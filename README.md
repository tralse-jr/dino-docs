# 🦖 DinoDocs API

[![NPM Version](https://img.shields.io/npm/v/%40tralsejr%2Fdino-docs-api)](https://npmjs.org/package/@tralsejr/dino-docs-api)
[![NPM Downloads](https://img.shields.io/npm/dm/%40tralsejr%2Fdino-docs-api.svg)](https://npmjs.org/package/%40tralsejr%2Fdino-docs-api)

Welcome to **DinoDocs API** – the ultimate tool for combining JSDoc documentation with middleware validation for your Express applications. DinoDocs API makes your APIs clear and reliable, just like a T-Rex’s roar. 🦕

## 🌟 Features

- **Integrated Documentation and Validation**: Seamlessly combine your API documentation with validation rules in one place.
- **Schema Generation**: Automatically generate JSON schemas from your DinoDocs documentation.
- **DinoDocs API Kits**: Utilize DinoDocs API Kits to transform the generated schema into implemented validation.

## 📦 Installation

To add DinoDocs API to your project, run:

```bash
npm install @tralsejr/dino-docs-api
```

## 🚀 Usage

Transform your Express application with DinoDocs API for better documentation and validation.

### Step 1: Before DinoDocs API

Here's how a basic Express application looks without DinoDocs API. You have your routes and middleware, but the documentation and validation are separate and not automatically aligned:

```javascript
import express from "express";
import { validationMiddleware } from "./middleware.mjs";
import rootController from "./controllers/root.mjs";

const app = express();

app.use(express.json());

/**
 * @api {get} / Root route
 * @apiName GetRoot
 * @apiGroup Root
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "message": "Root route accessed successfully."
 *   }
 */
app.get("/", validationMiddleware, rootController);

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
```

### Step 2: Adding DinoDocs API

With DinoDocs API, you can document and validate your routes simultaneously. This integration ensures your documentation is always in sync with your validation logic.

Here’s an enhanced version with DinoDocs API:

```javascript
import express from "express";
import { validationMiddleware } from "./middleware.mjs";
import rootController from "./controllers/root.mjs";

const app = express();

app.use(express.json());

/**
 * @dinoValidator GET / - Root route.
 * @dinoBody {number} foo - This is foo. (range=1-100)
 * @dinoParams {string} bar - This is bar.
 * @dinoQuery {string} [zen] - Optional query parameter.
 */
app.get("/", validationMiddleware, rootController);

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
```

### Step 3: Generating Documentation Schema

To generate a JSON schema from your DinoDocs documentation, use the `fossilize` function. This function converts your documentation into a schema that can be used for further validation.

```javascript
// test.mjs

import { fossilize } from "@tralsejr/dino-docs-api";

const result = await fossilize("./app.mjs");
console.log(JSON.stringify(result, null, 2));
```

#### Example Output

After running the fossilize function, you will get a JSON schema representing your API documentation and validation rules:

```json
[
  {
    "method": "GET",
    "path": "/",
    "description": "Root route.",
    "body": [
      {
        "key": "foo",
        "type": "number",
        "optional": false,
        "description": "This is foo.",
        "constraints": {
          "isInt": {
            "options": {
              "min": 1,
              "max": 100
            }
          }
        }
      }
    ],
    "params": [
      {
        "key": "bar",
        "type": "string",
        "optional": false,
        "description": "This is bar."
      }
    ],
    "query": [
      {
        "key": "zen",
        "type": "string",
        "optional": true,
        "description": "Optional query parameter."
      }
    ]
  }
]
```

### Step 4: Implementing Validation with JSDoc API Kits

Transform the generated schema into actual validation logic in your API with our [JSDoc API Kits](./docs/APIKITS.md).

## 📖 Resources

[Documentation for DinoDocs JSDoc](./docs/DINODOC.md)
[Documentation for the fossilize method](./docs/FOSSILIZE.md)

## 🎉 Contribute

Want to help? We welcome contributions! If you have suggestions, bug reports, or improvements, please open an issue or submit a pull request on GitHub.

## 📝 License

DinoDocs API is licensed under the [MIT License](./LICENSE).

With DinoDocs API, your API documentation will be as legendary as a dinosaur. 🌟🦖
