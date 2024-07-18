# Fossilize

[Back to README](../README.md)

The term "fossilize" refers to the method that parses a file annotated with DinoDocs annotations into `Fossils`, which represent the validation schema in JSON format.

## fossilize Method

The `fossilize` method reads a file and extracts the DinoDocs annotations, converting them into a structured JSON schema.

## Syntax

```javascript
import { fossilize } from "@tralse-jr/dino-docs-api";

const result = await fossilize("./dino.mjs");
```

### Parameters

- `filename` (string): The name of the file to read.

### Returns

- `Promise<Fossils[]>`: A promise that resolves to an array of objects, each adhering to the `Fossils` interface. This array represents the extracted validation schemas.

### Usage

Imagine you have a file like this:

```javascript
//dino.mjs

import { Router } from "express";

const router = Router();

/**
 * @dinoValidator GET /users Retrieve a list of users.
 * @dinoQuery {string} sort - The sorting criteria. (isIn=name|age)
 */
router.get("/users", (req, res) => {
  const { sort } = req.query;
  // Some codes
});

export default router;
```

And this is the test file:

```javascript
import { fossilize } from "@tralse-jr/dino-docs-api";

const result = await fossilize("./dino.mjs");
console.log(JSON.stringify(result, null, 2));
```

### Example Output

Here's an example of what the output might look like:

```json
[
  {
    "method": "GET",
    "endpoint": "/users",
    "description": "Retrieve a list of users.",
    "params": [],
    "query": [
      {
        "name": "sort",
        "type": "string",
        "constraints": {
          "isIn": ["name", "age"]
        }
      }
    ]
  }
]
```

## Output Format

The output defines what is described in the DinoDoc annotations. Here are the details of the output JSON structure:

- **method** (string): The HTTP request method (e.g., GET, POST, etc.).
- **endpoint** (string): The endpoint path.
- **description** (string): A brief description of the endpoint's functionality.
- **params** (array): An array of parameter objects, each containing:
  - **name** (string): The name of the parameter.
  - **type** (string): The data type of the parameter.
  - **constraints** (object): An object specifying validation constraints for the parameter.
- **query** (array): An array of query string objects, each containing:
  - **name** (string): The name of the query parameter.
  - **type** (string): The data type of the query parameter.
  - **constraints** (object): An object specifying validation constraints for the query parameter.
- **body** (array): An array of body objects, each containing:
  - **name** (string): The name of the body field.
  - **type** (string): The data type of the body field.
  - **constraints** (object): An object specifying validation constraints for the body field.

## Constraints Output Format

The following table outlines the valid constraints and their JSON representations, which can be a part of constraints array:

```json
{
  "constraints": {
    "enum": ["a", "b", "c"],
    "range": {
      "isInt": { "options": { "min": 1, "max": 10 } }
    },
    "regex": {
      "matches": "/pattern/"
    },
    "minlen": {
      "isLength": { "options": { "min": 5 } }
    },
    "maxlen": {
      "isLength": { "options": { "max": 10 } }
    },
    "min": {
      "isFloat": { "options": { "min": 1.0 } }
    },
    "max": {
      "isFloat": { "options": { "max": 10.0 } }
    },
    "isEmail": true,
    "isURL": true,
    "isInt": true,
    "isFloat": true,
    "isBoolean": true,
    "contains": "value",
    "equals": "value",
    "isAfter": "YYYY-MM-DD",
    "isBefore": "YYYY-MM-DD",
    "isIn": ["value1", "value2"],
    "isCreditCard": true,
    "isDate": true,
    "isAlpha": true,
    "isAlphanumeric": true,
    "isAscii": true,
    "isBase64": true,
    "isDataURI": true,
    "isEmpty": true,
    "isHexColor": true,
    "isIP": true,
    "isISBN": true,
    "isMACAddress": true,
    "isUUID": true,
    "isUppercase": true,
    "isLowercase": true
  }
}
```

### Detailed Description

- **enum**: Specifies a set of allowed values.

```json
{
  "enum": ["a", "b", "c"]
}
```

- **isIn**: Similar to enum. Ensures the value is within a set of allowed values.

```json
{
"isIn": ["value1", "value2"]
}
```

- **range**: Specifies an integer range.

```json
{
  "isInt": { "options": { "min": 1, "max": 10 } }
}
```

- **matches**: Specifies a regular expression pattern.

```json
{
  "matches": "/pattern/"
}
```

- **isLength**: Specifies the length constraints of a string.

For minimum length:

```json
{
  "isLength": { "options": { "min": 5 } }
}
```

For maximum length:

```json
{
  "isLength": { "options": { "max": 10 } }
}
```

- **min**: Specifies the minimum value of a float or integer.

```json
{
  "isFloat": { "options": { "min": 1.0 } }
}
```

- **max**: Specifies the maximum value of a float or integer.

```json
{
  "isFloat": { "options": { "max": 10.0 } }
}
```

- **contains**: Ensures the value contains a specific substring.

```json
{
  "contains": "value"
}
```

- **equals**: Ensures the value equals a specific value.

```json
{
  "equals": "value"
}
```

- **isAfter**: Ensures the date is after a specific date.

```json
{
  "isAfter": "YYYY-MM-DD"
}
```

- **isBefore**: Ensures the date is before a specific date.

```json
{
  "isBefore": "YYYY-MM-DD"
}
```

- **isEmail**: Validates an email format.

```json
{
  "isEmail": true
}
```

- **isURL**: Validates a URL format.

```json
{
  "isURL": true
}
```

- **isInt**: Validates an integer format.

```json
{
  "isInt": true
}
```

isFloat: Validates a float format.

```json
{
  "isFloat": true
}
```

isBoolean: Validates a boolean format.

```json
{
  "isBoolean": true
}
```

isCreditCard: Validates a credit card format.

```json
{
  "isCreditCard": true
}
```

isDate: Validates a date format.

```json
{
  "isDate": true
}
```

isAlpha: Ensures the value contains only alphabetic characters.

```json
{
  "isAlpha": true
}
```

isAlphanumeric: Ensures the value contains only alphanumeric characters.

```json
{
  "isAlphanumeric": true
}
```

isAscii: Ensures the value contains only ASCII characters.

```json
{
  "isAscii": true
}
```

isBase64: Ensures the value is a Base64 encoded string.

```json
{
  "isBase64": true
}
```

isDataURI: Ensures the value is a data URI.

```json
{
  "isDataURI": true
}
```

isEmpty: Ensures the value is empty.

```json
{
  "isEmpty": true
}
```

isHexColor: Ensures the value is a hex color.

```json
{
  "isHexColor": true
}
```

isIP: Ensures the value is an IP address.

```json
{
  "isIP": true
}
```

isISBN: Ensures the value is an ISBN.

```json
{
  "isISBN": true
}
```

isMACAddress: Ensures the value is a MAC address.

```json
{
  "isMACAddress": true
}
```

isUUID: Ensures the value is a UUID.

```json
{
  "isUUID": true
}
```

isUppercase: Ensures the value is uppercase.

```json
{
  "isUppercase": true
}
```

isLowercase: Ensures the value is lowercase.

```json
{
  "isLowercase": true
}
```
