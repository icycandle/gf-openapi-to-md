import { OpenAPIV3 } from "openapi-types";
import {
  isArraySchemaObject,
  isNonArraySchemaObject,
  isReferenceObject,
} from "./type-guards";

// Helper
export interface ITableInfoHelper {
  schemaObj: unknown;
  getRefPath: () => string;
  getDesc: () => string;
  getTable: () => string;
}

class ArraySchemaTableInfoHelper implements ITableInfoHelper {
  type = "ArraySchema";
  schemaObj: OpenAPIV3.ArraySchemaObject;
  constructor(obj: OpenAPIV3.ArraySchemaObject) {
    this.schemaObj = obj;
  }

  getRefPath() {
    if (isReferenceObject(this.schemaObj.items)) {
      return this.schemaObj.items.$ref;
    }
    throw Error(
      `this.schemaObj.items got: ${JSON.stringify(this.schemaObj.items)}`
    );
  }
  getDesc() {
    return "";
  }
  getTable() {
    return "";
  }
}

class NonArraySchemaTableInfoHelper implements ITableInfoHelper {
  type = "NonArraySchema";
  schemaObj: OpenAPIV3.NonArraySchemaObject;
  constructor(obj: OpenAPIV3.NonArraySchemaObject) {
    this.schemaObj = obj;
  }

  getRefPath() {
    if (this.schemaObj.allOf && isReferenceObject(this.schemaObj.allOf[0])) {
      return this.schemaObj.allOf[0].$ref;
    }
    if (this.schemaObj.oneOf && isReferenceObject(this.schemaObj.oneOf[0])) {
      return this.schemaObj.oneOf[0].$ref;
    }
    if (this.schemaObj.anyOf && isReferenceObject(this.schemaObj.anyOf[0])) {
      return this.schemaObj.anyOf[0].$ref;
    }
    throw Error(`this.schemaObj.items got: ${JSON.stringify(this.schemaObj)}`);
  }

  getDesc() {
    return "";
  }
  getTable() {
    // const schemaRefPath = schemaObj.$ref;
    // const apiDocument = this.apiDocumentService.get();
    // apiDocument.references[schemaRefPath];
    return "";
  }
}

class ReferenceTableInfoHelper implements ITableInfoHelper {
  type = "Reference";
  schemaObj: OpenAPIV3.ReferenceObject;
  constructor(obj: OpenAPIV3.ReferenceObject) {
    this.schemaObj = obj;
  }

  getRefPath() {
    return this.schemaObj.$ref;
  }
  getDesc() {
    return "";
  }
  getTable() {
    return "";
  }
}

export function tableInfoHelperFactory(schemaObj: unknown) {
  if (isArraySchemaObject(schemaObj)) {
    return new ArraySchemaTableInfoHelper(schemaObj);
  }
  if (isNonArraySchemaObject(schemaObj)) {
    return new NonArraySchemaTableInfoHelper(schemaObj);
  }
  if (isReferenceObject(schemaObj)) {
    return new ReferenceTableInfoHelper(schemaObj);
  }
  throw Error(`schemaObj type is not defined: ${JSON.stringify(schemaObj)}`);
}
