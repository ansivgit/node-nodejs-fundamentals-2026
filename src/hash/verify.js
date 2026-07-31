import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { ERR_MSG } from '../constants.js';

const getFileHash = async (filepath) => {
  const hash = createHash('sha256');
  const readableStream = createReadStream(filepath);

  await pipeline(readableStream, hash);

  return hash.digest('hex');
}

const verify = async () => {
  let data;

  try {
    data = JSON.parse(await readFile('./checksums.json', 'utf8'));
  } catch {
    throw new Error(ERR_MSG);
  }

  for(const [filename, expectedHash] of Object.entries(data)) {
    try {
      const actualHash = await getFileHash(`./files/${filename}`);

      if (actualHash === expectedHash) {
        console.info(`${filename} — OK`);
      } else {
        console.info(`${filename} — FAIL`);
      }
    } catch (err) {
      console.info(`${filename} — FAIL`);
    }
  }
};

await verify();
