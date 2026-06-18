#!/usr/bin/env node
import { program } from "commander";
import { initStorage } from "./src/services/storageService.js";
import { registerFetchCommand } from "./src/commands/fetch.js";
import { registerFollowCommand } from "./src/commands/follow.js";
import { registerShowCommand } from "./src/commands/stat.js";

program
  .name("cs-market-util")
  .description("CLI утилита для парсинга и анализа рынка CS market")
  .version("1.1.0");

const beforeEach = async (action) => {
  await initStorage();
  await action();
};

registerFetchCommand(program, beforeEach);
registerFollowCommand(program, beforeEach);
registerShowCommand(program, beforeEach);

program.parse();
