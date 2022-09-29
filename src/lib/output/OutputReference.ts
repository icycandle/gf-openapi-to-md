import { injected } from "brandi";
import { TOKENS } from "../token";
import { IApiDocumentService } from "../services/ApiDocumentService";
import { IRefService } from "../services/RefService";
import { OpenAPIV3 } from "openapi-types";
import { downGradeMarkdownTitle } from "../utils";
import { IOutputHelper } from "./OutputHelper.interface";
import {
  ESchemaTableColumn,
  ISchemaToTableService,
} from "../services/SchemaToTableService";

export class OutputReference implements IOutputHelper {
  constructor(
    private apiDocumentService: IApiDocumentService,
    private refService: IRefService,
    private schemaToTableService: ISchemaToTableService
  ) {}

  buildEnumContentPart(refSchema: OpenAPIV3.SchemaObject): string[] {
    const typeLine = ["**Type**", refSchema.type].join("\n");
    const enumLine = ["**Enum**", refSchema.enum].join("\n");

    const descriptionLine = refSchema.description
      ? ["**Description**", downGradeMarkdownTitle(refSchema.description)].join(
          "\n"
        )
      : "";
    return [typeLine, enumLine, descriptionLine];
  }

  buildSchemaContentPart(refSchema: OpenAPIV3.SchemaObject): string[] {
    const typeLine = ["**Type**", refSchema.type].join("\n");

    const columns: ESchemaTableColumn[] = [
      "field",
      "required",
      "title",
      "type",
      "description",
      "example",
    ];

    const tableMarkdown = this.schemaToTableService.toTable(refSchema, columns);

    const descriptionLine = refSchema.description
      ? ["**Description**", downGradeMarkdownTitle(refSchema.description)].join(
          "\n"
        )
      : "";

    // const jsonSchema = "**JSON Schema**\n" + toMarkdownJsonCode(refSchema);

    return [typeLine, descriptionLine, tableMarkdown];
  }

  public output(): string {
    const apiDocument = this.apiDocumentService.get();
    const docList = this.refService.refLinkPathList.map((ref) => {
      const refSchema = apiDocument.references[ref] as OpenAPIV3.SchemaObject;

      const bodyLines = refSchema.enum
        ? this.buildEnumContentPart(refSchema)
        : this.buildSchemaContentPart(refSchema);

      const result = [`# ${refSchema.title}`, ...bodyLines].join("\n\n");
      return downGradeMarkdownTitle(result);
    });
    return ["# Reference", ...docList].join("\n\n");
  }
}

injected(
  OutputReference,
  TOKENS.apiDocumentService,
  TOKENS.refService,
  TOKENS.schemaToTableService
);
