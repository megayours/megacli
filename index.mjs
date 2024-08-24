#!/usr/bin/env node

import { Command } from 'commander';
import { dappCommand } from './commands/dapp/index.mjs';
import { moduleCommand } from './commands/module/index.mjs';
import { process } from 'process';

const program = new Command();

program
  .version('1.0.0')
  .description('My CLI Wrapper')
  .addCommand(moduleCommand)
  .addCommand(dappCommand);

program.parse(process.argv);
