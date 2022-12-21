#!/usr/bin/env node
import { Command } from "commander";

const MODULES = [
  ["lib", ["config", "logger", "data"]],
  ["commands", ["init", "auth", "streaming", "notifications"]],
];

async function main() {
  const program = new Command();
  const context = { program };
  for (const [moduleDir, moduleNames] of MODULES) {
    for (const moduleName of moduleNames) {
      (await import(`./${moduleDir}/${moduleName}.js`)).init(context);
    }
  }
  await program.parseAsync(process.argv);
}

main().catch((err) => console.error(err));
