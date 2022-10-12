import { OpenAPIV3 } from "openapi-types";

export function isArraySchemaObject(
  data: unknown
): data is OpenAPIV3.ArraySchemaObject {
  if (typeof data !== "object") {
    throw Error(`data type is not object: ${typeof data}`);
  }
  if (!data) {
    throw Error(`data type is not object: ${typeof data}`);
  }
  return "type" in data && (data as { type: string }).type === "array";
}

export function isNonArraySchemaObject(
  data: unknown
): data is OpenAPIV3.NonArraySchemaObject {
  if (typeof data !== "object") {
    throw Error(`data type is not object: ${typeof data}`);
  }
  if (!data) {
    throw Error(`data type is not object: ${typeof data}`);
  }
  return "type" in data && (data as { type: string }).type === "object";
}

export function isReferenceObject(
  data: unknown
): data is OpenAPIV3.ReferenceObject {
  if (typeof data !== "object") {
    throw Error(`data type is not object: ${typeof data}`);
  }
  if (!data) {
    throw Error(`data type is not object: ${typeof data}`);
  }
  return "$ref" in data;
}
