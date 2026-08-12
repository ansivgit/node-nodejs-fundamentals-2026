import path from 'node:path';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';

import { getBasePath } from '../utils.js';
import { ERR_MSG } from '../constants.js';

const findByExt = async () => {
  const basePath = getBasePath();
  const pathToWorkspace = path.join(basePath, 'workspace');

  const output = [];

  try {
    const entities = await readdir(pathToWorkspace, { recursive: true, withFileTypes: true });
    const args = process.argv.slice(2);

    if (args.length && args[0] !== '--ext') {
      throw new Error('Unknown arguments');
    }

    const extensions = args.length ? args.slice(1) : ['txt'];

    for (const entity of entities) {
      const fileName = entity.name;
      const fullPath = path.join(entity.parentPath, fileName);
      const relEntityPath = path.relative(pathToWorkspace, fullPath);

      if (entity.isFile()) {
        const ext = await path.parse(fullPath).ext;

        if (!extensions.includes(ext && ext.slice(1))) {
          continue;
        }

        output.push(relEntityPath);
      }
    }

    if (!output.length) {
      console.info('No files with this extensions found');
      return;
    }

    output.sort((a, b) => a.localeCompare(b)).forEach((path) => console.info('File:', path));
  } catch (err) {
    throw new Error(ERR_MSG, err);
  }
};

await findByExt();
