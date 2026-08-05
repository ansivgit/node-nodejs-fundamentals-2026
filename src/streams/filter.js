import { Transform } from 'node:stream';

const filter = () => {
  let tail = '';
  const args = process.argv.slice(2);

  if (args.length && args[0] !== '--pattern') {
    throw new Error('Unknown arguments');
  }

  const pattern = args.length ? args.slice(1).join(' ') : '';

  const transformStream = new Transform({
    transform(chunk, _, callback) {
      tail += chunk.toString();
      const lines = tail.split(/\\n|\r?\n/);
      tail = lines.pop() ?? '';

      const out = lines
        .filter((line) => line.includes(pattern))
        .map((line) => `${line}\n`)
        .join('\n');

      callback(null, out);
    },

    flush(callback) {
      if (tail.length > 0 && tail.includes(pattern)) {
        callback(null, `${tail}\n`);
        return;
      }
      callback();
    },
  });

  process.stdin.pipe(transformStream).pipe(process.stdout).pipe(process.stderr);
};

filter();
