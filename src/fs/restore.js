import path from 'node:path';
import { access, constants, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

import { getBasePath } from '../utils.js';
import { ERR_MSG } from '../constants.js';

const targetFolderName = 'workspace_restored';

const restore = async () => {
  const basePath = getBasePath();
  const pathToSnapshot = path.join(basePath, 'workspace');
  const pathToTarget = path.join(basePath, targetFolderName);

  let data;

  try {
    data = JSON.parse(await readFile(`${pathToSnapshot}/snapshot.json`, 'utf8'));

  } catch (err) {
    console.info(ERR_MSG, err);
    return;
  }

  try {

    await access(pathToTarget, constants.F_OK);
    throw new Error(`${ERR_MSG} Target folder already exists`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    await mkdir(pathToTarget);
  }

  for (const entry of data.entries) {
    const fullPath = path.join(pathToTarget, entry.path);
    const dir = path.dirname(fullPath);

    if (!await access(dir, constants.F_OK)) {
      await mkdir(dir, { recursive: true });
    }

    if (entry.type === 'file') {
      const buffer = Buffer.from(entry.content, 'base64');

      await writeFile(fullPath, buffer);
    } else if (entry.type === 'directory') {
      await mkdir(fullPath);
    }
  }
};

await restore();
