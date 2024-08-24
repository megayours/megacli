import { Command } from 'commander';
import { dappCreateCommand } from './create.mjs';
import { dappLinkModuleCommand } from './linkModule.mjs';
import { dappPublishCommand } from './deploy.mjs';
import { dappListCommand } from './list.mjs';
import { dappDeploymentsCommand } from './deployments.mjs';
import { dappConfigCommand } from './config.mjs';

export const dappCommand = new Command('dapp')
  .description('Dapp related commands')
  .addCommand(dappCreateCommand)
  .addCommand(dappLinkModuleCommand)
  .addCommand(dappPublishCommand)
  .addCommand(dappListCommand)
  .addCommand(dappDeploymentsCommand)
  .addCommand(dappConfigCommand);
