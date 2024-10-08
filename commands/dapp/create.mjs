/* global buffer, console, process */
import { Command } from 'commander';
import { sendTx } from '../../utils/chromia.mjs';

export const dappCreateCommand = new Command('create')
  .description('Creates a new dapp')
  .action(async () => {
    const blockchainRid = Buffer.from('DEADBEEF', 'hex');
    try {
      await sendTx({
        name: 'sealed.create_dapp',
        args: [blockchainRid],
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
