import {
  body,
  query,
  param,
  validationResult,
  ValidationChain,
} from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ERROR_CODES } from "./error-codes";

// Helper function to create error messages
const createErrorMessage = (key: string, message: string, code: string) => ({
  msg: `${key} ${message}`,
  code,
});

// Apply constraints based on type
const applyConstraints = (
  validator: ValidationChain,
  key: string,
  constraints: { [key: string]: any }
) => {
  Object.entries(constraints).forEach(([constraint, value]) => {
    switch (constraint) {
      case "enum":
      case "isIn":
        validator
          .isIn(value)
          .withMessage(
            createErrorMessage(
              key,
              `must be one of: ${value.join(", ")}.`,
              ERROR_CODES[constraint.toUpperCase()]
            )
          );
        break;
      case "isInt":
      case "isFloat":
        validator[constraint](value).withMessage(
          createErrorMessage(
            key,
            `must be ${constraint === "isInt" ? "an integer" : "a float"}${
              value.min !== undefined && value.max !== undefined
                ? ` between ${value.min} and ${value.max}`
                : ""
            }.`,
            ERROR_CODES[constraint.toUpperCase()]
          )
        );
        break;
      case "matches":
      case "isLength":
      case "equals":
      case "isAfter":
      case "isBefore":
        validator[constraint](value).withMessage(
          createErrorMessage(
            key,
            `must ${constraint === "matches" ? "match the pattern" : ""} ${
              constraint === "isLength"
                ? `be between ${value.min} and ${value.max} characters`
                : value
            }.`,
            ERROR_CODES[constraint.toUpperCase()]
          )
        );
        break;
      // default:
      //   validator[constraint]().withMessage(
      //     createErrorMessage(
      //       key,
      //       `must be a valid ${constraint}.`,
      //       ERROR_CODES[constraint.toUpperCase()]
      //     )
      //   );
      //   break;
    }
  });
  return validator;
};

// Create validation chain for schema
const createValidationChain = (
  locationValidator: (
    fields?: string | string[] | undefined,
    message?: any
  ) => ValidationChain,
  schema: any[]
) => {
  const validators: ValidationChain[] = [];

  schema.forEach(
    ({ key, type, optional = false, constraints = {}, nested }) => {
      let validator = locationValidator(key);

      if (optional) {
        validator = validator.optional({ checkFalsy: true });
      } else {
        validator = validator
          .exists({ checkFalsy: true })
          .withMessage(
            createErrorMessage(key, "is required.", ERROR_CODES.REQUIRED)
          );
      }

      const isArray = type.endsWith("[]");
      const cleanType = type.replace("[]", "").toLowerCase();

      if (isArray) {
        validator = validator
          .isArray()
          .withMessage(
            createErrorMessage(key, "must be an array.", ERROR_CODES.ARRAY)
          );

        if (cleanType === "object") {
          validator = validator.custom((value) => {
            if (
              Array.isArray(value) &&
              value.every((item) => typeof item === "object")
            ) {
              return true;
            }
            throw new Error(
              createErrorMessage(
                key,
                "must be an array of objects.",
                ERROR_CODES.ARR_OBJECT
              ).msg
            );
          });
          if (nested) {
            nested.forEach((nestedSchema: any) => {
              validators.push(
                ...createValidationChain(
                  (field) => locationValidator(`${key}.*.${field}`),
                  [nestedSchema]
                )
              );
            });
          }
        } else if (cleanType === "string") {
          validator = validator.custom((value) => {
            if (
              Array.isArray(value) &&
              value.every((item) => typeof item === "string")
            ) {
              return true;
            }
            throw new Error(
              createErrorMessage(
                key,
                "must be an array of strings.",
                ERROR_CODES.ARR_STRING
              ).msg
            );
          });
        } else if (cleanType === "number") {
          validator = validator.custom((value) => {
            if (
              Array.isArray(value) &&
              value.every((item) => typeof item === "number")
            ) {
              return true;
            }
            throw new Error(
              createErrorMessage(
                key,
                "must be an array of numbers.",
                ERROR_CODES.ARR_NUMBER
              ).msg
            );
          });
        } else if (cleanType === "boolean") {
          validator = validator.custom((value) => {
            if (
              Array.isArray(value) &&
              value.every((item) => typeof item === "boolean")
            ) {
              return true;
            }
            throw new Error(
              createErrorMessage(
                key,
                "must be an array of boolean values.",
                ERROR_CODES.ARR_NUMBER
              ).msg
            );
          });
        } else {
          validator = validator.custom((value) => {
            if (Array.isArray(value)) {
              return true;
            }
            throw new Error(
              createErrorMessage(
                key,
                "must be an array.",
                ERROR_CODES.ARRAY
              ).msg
            );
          });
        }
      } else {
        switch (cleanType) {
          case "string":
            validator = validator
              .isString()
              .withMessage(
                createErrorMessage(key, "must be a string.", ERROR_CODES.STRING)
              );
            break;
          case "number":
            validator = validator
              .isNumeric()
              .withMessage(
                createErrorMessage(key, "must be a number.", ERROR_CODES.NUMBER)
              );
            break;
          case "boolean":
            validator = validator
              .isBoolean()
              .withMessage(
                createErrorMessage(
                  key,
                  "must be a boolean.",
                  ERROR_CODES.BOOLEAN
                )
              );
            break;
          case "date":
            validator = validator
              .isISO8601()
              .withMessage(
                createErrorMessage(
                  key,
                  "must be a valid date.",
                  ERROR_CODES.DATE
                )
              );
            break;
          case "object":
            validator = validator
              .isObject()
              .withMessage(
                createErrorMessage(
                  key,
                  "must be an object.",
                  ERROR_CODES.OBJECT
                )
              );
            break;
          default:
            throw new Error(`Unknown type: ${cleanType}`);
        }
      }

      applyConstraints(validator, key, constraints);
      validators.push(validator);
    }
  );

  return validators;
};

// Main function to convert schema to express-validator middleware
const fossilToExpressValidator = (schema: {
  body?: any[];
  query?: any[];
  params?: any[];
}) => {
  const validators: ValidationChain[] = [];

  if (schema.body) {
    validators.push(...createValidationChain(body, schema.body));
  }
  if (schema.query) {
    validators.push(...createValidationChain(query, schema.query));
  }
  if (schema.params) {
    validators.push(...createValidationChain(param, schema.params));
  }

  return [
    ...validators,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error: any) => ({
            field: error.param,
            message: error.msg,
            code: error.msg.code,
            value: error.value,
          })),
        });
      }
      next();
    },
  ];
};

export { fossilToExpressValidator };
