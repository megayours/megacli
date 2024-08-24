import { Command } from "commander";
import { query } from "../../utils/chromia.mjs";
import { Buffer } from 'buffer';
import { console } from 'console';

export const dappConfigCommand = new Command('config')
  .argument('<hash>', 'Hash of the dapp')
  .description('Retrieves the configuration associated with a hash')
  .action(async (hash) => {
    try {
      const config = await query('sealed.get_deployment_config', {
        blockchain_rid: Buffer.from("DEADBEEF", "hex"),
        hash: Buffer.from(hash, "hex"),
      });
      console.log(config);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });