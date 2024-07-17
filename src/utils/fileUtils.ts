import { promises as fs } from "fs";

const readFileAsync = async (filename: string) => {
  return fs.readFile(filename, "utf8");
};

export {
  readFileAsync,
};
