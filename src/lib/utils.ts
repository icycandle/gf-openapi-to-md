import YAML from "yaml";
import { OpenAPIV3 } from "openapi-types";
import { ApiDocument } from "../type";

export function readDocument<T>(src: string): T | null {
  try {
    return YAML.parse(src) as T;
  } catch (e) {}
  try {
    return JSON.parse(src) as T;
  } catch (e) {}
  return null;
}

export function getRefName(refObject: unknown | OpenAPIV3.ReferenceObject) {
  if (typeof refObject === "object" && refObject && "$ref" in refObject) {
    return (refObject as OpenAPIV3.ReferenceObject)["$ref"];
  }
  return undefined;
}

export function getApiObject<T = unknown | OpenAPIV3.ReferenceObject>(
  { references }: ApiDocument,
  object: OpenAPIV3.ReferenceObject | unknown,
  refs?: Set<string>
) {
  const refName = getRefName(object);
  if (refName) {
    const ref = (object as OpenAPIV3.ReferenceObject)["$ref"];
    if (refs) {
      if (refs.has(ref)) {
        return object;
      }
      refs.add(ref);
    }
    return references[ref] as T;
  }
  return object as T;
}

export function downGradeMarkdownTitle(text: string) {
  return text.replace(/(^#|\n\s*#)/g, "\n##");
}

export function toMarkdownJsonCode(data: unknown) {
  return "```json\n" + JSON.stringify(data, null, 2) + "\n```";
}
