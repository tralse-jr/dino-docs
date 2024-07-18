import { Annotation } from "doctrine";
import { parseJSDocComments } from "../parsers/jsDocParser";
import { readFileAsync } from "../utils/fileUtils";
import { Comment, Fossils } from "../types";
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

/**
 * Fossilizes DinoDocs.
 *
 * This function extracts JSDoc comments from the given file, filters them based on
 * custom annotations, and converts the filtered comments into a schema with JSON format.
 *
 * @param filename - The name of the file to process.
 * @returns A promise that resolves to an array of converted comments as Fossils.
 */
const processDinoDocs = async (filename: string): Promise<Fossils[]> => {
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
    .filter(Boolean) as Fossils[];
};

export { processDinoDocs };
