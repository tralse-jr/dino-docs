import chalk from "chalk";

const header = "[dino-docs-api]";

export const log = (...text: unknown[]) => {
  chalk.green(header, text);
};

export const err = (...text: unknown[]) => {
  chalk.red(header, text);
};
