import { Command } from 'commander';
import { query } from '../../utils/chromia.mjs';
import { Buffer } from 'buffer';
import { console } from 'console';

export const dappDeploymentsCommand = new Command('deployments')
  .description('Lists all dapp deployments')
  .action(async () => {
    try {
      const deployments = await query('sealed.get_dapp_deployments', {
        blockchain_rid: Buffer.from('DEADBEEF', 'hex'),
      });
      for (const deployment of deployments) {
        console.log(`Hash: ${deployment.hash.toString('hex')}`);
        console.log(`Date: ${new Date(deployment.timestamp).toLocaleString()}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
