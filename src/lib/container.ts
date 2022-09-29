import { Container } from "brandi";

import { TOKENS } from "./token";
import { RefService } from "./services/RefService";
import { SchemaToTableService } from "./services/SchemaToTableService";
import { RequestBodyToMarkdown } from "./output/RequestBodyToMarkdown";
import { ResponsesObjectToMarkdown } from "./output/ResponsesObjectToMarkdown";
import { ConvertMarkdown } from "./ConvertMarkdown";
import { ApiDocumentService } from "./services/ApiDocumentService";
import { OutputPathDetail } from "./output/OutputPathDetail";
import { OutputPageHeader } from "./output/OutputPageHeader";
import { OutputReference } from "./output/OutputReference";

export const container = new Container();

container.bind(TOKENS.refService).toInstance(RefService).inSingletonScope();
container
  .bind(TOKENS.apiDocumentService)
  .toInstance(ApiDocumentService)
  .inSingletonScope();
container
  .bind(TOKENS.outputPageHeader)
  .toInstance(OutputPageHeader)
  .inTransientScope();
container
  .bind(TOKENS.outputPathDetail)
  .toInstance(OutputPathDetail)
  .inTransientScope();
container
  .bind(TOKENS.outputReference)
  .toInstance(OutputReference)
  .inTransientScope();
container
  .bind(TOKENS.convertMarkdown)
  .toInstance(ConvertMarkdown)
  .inTransientScope();
container
  .bind(TOKENS.requestBodyToMarkdown)
  .toInstance(RequestBodyToMarkdown)
  .inTransientScope();
container
  .bind(TOKENS.responsesObjectToMarkdown)
  .toInstance(ResponsesObjectToMarkdown)
  .inTransientScope();
container
  .bind(TOKENS.schemaToTableService)
  .toInstance(SchemaToTableService)
  .inTransientScope();
