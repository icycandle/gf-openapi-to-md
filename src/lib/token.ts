import { token } from "brandi";
import { IResponsesObjectToMarkdown } from "./output/ResponsesObjectToMarkdown";
import { IRequestBodyToMarkdown } from "./output/RequestBodyToMarkdown";
import { IConvertMarkdown } from "./ConvertMarkdown";
import { IRefService } from "./services/RefService";
import { ISchemaToTableService } from "./services/SchemaToTableService";
import { IApiDocumentService } from "./services/ApiDocumentService";
import { IOutputHelper } from "./output/OutputHelper.interface";

export const TOKENS = {
  convertMarkdown: token<IConvertMarkdown>("IConvertMarkdown"),
  refService: token<IRefService>("Reference Schema Link Count Service"),
  apiDocumentService: token<IApiDocumentService>("IApiDocumentService"),
  schemaToTableService: token<ISchemaToTableService>("Schema To Table Service"),
  outputPageHeader: token<IOutputHelper>("Output PageHeader"),
  outputPathDetail: token<IOutputHelper>("Output PathDetail"),
  outputReference: token<IOutputHelper>("Output Reference"),
  responsesObjectToMarkdown: token<IResponsesObjectToMarkdown>(
    "IResponsesObjectToMarkdown"
  ),
  requestBodyToMarkdown: token<IRequestBodyToMarkdown>(
    "IRequestBodyToMarkdown"
  ),
};
