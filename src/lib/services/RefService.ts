function _refLink(path: string): string {
  const pathSubStr = path.split("/");
  const name = pathSubStr[pathSubStr.length - 1];
  return `[${name}](#${name})`;
}

export interface IRefService {
  refLinkPathList: string[];
  refLink: (path: string) => string;
}

export class RefService implements IRefService {
  refLinkPathList: string[];

  constructor() {
    this.refLinkPathList = [];
  }

  refLink(path: string) {
    if (!this.refLinkPathList.includes(path)) {
      this.refLinkPathList.push(path);
    }
    return _refLink(path);
  }
}
