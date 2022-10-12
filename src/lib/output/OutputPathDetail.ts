import { PathMethod } from "../../type";
import { injected } from "brandi";
import { TOKENS } from "../token";
import { IResponsesObjectToMarkdown } from "./ResponsesObjectToMarkdown";
import { IRequestBodyToMarkdown } from "./RequestBodyToMarkdown";
import { IApiDocumentService } from "../services/ApiDocumentService";
import { downGradeMarkdownTitle } from "../utils";
import { IOutputHelper } from "./OutputHelper.interface";

// TODO: In API detail: CUrl example
// TODO: name and example response (json format highlight)

export class OutputPathDetail implements IOutputHelper {
  constructor(
    private apiDocumentService: IApiDocumentService,
    private responsesObjectToMarkdown: IResponsesObjectToMarkdown,
    private requestBodyToMarkdown: IRequestBodyToMarkdown
  ) {}

  pathDetailDoc(pathMethod: PathMethod): string {
    const { path, method, operation } = pathMethod;
    const apiDocument = this.apiDocumentService.get();
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
            const tableMarkDown = this.responsesObjectToMarkdown.result(
              operation[property]
            );
            return `# ${property} \n\n${tableMarkDown}`;
          }

          if (property === "requestBody") {
            if (!operation.requestBody) {
              return "";
            }
            if ("$ref" in operation.requestBody) {
              return operation.requestBody.$ref;
            }
            return `# ${property} \n\n${this.requestBodyToMarkdown.result(
              operation.requestBody
            )}`;
          }

          const valueText =
            typeof operation[property] === "object"
              ? JSON.stringify(operation[property])
              : operation[property];
          return `# ${property} \n\n${valueText}`;
        }
        return "";
      })
      .filter((str) => str.length)
      .join("\n\n");

    const server = operation.servers
      ? operation.servers[0].url
      : apiDocument.document.servers
      ? apiDocument.document.servers[0].url
      : "";

    const exampleJson =
      operation.requestBody && "content" in operation.requestBody
        ? this.requestBodyToMarkdown.getSchemaObj(operation.requestBody).example
        : "";

    const contentType =
      operation.requestBody && "content" in operation.requestBody
        ? Object.keys(operation.requestBody.content)[0]
        : "";

    const curlExample = exampleJson
      ? [
          "# curl Example",
          "```bash",
          `curl -X ${method} ${server}${path} \\`,
          `     -H 'Content-Type: ${contentType}' \\`,
          `     -d '${JSON.stringify(exampleJson)}'`,
          "```",
        ].join("\n")
      : "";

    return [
      `# ${operation.summary}`,
      `**API**`,
      `<font color="blue">\`${method}\`</font> \`${path}\``,
      `${downGradeMarkdownTitle(curlExample)}`,
      `${downGradeMarkdownTitle(operationText)}`,
    ].join("\n\n");
  }


  public output(): string {
    const apiDocument = this.apiDocumentService.get();
    const { pathMethods } = apiDocument;
    const apiDocList = pathMethods
      .filter((pathMethod) => pathMethod.path.includes("certify"))
      .map((pathMethod) =>
        downGradeMarkdownTitle(this.pathDetailDoc(pathMethod))
      );
    return ["# APIs", ...apiDocList].join("\n\n");
  }
}

injected(
  OutputPathDetail,
  TOKENS.apiDocumentService,
  TOKENS.responsesObjectToMarkdown,
  TOKENS.requestBodyToMarkdown
);
