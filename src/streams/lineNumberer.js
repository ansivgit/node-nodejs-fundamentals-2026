import { Transform } from 'node:stream';

let tail = '';
let lineNumber = 1;

const transformStream = new Transform({
  transform(chunk, _, callback) {
    tail += chunk.toString();
    const lines = tail.split(/\\n|\r?\n/);
    tail = lines.pop() ?? '';

    const out = lines
      .map((line) => `${lineNumber++} | ${line}\n`)
      .join('');

    callback(null, out);
  },

  flush(callback) {
    if (tail.length > 0) {
      callback(null, `${lineNumber} | ${tail}\n`);
      return;
    }
    callback();
  },
});

const lineNumberer = () => {
  process.stdin.pipe(transformStream).pipe(process.stdout);
};

lineNumberer();
