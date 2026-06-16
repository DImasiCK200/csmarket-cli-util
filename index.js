#!/usr/bin/env node
import { program } from "commander";
import { initStorage } from "./src/services/storageService.js";
import { registerFetchCommand } from "./src/commands/fetch.js";

program
  .name("cs-market-util")
  .description("CLI утилита для парсинга и анализа рынка CS market")
  .version("1.1.0");

const beforeEach = async (action) => {
  await initStorage();
  await action();
};

registerFetchCommand(program, beforeEach);

program.parse();
