import { promises as fs } from "fs";
import { injected } from "brandi";
import { TOKENS } from "./token";
import { IApiDocumentService } from "./services/ApiDocumentService";
import { IOutputHelper } from "./output/OutputHelper.interface";

export interface IConvertMarkdown {
  readAndWrite: (
    srcFile: string,
    destFile: string | undefined
  ) => Promise<void>;
}

export class ConvertMarkdown implements IConvertMarkdown {
  constructor(
    private apiDocumentService: IApiDocumentService,
    private outputPageHeader: IOutputHelper,
    private outputPathDetail: IOutputHelper,
    private outputReference: IOutputHelper
  ) {}

  buildOutput(): string {
    return [this.outputPageHeader, this.outputPathDetail, this.outputReference]
      .map((service) => service.output())
      .join("\n\n")
      .trimEnd();
  }

  public async readAndWrite(srcFile: string, destFile: string | undefined) {
    await this.apiDocumentService.init(srcFile);

    const output = this.buildOutput();

    if (destFile) {
      fs.writeFile(destFile, output, "utf8");
    } else {
      console.log(output);
    }
  }
}

injected(
  ConvertMarkdown,
  TOKENS.apiDocumentService,
  TOKENS.outputPageHeader,
  TOKENS.outputPathDetail,
  TOKENS.outputReference
);
