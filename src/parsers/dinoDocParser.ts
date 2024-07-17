import { sanitizeKey } from "../helpers/sanitizeKey";
import {
  Comment,
  Constraints,
  DinoDocsBody,
  DinoDocsTitle,
  Fossils,
  NameDescription,
} from "../types";
import { isValidRoutePath } from "../validators/routeValidator";

const parseDinoDocsTitle = (
  title: NameDescription | null
): DinoDocsTitle | undefined => {
  if (
    !title ||
    !title.name ||
    !title.description ||
    title.name !== "dinoValidator"
  )
    return;

  const [method, ...pathDescription] = title.description.trim().split(" ");
  const [path, ...descriptionArr] = pathDescription;

  let scannedPath = "";
  let scannedDescription = null;

  if (path === "/" || isValidRoutePath(path)) {
    scannedPath = path;
    scannedDescription = descriptionArr.join(" ").replace(/^.*-/, "").trim();
  } else {
    scannedDescription = pathDescription.join(" ").trim();
  }

  return {
    method: method,
    path: scannedPath,
    description: scannedDescription,
  };
};

const parseConstraints = (rawConstraints: string) => {
  const constraints: Constraints = {};

  if (!rawConstraints) return constraints;

  const constraintMap: { [key: string]: any } = {
    enum: (value: any) => {
      constraints.enum = value.split("|");
    },
    range: (value: any) => {
      const [min, max] = value.split("-").map(Number);
      constraints.isInt = { options: { min, max } };
    },
    regex: (value: any) => {
      constraints.matches = new RegExp(value);
    },
    minLength: (value: any) => {
      constraints.isLength = { options: { min: +value } };
    },
    maxLength: (value: any) => {
      constraints.isLength = { options: { max: +value } };
    },
    min: (value: any) => {
      constraints.isFloat = { options: { min: +value } };
    },
    max: (value: any) => {
      constraints.isFloat = { options: { max: +value } };
    },
    isEmail: () => {
      constraints.isEmail = true;
    },
    isURL: () => {
      constraints.isURL = true;
    },
    isInt: () => {
      constraints.isInt = true;
    },
    isFloat: () => {
      constraints.isFloat = true;
    },
    isBoolean: () => {
      constraints.isBoolean = true;
    },
    contains: (value: any) => {
      constraints.contains = value;
    },
    equals: (value: any) => {
      constraints.equals = value;
    },
    isAfter: (value: any) => {
      constraints.isAfter = value;
    },
    isBefore: (value: any) => {
      constraints.isBefore = value;
    },
    isIn: (value: any) => {
      constraints.isIn = value.split("|");
    },
    isCreditCard: () => {
      constraints.isCreditCard = true;
    },
    isDate: () => {
      constraints.isDate = true;
    },
    isAlpha: () => {
      constraints.isAlpha = true;
    },
    isAlphanumeric: () => {
      constraints.isAlphanumeric = true;
    },
    isAscii: () => {
      constraints.isAscii = true;
    },
    isBase64: () => {
      constraints.isBase64 = true;
    },
    isDataURI: () => {
      constraints.isDataURI = true;
    },
    isEmpty: () => {
      constraints.isEmpty = true;
    },
    isHexColor: () => {
      constraints.isHexColor = true;
    },
    isIP: () => {
      constraints.isIP = true;
    },
    isISBN: () => {
      constraints.isISBN = true;
    },
    isMACAddress: () => {
      constraints.isMACAddress = true;
    },
    isMobilePhone: () => {
      constraints.isMobilePhone = true;
    },
    isUUID: () => {
      constraints.isUUID = true;
    },
    isUppercase: () => {
      constraints.isUppercase = true;
    },
    isLowercase: () => {
      constraints.isLowercase = true;
    },
  };

  rawConstraints
    .replace(/[()]/g, "")
    .split(",")
    .forEach((constraint) => {
      const [key, value] = constraint.split("=");
      if (constraintMap[key]) {
        constraintMap[key](value);
      } else {
        throw new Error(
          `Unknown constraint: <${key}>. Choose one of the valid constraints.`
        );
      }
    });

  return constraints;
};

const parseDinoDocsBody = (body: NameDescription, name: string) => {
  if (!body || !body.description || !body.name || body.name !== name) return;

  const match = body.description
    .trim()
    .match(/^\{([^{}]*)\}\s*([\w.\[\]]+)\s*(?:-\s*([^()]*))?\s*(\([^)]*\))?$/);

  let result: DinoDocsBody | null = null;

  if (match) {
    const [_, type, key, description, constraints] = match;
    const { optional, sanitized } = sanitizeKey(key);

    result = { key: sanitized, type, optional: optional };
    const parsedConstraints = parseConstraints(constraints);

    if (description) result.description = description.trim();
    if (parsedConstraints && Object.keys(parsedConstraints).length > 0) {
      result.constraints = parsedConstraints;
    }
  }

  return result;
};

const convertDinoDocsToJSON = (comments: Comment) => {
  const parsedTitle = parseDinoDocsTitle(comments.title);
  const parsedBody = comments.body
    .map((comment) => parseDinoDocsBody(comment, "dinoBody"))
    .filter(Boolean);
  const parsedParams = comments.body
    .map((comment) => parseDinoDocsBody(comment, "dinoParams"))
    .filter(Boolean);
  const parsedQuery = comments.body
    .map((comment) => parseDinoDocsBody(comment, "dinoQuery"))
    .filter(Boolean);

  if (parsedTitle) {
    let result: Fossils = { ...parsedTitle };
    if (parsedBody && parsedBody.length > 0) {
      result.body = parsedBody;
    }
    if (parsedParams && parsedParams.length > 0) {
      result.params = parsedParams;
    }
    if (parsedQuery && parsedQuery.length > 0) {
      result.query = parsedQuery;
    }
    return result;
  }
};

export { convertDinoDocsToJSON };
