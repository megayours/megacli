import { Command } from 'commander';
import { sendTx } from '../../utils/chromia.mjs';
import { Buffer } from 'buffer';
import { console } from 'console';

export const dappLinkModuleCommand = new Command('link-module')
  .argument('<module>', 'Module Path to Link')
  .description('Links a module to a blockchain')
  .action(async (module) => {
    try {
      const blockchainRid = Buffer.from("DEADBEEF", "hex");
      await sendTx({
        name: 'sealed.link_module',
        args: [
          blockchainRid,
          module
        ]
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });