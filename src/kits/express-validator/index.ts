import { Fossils } from "../../types";
import { fossilToExpressValidator } from "./converter";
import { Express } from "express";

/**
 * Converts Fossils to Express.js validator middleware.
 *
 * This function takes an Express application instance, a base route path,
 * and an array of Fossils. It generates middleware for each Fossil and
 * applies it to the corresponding route on the Express app.
 *
 * @experimental
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
  fossils.forEach((fossil) => {
    const middleware = fossilToExpressValidator(fossil);
    app[
      fossil.method.toLowerCase() as "get" | "post" | "put" | "patch" | "delete"
    ](`${baseRoutePath}${fossil.path}`, ...middleware);
  });
};

export { ERROR_CODES } from "./error-codes";
export { fossilsToExpressMiddleware };