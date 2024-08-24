/* global buffer, console, process */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { execa } from 'execa';
import { findEntryContent } from '../../utils/xmlUtils.mjs';
import { sendTx } from '../../utils/chromia.mjs';

export const modulePublishCommand = new Command('publish')
  .argument('<library>', 'Library to publish')
  .description('Publishes a library as a sealed module')
  .action(async (library) => {
    try {
      const buildResult = await execa('chr', ['build'], { stdio: 'inherit' });
      if (buildResult.exitCode !== 0) process.exit(buildResult.exitCode);

      // Inspect chromia.yml
      const chromiaConfig = fs.readFileSync('chromia.yml', 'utf8');
      const config = YAML.parse(chromiaConfig);

      if (!config.libs[library]) {
        throw new Error(`Library ${library} not found in chromia.yml`);
      }

      // Extract entries from XML files
      const xmlFiles = fs
        .readdirSync('build')
        .filter((file) => file.endsWith('.xml'));
      const entries = [];

      const modulePath = `lib/${library}`;

      for (const file of xmlFiles) {
        console.log(`Processing file: ${file}`);
        const xmlContent = fs.readFileSync(path.join('build', file), 'utf8');
        const entryContent = findEntryContent(xmlContent, modulePath);
        entryContent.forEach((value, key) => {
          entries.push({ key, value });
        });
      }

      // Concatenate XML entries into a single string
      const xmlEntriesString = entries
        .map((entry) => {
          return `<entry key="${entry.key}">\n<string>${entry.value}</string>\n</entry>`;
        })
        .join('\n');

      const moduleConfig = `<dict>\n${xmlEntriesString}\n</dict>`;

      await sendTx({
        name: 'sealed.upload_module',
        args: [library, moduleConfig],
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
