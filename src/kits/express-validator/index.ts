import { Fossils } from "../../types";
import { err, log } from "../../utils/consoleUtils";
import { isValidMethod, Methods } from "../../validators/methodValidator";
import { isValidRoutePath } from "../../validators/routeValidator";
import { fossilToExpressValidator } from "./converter";
import { Express } from "express";

/**
 * Converts Fossils to Express.js validator middleware.
 *
 * This function takes an Express application instance, a base route path,
 * and an array of Fossils. It generates middleware for each Fossil and
 * applies it to the corresponding route on the Express app.
 *
 *
 * @param app - The Express application instance.
 * @param fossils - An array of Fossils containing the route information and validators.
 * @param baseRoutePath - The base path for the routes.
 */

const fossilsToExpressMiddleware = (
  app: Express,
  fossils: Fossils[],
  baseRoutePath: string = ""
) => {
  try {
    fossils.forEach((fossil) => {
      const middleware = fossilToExpressValidator(fossil);
      const method = isValidMethod(fossil.method) as Methods | undefined;
      const path = `${baseRoutePath}${fossil.path}`;

      if (!method)
        throw new Error(
          `In ${path}: Invalid method ${fossil.method.toLowerCase()}.`
        );

      if (!isValidRoutePath(path))
        throw new Error(`In ${path}: Invalid path ${path}.`);

      app[method](path, ...middleware);
      log(`In ${path}: Validation middleware succesfully injected.`);
    });
  } catch (error: any) {
    err(`Error: ${error.message}`);
  }
};

export { ERROR_CODES } from "./error-codes";
export { fossilsToExpressMiddleware };
