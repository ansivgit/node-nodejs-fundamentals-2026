import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const getBasePath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return __dirname.split(path.sep).splice(0, 3).join(path.sep);
};
