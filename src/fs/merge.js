import path from 'node:path';
import { readdir, readFile, writeFile} from 'node:fs/promises';

import { getBasePath } from '../utils.js';
import { ERR_MSG } from '../constants.js';


const getFileContent = async (fullPath) => {
  try {
    const buffer = await readFile(fullPath);
    return buffer.toString('utf8');
  } catch {
    throw new Error(ERR_MSG);
  }
}

const merge = async () => {
  const basePath = getBasePath();
  const pathToParts = path.join(basePath, 'workspace', 'parts');

  const files = [];

  try {
    const entities = await readdir(pathToParts, { recursive: true, withFileTypes: true });
    const args = process.argv.slice(2);

    if (args.length > 1) {
      if (args[0] !== '--files') {
        console.info('Unknown arguments');
      } else {
        const temp = args
          .slice(1)
          .join(',')
          .split(',')
          .filter((fileName) => fileName.length);

        files.push(...temp);
      }
    } else {
      for (const entity of entities) {
        if (entity.isFile()) {
          files.push(entity.name);
        }
      }

      files.sort((a, b) => a.localeCompare(b));
    }

    const txtFiles = files.filter((fileName) => fileName.slice(-3) === 'txt');

    if (!txtFiles.length) {
      console.info('No files with "txt" extensions found');
      throw new Error(ERR_MSG);
    }

    let result = '';

    for (const fileName of txtFiles) {
      const filePath = path.join(pathToParts, fileName);
      const content = await getFileContent(filePath);

      result = result.concat(content);
    }

    await writeFile(path.join(basePath, 'workspace', 'merged.txt'), result);
  } catch (err) {
   throw new Error(ERR_MSG);
  }
};

await merge();
