import { ApiDocument, PathMethod, References } from "../../type";
import { injected } from "brandi";
import { promises as fs } from "fs";
import { readDocument } from "../utils";
import { OpenAPIV3 } from "openapi-types";

const converter = require("swagger2openapi");

export interface IApiDocumentService {
  init: (sourceFilePath: string) => Promise<void>;
  get: () => ApiDocument;
}

export class ApiDocumentService implements IApiDocumentService {
  private apiDocument?: ApiDocument;

  async readFile(srcFile: string): Promise<Document> {
    const src = await fs
      .readFile(srcFile, { encoding: "utf8" })
      .catch(() => null);

    if (!src) {
      throw Error(`'${srcFile}' not found`);
    }

    const document = readDocument<Document>(src.toString());
    if (!document) {
      throw Error(`'${srcFile}'  is not 'yaml' or 'json'`);
    }

    return document;
  }

  createApiDocument(document: OpenAPIV3.Document): ApiDocument {
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

  async init(sourceFilePath: string) {
    if (!this.apiDocument) {
      const document = await this.readFile(sourceFilePath);

      this.apiDocument = this.createApiDocument(
        "openapi" in document
          ? document
          : (await converter.convertObj(document, {})).openapi
      );
    }
  }

  get(): ApiDocument {
    if (!this.apiDocument) {
      throw Error("!this.apiDocument");
    }

    return this.apiDocument;
  }
}

injected(ApiDocumentService);
