import YAML from "yaml";
import { OpenAPIV3 } from "openapi-types";
import { ApiDocument, PathMethod, References } from "../type";

export function readDocument<T>(src: string): T | null {
  try {
    return YAML.parse(src) as T;
  } catch (e) {}
  try {
    return JSON.parse(src) as T;
  } catch (e) {}
  return null;
}

export function createApiDocument(document: OpenAPIV3.Document): ApiDocument {
  const pathMethods: PathMethod[] = [];
  for (const [path, pathItem] of Object.entries<
    OpenAPIV3.PathItemObject | undefined
  >(document.paths)) {
    if (!pathItem) continue;
    for (const [method, operation] of Object.entries(pathItem)) {
      if (method === "parameters") continue;
      pathMethods.push({
        path,
        method: method.toUpperCase(),
        operation: operation as OpenAPIV3.OperationObject,
      });
    }
  }
  const references: References = {};
  if ("components" in document && document.components) {
    const { components } = document;
    Object.entries(components).forEach(([key, value]) => {
      Object.entries(value).forEach(([key2, value]) => {
        references[`#/components/${key}/${key2}`] = value;
      });
    });
  }
  return { document, pathMethods, references };
}

export function convertPath(path: string) {
  return path
    .replace(/[!@#$%^&*()+|~=`[\]{};':",./<>?]/g, "")
    .replace(/ /g, "-")
    .toLowerCase();
}

export function getRefName(refObject: unknown | OpenAPIV3.ReferenceObject) {
  if (typeof refObject === "object" && refObject && "$ref" in refObject) {
    return (refObject as OpenAPIV3.ReferenceObject)["$ref"];
  }
  return undefined;
}

export const SP = (size: number) => "".padEnd(size * 2);

export const markdownText = (text: string) => text.replace(/\n/g, "  \n");

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

