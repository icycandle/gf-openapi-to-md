import { OpenAPIV3 } from "openapi-types";
import {
  ESchemaTableColumn,
  ISchemaToTableService,
} from "../services/SchemaToTableService";
import { injected } from "brandi";
import { TOKENS } from "../token";
import { IApiDocumentService } from "../services/ApiDocumentService";

export const columns: ESchemaTableColumn[] = [
  "place",
  "field",
  "required",
  "title",
  "type",
  "description",
  "example",
];

export interface IRequestBodyToMarkdown {
  result(obj: OpenAPIV3.RequestBodyObject): string;
  getSchemaObj(obj: OpenAPIV3.RequestBodyObject): OpenAPIV3.SchemaObject;
}

export class RequestBodyToMarkdown implements IRequestBodyToMarkdown {
  constructor(
    private apiDocumentService: IApiDocumentService,
    private schemaToTableService: ISchemaToTableService
  ) {}

  public getSchemaObj(
    obj: OpenAPIV3.RequestBodyObject
  ): OpenAPIV3.SchemaObject {
    const contentType = Object.keys(obj.content)[0];

    const schemaObj = obj.content[contentType].schema;

    if (!schemaObj) {
      throw Error("Assume schema is exist");
    }

    if (!("$ref" in schemaObj)) {
      throw Error("Array type is not defined");
    }

    const schemaRefPath = schemaObj.$ref;
    const apiDocument = this.apiDocumentService.get();
    return apiDocument.references[schemaRefPath] as OpenAPIV3.SchemaObject;
  }

  public result(obj: OpenAPIV3.RequestBodyObject): string {
    const schemaData = this.getSchemaObj(obj);
    const tableMarkdown = this.schemaToTableService.toTable(
      schemaData,
      columns
    );

    return `\n\n ${tableMarkdown} \n\n`;
  }
}
injected(
  RequestBodyToMarkdown,
  TOKENS.apiDocumentService,
  TOKENS.schemaToTableService
);
