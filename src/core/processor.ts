import { Annotation } from "doctrine";
import { parseJSDocComments } from "../parsers/jsDocParser";
import { readFileAsync } from "../utils/fileUtils";
import { Comment } from "../types";
import { convertDinoDocsToJSON } from "../parsers/dinoDocParser";

const extractJSDocComments = async (filename: string) => {
  const fileContent = await readFileAsync(filename);
  return parseJSDocComments(fileContent);
};

const filterComment = (
  comment: Annotation,
  validTitle: string,
  validBody: string[]
): Comment => {
  const titleComment = comment.tags.find((tag) => tag.title === validTitle);

  const bodyComments = validBody.flatMap((validBodyTag) =>
    comment.tags.filter((tag) => tag.title === validBodyTag)
  );

  return titleComment
    ? {
        title: {
          name: validTitle,
          description: titleComment?.description || "",
        },
        body: bodyComments.map((tag) => ({
          name: tag.title,
          description: tag.description || "",
        })),
      }
    : { title: null, body: [] };
};

const processDinoDocs = async (filename: string) => {
  const extractedComments = await extractJSDocComments(filename);
  const filteredComments = extractedComments.map((comment) =>
    filterComment(comment, "dinoValidator", [
      "dinoBody",
      "dinoParams",
      "dinoQuery",
    ])
  );
  return filteredComments
    .map((filtered) => convertDinoDocsToJSON(filtered))
    .filter(Boolean);
};

export { processDinoDocs };
