import { ApiDocument } from "../../type";
import { OpenAPIV3 } from "openapi-types";
import {
  ESchemaTableColumn,
  reqSchemeToMarkdownTableHelper,
} from "./schema-to-table";

export const columns: ESchemaTableColumn[] = [
  "place",
  "field",
  "required",
  "title",
  "type",
  "description",
  "example",
];

export function requestBodyToMarkdown(
  obj: OpenAPIV3.RequestBodyObject,
  apiDocument: ApiDocument
): string {
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
  //\`\`\`json ${schemaJson} \`\`\`
  return `\n\n ${tableMarkdown} \n\n`;
}
