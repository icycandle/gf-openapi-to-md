import { OpenAPIV3 } from "openapi-types";

function refLink(path: string): string {
  const pathSubStr = path.split("/");
  const name = pathSubStr[pathSubStr.length - 1];
  return `[${name}](${path})`;
}

export type ESchemaTableColumn =
  | "place"
  | "field"
  | "required"
  | "title"
  | "type"
  | "description"
  | "example";

type TTableBodyRowData = Record<ESchemaTableColumn, string>;

function _tableHeader(headers: ESchemaTableColumn[]) {
  return (
    `| ${headers.join(" | ")} |\n` +
    `| ${headers.map(() => "---").join(" | ")} |\n`
  );
}

export function reqSchemeToMarkdownTableHelper(
  obj: OpenAPIV3.SchemaObject,
  columns: ESchemaTableColumn[]
): string {
  if (obj.type != "object") {
    throw Error("Only Support Single Model Schema for now.");
  }
  if (!obj.properties) {
    throw Error("Must have properties for now.");
  }

  const tableHeader = _tableHeader(columns);

  const tableBodyRows: TTableBodyRowData[] = Object.entries(obj.properties).map(
    ([key, property]) => {
      if ("$ref" in property) {
        throw Error("Not support $ref Schema for now.");
      }
      const required = !obj.required || obj.required.includes(key);
      const description = property.description?.replace(/[\n\s]+/g, " ");

      return {
        place: "Body",
        field: key,
        required: required ? " v " : " ",
        title: property.title,
        // @ts-ignore
        type: property.type ? property.type : refLink(property.allOf[0].$ref),
        description,
        example: property.example ?? "",
      } as TTableBodyRowData;
    }
  );

  const tableBody = tableBodyRows
    .map((data) => {
      return "| " + columns.map((col) => data[col]).join(" | ") + " |";
    })
    .join("\n");

  return `Schema: **${obj.title}**\n\n` + tableHeader + tableBody;
}
