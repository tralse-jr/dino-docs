import { sanitizeKey } from "../helpers/sanitizeKey";
import { DinoDocsBody, NameDescription } from "../types";
import { matchDinoDocsBody } from "../validators/routeValidator";
import { parseConstraints } from "./dinoDocConstraintsParser";

const parseDinoDocsBodyDescription = (description: string) => {
  const match = matchDinoDocsBody(description);
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

const parseDinoDocsBodyNameDescription = (
  body: NameDescription,
  name: string
) => {
  if (!body || !body.description || !body.name || body.name !== name) return;

  return parseDinoDocsBodyDescription(body.description);
};

export const parseDinoDocsBody: {
  (arg1: string | null): DinoDocsBody | null | undefined;
  (arg1: NameDescription | null, arg2: string): DinoDocsBody | null | undefined;
} = (arg1: any, arg2?: string) => {
  if (!arg1) return;

  if (typeof arg1 === "string") {
    return parseDinoDocsBodyDescription(arg1);
  }
  if (
    typeof arg1 === "object" &&
    arg1 !== null &&
    "name" in arg1 &&
    "description" in arg1
  ) {
    return parseDinoDocsBodyNameDescription(
      arg1 as NameDescription,
      arg2 as string
    );
  }

  return;
};
