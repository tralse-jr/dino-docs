import { parse } from "doctrine";
import { jsDocRegex } from "../utils/regexUtils";

const parseJSDocComments = (fileContent: string) => {
  const comments = [];
  let match;

  while ((match = jsDocRegex.exec(fileContent)) !== null) {
    const commentText = match[1].trim();
    const parsedComment = parse(commentText, { unwrap: true });
    comments.push(parsedComment);
  }

  return comments;
};

export {
  parseJSDocComments,
};
