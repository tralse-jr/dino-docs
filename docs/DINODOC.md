# DinoDoc JSDoc

[Back to README](../README.md)

**DinoDoc JSDoc** is a specialized JSDoc extension designed to define the types and validations of your Express API. It provides various signature tags to document your API endpoints comprehensively, including request methods, parameters, queries, and request bodies.

## @dinoValidator Header Tag

The `@dinoValidator` tag documents an API endpoint's essential details, including the HTTP method, endpoint path, and a brief description of its functionality.

### dinoValidator Syntax

```text
@dinoValidator <method> <endpoint> <description>
```

- **method (required):** The HTTP request method, such as GET, POST, PUT, PATCH, or DELETE.
- **endpoint (required):** The route endpoint. If the route is the root, specify /. This field must not be left blank.
- **description (optional):** A brief description of what the endpoint does.

### dinoValidator Examples

#### Basic Example

```javascript
/**
 * @dinoValidator GET /
 */
```

#### Example with Endpoints

```javascript
/**
 * @dinoValidator GET /users/info/:id
 */
```

#### Example with description

```javascript
/**
 * @dinoValidator GET /users Retrieve a list of users.
 */
```

## @dinoBody Tag

The `@dinoBody` tag documents the structure and constraints of the request body, specifying data types, field names, descriptions, and validation rules.

### dinoBody Syntax

```text
@dinoBody {<type>} <key> - <description> (<constraints>)
```

- **type (required):** The data type of the field, such as string, number, boolean, etc.
- **key (required):** The name of the field. Enclose it with square braces (`[]`) if it is an optional field.
- **description (optional):** A brief description of the field.
- **constraints (optional):** Any constraints or validation rules that apply to the field, specified in parentheses.

### dinoBody Example

#### Basic Example

```javascript
/**
 * @dinoValidator GET /
 * @dinoBody {number} age
 */
```

#### Example with Array Type

```javascript
/**
 * @dinoValidator GET /
 * @dinoBody {number[]} lottoResults
 */
```

#### Example with Optional Parameter

```javascript
/**
 * @dinoValidator GET /
 * @dinoBody {number[]} [lottoResults]
 */
```

#### Example with Description and Constraints

```javascript
/**
 * @dinoValidator GET /
 * @dinoBody {string} username - The username of the user. (minlen=3,maxlen=30,alnum)
 * @dinoBody {string} email - The email address of the user. (email)
 * @dinoBody {number} age - The age of the user. (min=18, max=65)
 */
```

## @dinoParams Tag

The `@dinoParams` tag documents parameters that appear in the endpoint's path, providing insights into expected parameters and their requirements.

### dinoParams Syntax

```text
@dinoParams {<type>} <key> - <description> (<constraints>)
```

- **type (required):** The data type of the field, such as string, number, boolean, etc.
- **key (required):** The name of the field. Enclose it with square braces (`[]`) if it is an optional field.
- **description (optional):** A brief description of the field.
- **constraints (optional):** Any constraints or validation rules that apply to the field, specified within parentheses.

### dinoParams Example

```javascript
/**
 * @dinoParams {string} userId - The ID of the user.
 */
```

## @dinoQuery Tag

The `@dinoQuery` tag documents query parameters that can be included in the endpoint's URL, specifying optional and required parameters along with their constraints.

### dinoQuery Syntax

```text
@dinoQuery {<type>} <key> - <description> (<constraints>)
```

- **type (required):** The data type of the field, such as string, number, boolean, etc.
- **key (required):** The name of the field. Enclose it with square braces (`[]`) if it is an optional field.
- **description (optional):** A brief description of the field.
- **constraints (optional):** Any constraints or validation rules that apply to the field, specified in parentheses.

### dinoQuery Example

```javascript
/**
- @dinoQuery {string} [search] - The search term to filter users by name.
*/
```

## Constraints Specifications

Here's a detailed list of constraints available for use within `@dinoBody`, `@dinoParams`, and `@dinoQuery` tags to define validation rules for your Express API's request bodies, parameters, and query strings:

| Name         | Syntax        | Type    | description                                    |
| ------------ | ------------- | ------- | ---------------------------------------------- |
| `enum`       | enum=a\|b     | any     | Specifies a set of allowed values              |
| `isIn`       | isIn=a\|b     | any     | Similar to enum, specifies allowed values      |
| `range`      | range=min-max | integer | Specifies a range for integers                 |
| `regex`      | regex=/REGEX/ | regex   | Specifies a regex pattern                      |
| `minlen`     | minlen=a      | integer | Specifies minimum length for strings           |
| `maxlen`     | maxlen=a      | integer | Specifies maximum length for strings           |
| `min`        | min=a         | float   | Specifies a minimum value for floats           |
| `max`        | max=a         | float   | Specifies a maximum value for floats           |
| `contains`   | contains=a    | any     | Checks if string contains a value              |
| `equals`     | equals=a      | any     | Checks if value equals specified value         |
| `afterdate`  | afterdate=a   | string  | Checks if date string is after specified date  |
| `beforedate` | beforedate=a  | string  | Checks if date string is before specified date |
| `email`      | email         | none    | Validates an email address                     |
| `url`        | url           | none    | Validates a URL                                |
| `int`        | int           | none    | Validates an integer                           |
| `float`      | float         | none    | Validates a float                              |
| `bool`       | bool          | none    | Validates a boolean                            |
| `creditcard` | creditcard    | none    | Validates a credit card number                 |
| `date`       | date          | none    | Validates a date                               |
| `alpha`      | alpha         | none    | Validates alphabetic characters                |
| `alnum`      | alnum         | none    | Validates alnum characters                     |
| `ascii`      | ascii         | none    | Validates ASCII characters                     |
| `base64`     | base64        | none    | Validates a Base64 string                      |
| `datauri`    | datauri       | none    | Validates a data URI                           |
| `empty`      | empty         | none    | Checks if value is empty                       |
| `hex`        | hex           | none    | Validates a hex color                          |
| `ip`         | ip            | none    | Validates an IP address                        |
| `isbn`       | isbn          | none    | Validates an ISBN                              |
| `mac`        | mac           | none    | Validates a MAC address                        |
| `uuid`       | uuid          | none    | Validates a UUID                               |
| `ucase`      | ucase         | none    | Checks if value is uppercase                   |
| `lcase`      | lcase         | none    | Checks if value is lowercase                   |

These constraints can be used within the `@dinoBody`, `@dinoParams`, and `@dinoQuery` tags to define validation rules for your Express API's request bodies, parameters, and query strings. Here's an example of how these constraints can be used:

### Example Usage

**NOTE:** To include multiple constraints, just separate them with a comma.

```javascript
/**
 * @dinoValidator POST /users Create a new user.
 * @dinoBody {string} username - The username of the user. (minlen=3,maxlen=30,alnum)
 * @dinoBody {string} email - The email address of the user. (email)
 * @dinoBody {number} age - The age of the user. (min=18, max=65)
 * @dinoQuery {string} sort - The sorting criteria. (isIn=name|age)
 * @dinoQuery {string} cardId - The card ID. (creditcard)
 */
```
