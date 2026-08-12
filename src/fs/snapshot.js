import path from 'node:path';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';

import { getBasePath } from '../utils.js';
import { ERR_MSG } from '../constants.js';

const snapshot = async () => {
  //! change to root project path
  const basePath = getBasePath();
  const pathToWorkspace = path.join(basePath, 'workspace');

  const entries = [];

  try {
    const entities = await readdir(pathToWorkspace, { recursive: true, withFileTypes: true });

    console.info(entities);

    for (const entity of entities) {
      const fileName = entity.name;
      const fullPath = path.join(entity.parentPath, fileName);
      const relEntityPath = path.relative(pathToWorkspace, fullPath);

      if (entity.isDirectory()) {
        entries.push({ path: relEntityPath, type: 'directory' });
      }

      if (entity.isFile()) {
        //! Skip .DS_Store and snapshot.json files - remove for cross-check
        if (fileName === '.DS_Store' || fileName === 'snapshot.json') {
          continue;
        }

        const info = await stat(fullPath);

        const buffer = await readFile(fullPath);
        const base64 = buffer.toString('base64');

        entries.push({ path: relEntityPath, type: 'file', size: info.size, content: base64 });
      }
    }

    const result = {
      rootPath: pathToWorkspace,
      entries,
    };

    console.info(result);

    await writeFile(
      path.join(pathToWorkspace, 'snapshot.json'),
      JSON.stringify(result));
  } catch (err) {
    throw new Error(ERR_MSG, err);
  }
};

await snapshot();
