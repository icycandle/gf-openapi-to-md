import { ApiDocument } from "../../type";
import { OpenAPIV3 } from "openapi-types";
import {
  ESchemaTableColumn,
  reqSchemeToMarkdownTableHelper,
} from "./schema-to-table";

export const columns: ESchemaTableColumn[] = [
  "field",
  "required",
  "title",
  "type",
  "description",
  "example",
];

function respSchemeToMarkdownTable(
  obj: OpenAPIV3.ResponseObject,
  apiDocument: ApiDocument
): string {
  if (typeof obj.content !== "object") {
    throw Error("typeof obj.content !== object");
  }
  const contentType = Object.keys(obj.content)[0];

  const schemaObj = obj.content[contentType].schema;

  if (!schemaObj) {
    throw Error("Assume schema is exist");
  }

  if (!("$ref" in schemaObj)) {
    throw Error("Array type is not defined");
  }

  const schemaRefPath = schemaObj.$ref;
  const schemaData = apiDocument.references[schemaRefPath];
  const tableMarkdown = reqSchemeToMarkdownTableHelper(
    schemaData as OpenAPIV3.SchemaObject,
    columns
  );

  const schemaJson = JSON.stringify(schemaData, null, 2);

  // \`\`\`${contentType}
  // ${schemaJson}
  // \`\`\`

  return `**${obj.description}** \n\n ${tableMarkdown} \n\n`;
}

export function responsesObjectToMarkdown(
  resObj: OpenAPIV3.ResponsesObject,
  apiDocument: ApiDocument
): string {
  let result = "";
  Object.entries(resObj).forEach(([code, obj]) => {
    const content =
      "$ref" in obj ? obj.$ref : respSchemeToMarkdownTable(obj, apiDocument);
    result += `==${code}==\n\n` + content;
  });
  return result;
}
