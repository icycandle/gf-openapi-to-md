#!/usr/bin/env node
import { program } from "commander";
import { TOKENS } from "./lib/token";
import { container } from "./lib/container";

program
  .version(process.env.npm_package_version || "unknown")
  .arguments("<source> [destination]")
  .action((src, dest) => {
    const convertMarkdown = container.get(TOKENS.convertMarkdown);
    convertMarkdown.readAndWrite(src, dest);
  });
program.parse(process.argv);
