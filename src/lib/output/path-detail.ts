import { ApiDocument, PathMethod } from "../../type";
import { requestBodyToMarkdown } from "./path-detail-request-helper";
import { responsesObjectToMarkdown } from "./path-detail-response-helper";

// TODO: In API detail: CUrl example
// TODO: In API detail: API spec: http-method, path, response format (as table)
// TODO: response format table: field, required, description
// TODO: name and example response (json format highlight)

function pathDetailDoc(
  { path, method, operation }: PathMethod,
  apiDocument: ApiDocument
): string {
  const operationKeys: (keyof PathMethod["operation"])[] = [
    // "operationId",
    // "summary",
    "deprecated",
    "servers",
    "tags",
    "description",
    "parameters",
    "requestBody",
    "security",
    "responses",
    "callbacks",
    "externalDocs",
  ];

  const operationText: string = operationKeys
    .map((property) => {
      if (property in operation && operation[property]) {
        if (property === "responses") {
          return `### ${property} \n\n${responsesObjectToMarkdown(
            operation[property],
            apiDocument
          )}`;
        }

        if (property === "requestBody") {
          if (!operation.requestBody) {
            return "";
          }
          if ("$ref" in operation.requestBody) {
            return operation.requestBody.$ref;
          }
          return `### ${property} \n\n${requestBodyToMarkdown(
            operation.requestBody,
            apiDocument
          )}`;
        }

        const valueText =
          typeof operation[property] === "object"
            ? JSON.stringify(operation[property])
            : operation[property];
        return `### ${property} \n\n${valueText}`;
      }
      return "";
    })
    .join("\n\n");

  return `
## ${operation.summary}

**API**

<font color="blue">\`${method}\`</font> \`${path}\`

${operationText}

`;
}

export function outputPathDetail(apiDocument: ApiDocument): string {
  const { pathMethods } = apiDocument;
  return pathMethods.reduce(
    (a, pathMethod) => a + pathDetailDoc(pathMethod, apiDocument),
    ""
  );
}
