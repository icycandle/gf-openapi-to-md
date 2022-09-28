import { promises as fs } from "fs";
import { outputPageHeader } from "./output/page-header";
import { createApiDocument, readDocument } from "./utils";
import { outputPathDetail } from "./output/path-detail";

const converter = require("swagger2openapi");

export const convertMarkdown = async (
  srcFile: string,
  destFile: string | undefined
) => {
  const src = await fs
    .readFile(srcFile, { encoding: "utf8" })
    .catch(() => null);

  if (!src) {
    console.error(`'${srcFile}' not found`);
    return;
  }

  const document = readDocument<Document>(src.toString());
  if (!document) {
    console.error(`'${srcFile}'  is not 'yaml' or 'json'`);
    return;
  }
  const apiDocument = createApiDocument(
    "openapi" in document
      ? document
      : (await converter.convertObj(document, {})).openapi
  );
  let output = outputPageHeader(apiDocument);

  // output += outputReferenceTable(apiDocument);
  output += outputPathDetail(apiDocument);
  // output += outputReferences(apiDocument);

  output = output.trimEnd();
  if (destFile) {
    fs.writeFile(destFile, output, "utf8");
  } else {
    console.log(output);
  }
};
