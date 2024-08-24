import { Command } from 'commander';
import { modulePublishCommand } from './publish.mjs';

export const moduleCommand = new Command('module')
  .description('Module related commands')
  .addCommand(modulePublishCommand);