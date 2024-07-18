# API Kits

[Back to README](../README.md)

Welcome to DinoDoc API Kits! We are presenting you some use cases of our Fossils that can make a significant use in your development as kits.

## fossilsToExpressMiddleware Method

This method converts an array of Fossils into Express.js validator middleware.

### Usage

Create an Express app and use the middleware:

```js
// app.mjs
import express from "express";
import { fossilsToExpressMiddleware } from "@tralse-jr/dino-docs-api/kits";
import { fossilize } from "@tralse-jr/dino-docs-api";

const app = express();

const baseRoutePath = "/api";

const fossils = await fossilize("./app.mjs");
fossilsToExpressMiddleware(app, fossils, baseRoutePath);

/**
 * @dinoValidator GET /
 * @dinoBody {string} name
 */
app.get(baseRoutePath + "/:name", (req, res) => {
  res.send(`Hello, ${req.params.name}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### Parameters

- `app` (Express): The Express application instance.
- `fossils` (Fossils[]): An array of Fossils containing the route information and validators.
- `baseRoutePath` (string, optional): The base path for the routes.
