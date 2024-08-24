/* global buffer, console, process */

import { Command } from 'commander';
import fs from 'fs';
import YAML from 'yaml';
import { execa } from 'execa';
import { sendTx } from '../../utils/chromia.mjs';
import path from 'path';

export const dappPublishCommand = new Command('deploy')
  .argument('<blockchain>', 'Blockchain to publish')
  .description('Publishes a library as a sealed module')
  .action(async (blockchain) => {
    try {
      const buildResult = await execa('chr', ['build'], { stdio: 'inherit' });
      if (buildResult.exitCode !== 0) {
        throw new Error(
          `chr build failed with exit code ${buildResult.exitCode}`
        );
      }

      // Inspect chromia.yml
      const chromiaConfig = fs.readFileSync('chromia.yml', 'utf8');
      const config = YAML.parse(chromiaConfig);

      if (!config.blockchains[blockchain]) {
        throw new Error(`Blockchain ${blockchain} not found in chromia.yml`);
      }

      // Extract entries from XML files
      const xmlFiles = fs
        .readdirSync('build')
        .filter((file) => file.endsWith(`${blockchain}.xml`));
      if (xmlFiles.length !== 1) {
        throw new Error(
          `Expected exactly one XML file for blockchain ${blockchain}, found ${xmlFiles.length}`
        );
      }

      const blockchainRid = Buffer.from('DEADBEEF', 'hex');

      for (const file of xmlFiles) {
        console.log(`Processing file: ${file}`);
        const xmlContent = fs.readFileSync(path.join('build', file), 'utf8');
        await sendTx({
          name: 'sealed.submit_deployment',
          args: [blockchainRid, xmlContent],
        });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
