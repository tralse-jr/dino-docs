import { DinoDocsTitle, NameDescription } from "../types";
import { isValidRoutePath } from "../validators/routeValidator";

const parseDinoDocsTitleDescription = (
  description: string | null
): DinoDocsTitle | undefined => {
  if (!description) return;

  const [method, ...pathDescription] = description.trim().split(" ");
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

const parseDinoDocsTitleNameDescription = (
  title: NameDescription | null
): DinoDocsTitle | undefined => {
  if (
    !title ||
    !title.name ||
    !title.description ||
    title.name !== "dinoValidator"
  )
    return;

  return parseDinoDocsTitleDescription(title.description);
};

export const parseDinoDocsTitle: {
  (arg: string | null): DinoDocsTitle | undefined;
  (arg: NameDescription | null): DinoDocsTitle | undefined;
} = (arg: any) => {
  if (!arg) return;

  if (typeof arg === "string") {
    return parseDinoDocsTitleDescription(arg);
  }
  if (
    typeof arg === "object" &&
    arg !== null &&
    "name" in arg &&
    "description" in arg
  ) {
    return parseDinoDocsTitleNameDescription(arg as NameDescription);
  }

  return
};
