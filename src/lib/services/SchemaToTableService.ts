import { OpenAPIV3 } from "openapi-types";
import { injected } from "brandi";
import { IRefService } from "./RefService";
import { TOKENS } from "../token";
import { IApiDocumentService } from "./ApiDocumentService";

export type ESchemaTableColumn =
  | "place"
  | "field"
  | "required"
  | "title"
  | "type"
  | "description"
  | "example";

type TTableBodyRowData = Record<ESchemaTableColumn, string>;

export interface ISchemaToTableService {
  toTable: (
    obj: OpenAPIV3.SchemaObject,
    columns: ESchemaTableColumn[]
  ) => string;
}

export class SchemaToTableService implements ISchemaToTableService {
  constructor(
    private refService: IRefService,
    private apiDocumentService: IApiDocumentService
  ) {}

  tableHeader(headers: ESchemaTableColumn[]): string[] {
    return [
      `| ${headers.join(" | ")} |`,
      `| ${headers.map(() => "---").join(" | ")} |`,
    ];
  }

  tableBodyRows(obj: OpenAPIV3.SchemaObject): TTableBodyRowData[] {
    if (!obj.properties) {
      throw Error("Must have properties for now.");
    }

    return Object.entries(obj.properties).map(([key, property]) => {
      if ("$ref" in property) {
        return {
          place: "Body",
          field: key,
          required: " v ",
          title: key,
          type: this.refService.refLink(property.$ref),
          description: "",
          example: "",
        };
      }

      const required = !obj.required || obj.required.includes(key);
      const description = property.description?.replace(/[\n\s]+/g, " ");

      let typeCellValue: string | undefined = property.type;
      if (!property.type) {
        if (!property.allOf) {
          throw Error("Assume all Scheme use only `allOf` for now.");
        }
        const refObj = property.allOf[0];
        if (!("$ref" in refObj)) {
          throw Error("lack $ref on refObj.");
        }
        typeCellValue = this.refService.refLink(refObj.$ref);
      }

      const example =
        typeof property.example === "object"
          ? "`" + JSON.stringify(property.example) + "`"
          : property.example;

      return {
        place: "Body",
        field: key,
        required: required ? " v " : " ",
        title: property.title,
        type: typeCellValue,
        description,
        example: example ?? "",
      } as TTableBodyRowData;
    });
  }

  public toTable(
    obj: OpenAPIV3.SchemaObject,
    columns: ESchemaTableColumn[]
  ): string {
    if (obj.type != "object") {
      throw Error("Only Support Single Model Schema for now.");
    }

    const tableHeader = this.tableHeader(columns);

    const tableBodyRows = this.tableBodyRows(obj);

    const tableBody = tableBodyRows.map((data) => {
      return "| " + columns.map((col) => data[col]).join(" | ") + " |";
    });

    const lines = [`Schema: **${obj.title}**\n`, ...tableHeader, ...tableBody];

    return lines.join("\n");
  }
}

injected(SchemaToTableService, TOKENS.refService, TOKENS.apiDocumentService);
