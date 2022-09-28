#!/usr/bin/env node
import { program } from "commander";
import { convertMarkdown } from "./lib/convert-markdown";

program
  .version(process.env.npm_package_version || "unknown")
  .option("-s, --sort", "sort", false)
  .arguments("<source> [destination]")
  .action((src, dest, options) => {
    convertMarkdown(src, dest);
  });
program.parse(process.argv);
