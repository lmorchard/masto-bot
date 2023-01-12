#!/usr/bin/env node
import Complimentron from "./bot.js";

async function main() {
  return new Complimentron().run();
}

main().catch(console.error);
