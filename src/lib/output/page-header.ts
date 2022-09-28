import { ApiDocument } from "../../type";

export function outputPageHeader({ document }: ApiDocument): string {
  const versionText = document.info.version
    ? `Version ${document.info.version}`
    : "";

  const descriptionText = document.info.description || "";

  return `

# ${document.info.title || "Api-Document"}
 
 > ${versionText}

${descriptionText}

## Overview

[TOC]

`;
}
