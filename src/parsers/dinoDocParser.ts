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
    minlen: (value: any) => {
      constraints.isLength = { options: { min: +value } };
    },
    maxlen: (value: any) => {
      constraints.isLength = { options: { max: +value } };
    },
    min: (value: any) => {
      constraints.isFloat = { options: { min: +value } };
    },
    max: (value: any) => {
      constraints.isFloat = { options: { max: +value } };
    },
    email: () => {
      constraints.isEmail = true;
    },
    url: () => {
      constraints.isURL = true;
    },
    int: () => {
      constraints.isInt = true;
    },
    float: () => {
      constraints.isFloat = true;
    },
    bool: () => {
      constraints.isBoolean = true;
    },
    contains: (value: any) => {
      constraints.contains = value;
    },
    equals: (value: any) => {
      constraints.equals = value;
    },
    afterdate: (value: any) => {
      constraints.isAfter = value;
    },
    beforedate: (value: any) => {
      constraints.isBefore = value;
    },
    isIn: (value: any) => {
      constraints.isIn = value.split("|");
    },
    creditcard: () => {
      constraints.isCreditCard = true;
    },
    date: () => {
      constraints.isDate = true;
    },
    alpha: () => {
      constraints.isAlpha = true;
    },
    alnum: () => {
      constraints.isAlphanumeric = true;
    },
    ascii: () => {
      constraints.isAscii = true;
    },
    base64: () => {
      constraints.isBase64 = true;
    },
    datauri: () => {
      constraints.isDataURI = true;
    },
    empty: () => {
      constraints.isEmpty = true;
    },
    hex: () => {
      constraints.isHexColor = true;
    },
    ip: () => {
      constraints.isIP = true;
    },
    isbn: () => {
      constraints.isISBN = true;
    },
    mac: () => {
      constraints.isMACAddress = true;
    },
    uuid: () => {
      constraints.isUUID = true;
    },
    ucase: () => {
      constraints.isLowercase = true;
    },
    lcase: () => {
      constraints.isUppercase = true;
    },
  };

  rawConstraints
    .replace(/[()]/g, "")
    .split(",")
    .forEach((constraint) => {
      const [key, value] = constraint.split("=");
      const trimmedKey = key.trim();
      const trimmedValue = value?.trim();
      if (constraintMap[trimmedKey]) {
        constraintMap[trimmedKey](trimmedValue);
      } else {
        throw new Error(
          `Unknown constraint: <${trimmedKey}>. Choose one of the valid constraints.`
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
    .filter(Boolean) as DinoDocsBody[];
  const parsedParams = comments.body
    .map((comment) => parseDinoDocsBody(comment, "dinoParams"))
    .filter(Boolean) as DinoDocsBody[];
  const parsedQuery = comments.body
    .map((comment) => parseDinoDocsBody(comment, "dinoQuery"))
    .filter(Boolean) as DinoDocsBody[];

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
