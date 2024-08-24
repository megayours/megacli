import { Command } from 'commander';
import { query } from '../../utils/chromia.mjs';
import { console } from 'console';

export const dappListCommand = new Command('list')
  .description('Lists all dapps')
  .action(async () => {
    try {
      const dapps = await query('sealed.get_dapps', {});
      console.log(dapps);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
