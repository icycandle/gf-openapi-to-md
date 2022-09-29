import { OpenAPIV3 } from "openapi-types";
import { IRefService } from "../services/RefService";
import {
  ESchemaTableColumn,
  ISchemaToTableService,
} from "../services/SchemaToTableService";
import { injected } from "brandi";
import { TOKENS } from "../token";
import { IApiDocumentService } from "../services/ApiDocumentService";
import { toMarkdownJsonCode } from "../utils";

export const columns: ESchemaTableColumn[] = [
  "field",
  "required",
  "title",
  "type",
  "description",
  "example",
];

export interface IResponsesObjectToMarkdown {
  result(resObj: OpenAPIV3.ResponsesObject): string;
}

export class ResponsesObjectToMarkdown implements IResponsesObjectToMarkdown {
  constructor(
    private apiDocumentService: IApiDocumentService,
    private refService: IRefService,
    private schemaToTableService: ISchemaToTableService
  ) {}

  respSchemeToMarkdownTable(obj: OpenAPIV3.ResponseObject): string {
    if (typeof obj.content !== "object") {
      throw Error("typeof obj.content !== object");
    }
    const contentType = Object.keys(obj.content)[0];

    const schemaObj = obj.content[contentType].schema;
    const example = obj.content[contentType].example;

    if (!schemaObj) {
      throw Error("Assume schema is exist");
    }

    if (!("$ref" in schemaObj)) {
      throw Error("Array type is not defined");
    }

    const schemaRefPath = schemaObj.$ref;
    const schemaData = this.apiDocumentService.get().references[schemaRefPath];
    const tableMarkdown = this.schemaToTableService.toTable(
      schemaData as OpenAPIV3.SchemaObject,
      columns
    );

    const exampleLines = example
      ? [`**Example**`, toMarkdownJsonCode(example)]
      : [];

    return [`**${obj.description}**`, `${tableMarkdown}`, ...exampleLines].join(
      "\n\n"
    );
  }

  public result(resObj: OpenAPIV3.ResponsesObject): string {
    return Object.entries(resObj)
      .map(([code, obj]) => {
        const content =
          "$ref" in obj ? obj.$ref : this.respSchemeToMarkdownTable(obj);
        return [`==${code}==`, content].join("\n\n");
      })
      .join("\n\n");
  }
}

injected(
  ResponsesObjectToMarkdown,
  TOKENS.apiDocumentService,
  TOKENS.refService,
  TOKENS.schemaToTableService
);
