import chalk from "chalk";

const header = "[dino-docs-api]";

export const log = (...text: unknown[]) => {
  console.log(chalk.green(header, text));
};

export const err = (...text: unknown[]) => {
  console.log(chalk.red(header, text));
};
