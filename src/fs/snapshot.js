import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';

const ERR_MSG = 'FS operation failed';

const snapshot = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const basePath = __dirname.split(path.sep).splice(0, 3).join(path.sep);
  // const pathToWorkspace = path.join(__dirname, '..'); //* path to src
  const pathToWorkspace = path.join(basePath, 'workspace');

  const entries = [];

  try {
    const entities = await readdir(pathToWorkspace, { recursive: true, withFileTypes: true });

    for (const entity of entities)
      if (entity.isDirectory()) {
        entries.push({ path: entity.name, type: 'directory' });
      } else if (entity.isFile()) {
        const fileName = entity.name;

        const fullPath = path.join(entity.parentPath, fileName);
        const relFilePath = path.relative(pathToWorkspace, fullPath);

        const info = await stat(fullPath);

        const buffer = await readFile(fullPath);
        const base64 = buffer.toString('base64');

        entries.push({ path: relFilePath, type: 'file', size: info.size, content: base64 });
      }

      const result = {
        "rootPath": pathToWorkspace,
        "entries": entries,
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
