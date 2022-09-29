import { IApiDocumentService } from "../services/ApiDocumentService";
import { injected } from "brandi";
import { TOKENS } from "../token";
import { downGradeMarkdownTitle } from "../utils";
import { IOutputHelper } from "./OutputHelper.interface";

export class OutputPageHeader implements IOutputHelper {
  constructor(private apiDocumentService: IApiDocumentService) {}

  public output(): string {
    const document = this.apiDocumentService.get().document;
    const versionText = document.info.version
      ? `Version ${document.info.version}`
      : "";

    const descriptionText = document.info.description || "";
    return [
      `# ${document.info.title || "Api-Document"}`,
      `> ${versionText}`,
      "## Overview",
      "[TOC]",
      downGradeMarkdownTitle(descriptionText),
      "",
    ].join("\n\n");
  }
}

injected(OutputPageHeader, TOKENS.apiDocumentService);
