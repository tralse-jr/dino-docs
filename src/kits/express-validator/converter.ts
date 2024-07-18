import {
  body,
  query,
  param,
  validationResult,
  FieldMessageFactory,
  ValidationChain,
} from "express-validator";
import { DinoDocsBody, Fossils } from "../../types";
import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "express-validator/lib/base";
import { ERROR_CODES } from "./error-codes";

// Helper function for error messages
const createErrorMessage = (key: string, message: string, code: string) => ({
  msg: `${key} ${message}`,
  code,
});

// Create validation chain
const createValidationChain = (
  locationValidator: (
    fields?: string | string[] | undefined,
    message?: FieldMessageFactory | ErrorMessage | undefined
  ) => ValidationChain,
  key: string,
  contents: DinoDocsBody
) => {
  const validators: ValidationChain[] = [];
  const { type, optional = false, constraints = {} } = contents;

  if (!optional) {
    validators.push(
      locationValidator(key)
        .exists({ checkFalsy: true })
        .withMessage(
          createErrorMessage(key, "is required.", ERROR_CODES.REQUIRED)
        )
    );
  } else {
    validators.push(locationValidator(key).optional({ checkFalsy: true }));
  }

  const isArray = type.endsWith("[]");
  const cleanType = type.replace("[]", "").toLowerCase();

  if (isArray) {
    validators.push(
      locationValidator(key)
        .isArray()
        .withMessage(
          createErrorMessage(key, "must be an array.", ERROR_CODES.ARRAY)
        )
    );
  }

  switch (cleanType) {
    case "string":
      validators.push(
        locationValidator(key)
          .isString()
          .withMessage(
            createErrorMessage(key, "must be a string.", ERROR_CODES.STRING)
          )
      );
      break;
    case "number":
      validators.push(
        locationValidator(key)
          .isNumeric()
          .withMessage(
            createErrorMessage(key, "must be a number.", ERROR_CODES.NUMBER)
          )
      );
      break;
    case "boolean":
      validators.push(
        locationValidator(key)
          .isBoolean()
          .withMessage(
            createErrorMessage(key, "must be a boolean.", ERROR_CODES.BOOLEAN)
          )
      );
      break;
    case "date":
      validators.push(
        locationValidator(key)
          .isDate()
          .withMessage(
            createErrorMessage(key, "must be a valid date.", ERROR_CODES.DATE)
          )
      );
      break;
    case "object":
      validators.push(
        locationValidator(key)
          .isObject()
          .withMessage(
            createErrorMessage(key, "must be an object.", ERROR_CODES.OBJECT)
          )
      );
      break;
    default:
      throw new Error(`Unknown type: ${cleanType}`);
  }

  // Add additional constraints
  Object.entries(constraints).forEach(([constraint, value]) => {
    const constraintHandlers = {
      enum: () =>
        validators.push(
          locationValidator(key)
            .isIn(value)
            .withMessage(
              createErrorMessage(
                key,
                `must be one of: ${value.join(", ")}.`,
                ERROR_CODES.ENUM
              )
            )
        ),
      isIn: () =>
        validators.push(
          locationValidator(key)
            .isIn(value)
            .withMessage(
              createErrorMessage(
                key,
                `must be one of: ${value.join(", ")}.`,
                ERROR_CODES.IN
              )
            )
        ),
      isInt: () =>
        validators.push(
          locationValidator(key)
            .isInt(
              typeof value === "object"
                ? { min: value.min, max: value.max }
                : {}
            )
            .withMessage(
              createErrorMessage(
                key,
                `must be an integer${
                  value ? ` between ${value.min} and ${value.max}` : ""
                }.`,
                ERROR_CODES.INT
              )
            )
        ),
      isFloat: () =>
        validators.push(
          locationValidator(key)
            .isFloat(
              typeof value === "object"
                ? { min: value.min, max: value.max }
                : {}
            )
            .withMessage(
              createErrorMessage(
                key,
                `must be a float${
                  value ? ` between ${value.min} and ${value.max}` : ""
                }.`,
                ERROR_CODES.FLOAT
              )
            )
        ),
      matches: () =>
        validators.push(
          locationValidator(key)
            .matches(value)
            .withMessage(
              createErrorMessage(
                key,
                `must match the pattern ${value}.`,
                ERROR_CODES.MATCHES
              )
            )
        ),
      isLength: () =>
        validators.push(
          locationValidator(key)
            .isLength(value)
            .withMessage(
              createErrorMessage(
                key,
                `must be between ${value.min} and ${value.max} characters.`,
                ERROR_CODES.LENGTH
              )
            )
        ),
      isEmail: () =>
        validators.push(
          locationValidator(key)
            .isEmail()
            .withMessage(
              createErrorMessage(
                key,
                "must be a valid email.",
                ERROR_CODES.EMAIL
              )
            )
        ),
      isURL: () =>
        validators.push(
          locationValidator(key)
            .isURL()
            .withMessage(
              createErrorMessage(key, "must be a valid URL.", ERROR_CODES.URL)
            )
        ),
      isCreditCard: () =>
        validators.push(
          locationValidator(key)
            .isCreditCard()
            .withMessage(
              createErrorMessage(
                key,
                "must be a valid credit card.",
                ERROR_CODES.CREDIT_CARD
              )
            )
        ),
      isAlpha: () =>
        validators.push(
          locationValidator(key)
            .isAlpha()
            .withMessage(
              createErrorMessage(
                key,
                "must contain only letters.",
                ERROR_CODES.ALPHA
              )
            )
        ),
      isAlphanumeric: () =>
        validators.push(
          locationValidator(key)
            .isAlphanumeric()
            .withMessage(
              createErrorMessage(
                key,
                "must contain only letters and numbers.",
                ERROR_CODES.ALPHANUMERIC
              )
            )
        ),
      isAscii: () =>
        validators.push(
          locationValidator(key)
            .isAscii()
            .withMessage(
              createErrorMessage(
                key,
                "must contain only ASCII characters.",
                ERROR_CODES.ASCII
              )
            )
        ),
      isBase64: () =>
        validators.push(
          locationValidator(key)
            .isBase64()
            .withMessage(
              createErrorMessage(
                key,
                "must be a valid base64 string.",
                ERROR_CODES.BASE64
              )
            )
        ),
      isDataURI: () =>
        validators.push(
          locationValidator(key)
            .isDataURI()
            .withMessage(
              createErrorMessage(
                key,
                "must be a valid data URI.",
                ERROR_CODES.DATA_URI
              )
            )
        ),
      isEmpty: () =>
        validators.push(
          locationValidator(key)
            .isEmpty()
            .withMessage(
              createErrorMessage(key, "must be empty.", ERROR_CODES.EMPTY)
            )
        ),
      isHexColor: () =>
        validators.push(
          locationValidator(key)
            .isHexColor()
            .withMessage(
              createErrorMessage(
                key,
                "must be a valid hex color.",
                ERROR_CODES.HEX_COLOR
              )
            )
        ),
      isIP: () =>
        validators.push(
          locationValidator(key)
            .isIP()
            .withMessage(
              createErrorMessage(
                key,
                "must be a valid IP address.",
                ERROR_CODES.IP
              )
            )
        ),
      isISBN: () =>
        validators.push(
          locationValidator(key)
            .isISBN()
            .withMessage(
              createErrorMessage(key, "must be a valid ISBN.", ERROR_CODES.ISBN)
            )
        ),
      isMACAddress: () =>
        validators.push(
          locationValidator(key)
            .isMACAddress()
            .withMessage(
              createErrorMessage(
                key,
                "must be a valid MAC address.",
                ERROR_CODES.MAC_ADDRESS
              )
            )
        ),
      isUUID: () =>
        validators.push(
          locationValidator(key)
            .isUUID()
            .withMessage(
              createErrorMessage(key, "must be a valid UUID.", ERROR_CODES.UUID)
            )
        ),
      isUppercase: () =>
        validators.push(
          locationValidator(key)
            .isUppercase()
            .withMessage(
              createErrorMessage(
                key,
                "must be uppercase.",
                ERROR_CODES.UPPERCASE
              )
            )
        ),
      isLowercase: () =>
        validators.push(
          locationValidator(key)
            .isLowercase()
            .withMessage(
              createErrorMessage(
                key,
                "must be lowercase.",
                ERROR_CODES.LOWERCASE
              )
            )
        ),
      contains: () =>
        validators.push(
          locationValidator(key)
            .contains(value)
            .withMessage(
              createErrorMessage(
                key,
                `must contain the value ${value}.`,
                ERROR_CODES.CONTAINS
              )
            )
        ),
      equals: () =>
        validators.push(
          locationValidator(key)
            .equals(value)
            .withMessage(
              createErrorMessage(
                key,
                `must equal ${value}.`,
                ERROR_CODES.EQUALS
              )
            )
        ),
      isAfter: () =>
        validators.push(
          locationValidator(key)
            .isAfter(value)
            .withMessage(
              createErrorMessage(
                key,
                `must be a date after ${value}.`,
                ERROR_CODES.IS_AFTER
              )
            )
        ),
      isBefore: () =>
        validators.push(
          locationValidator(key)
            .isBefore(value)
            .withMessage(
              createErrorMessage(
                key,
                `must be a date before ${value}.`,
                ERROR_CODES.IS_BEFORE
              )
            )
        ),
      [key]: Function,
    };

    if (constraintHandlers[constraint]) {
      constraintHandlers[constraint]();
    } else {
      throw new Error(`Unknown constraint: ${constraint}`);
    }
  });

  return validators;
};

// Main function to convert fossil schema to express-validator middleware
const fossilToExpressValidator = (fossil: Fossils) => {
  const validators: ValidationChain[] = [];

  const processFossil = (location: string) => {
    fossil[location as "body" | "query" | "params"]?.forEach((contents) => {
      const locationValidator =
        location === "query" ? query : location === "params" ? param : body;
      validators.push(
        ...createValidationChain(locationValidator, contents.key, contents)
      );
    });
  };

  ["body", "query", "params"].forEach(processFossil);

  return [
    ...validators,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((options: any) => ({
            field: param || "",
            message: options.msg.msg,
            code: options.msg.code,
            value: options.value,
          })),
        });
      }
      next();
    },
  ];
};

export { fossilToExpressValidator };
