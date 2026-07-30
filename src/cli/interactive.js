import { createInterface } from 'node:readline/promises';
import { cwd, uptime } from 'node:process';

const interactive = () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    getHandler(line);
    rl.prompt();
  })
  .on('close', () => {
    getHandler('exit');
  });
};

const getHandler = (line) => {
  const command = line.trim();

  switch (command) {
    case 'uptime':
      console.info(Math.floor(uptime() * 100) / 100);
      break;
    case 'cwd':
      console.info(cwd());
      break;
    case 'date':
      console.info(new Date().toISOString());
      break;
    case 'exit':
      console.info('Goodbye!');
      process.exit(0);
      break;
    default:
      console.info('Unknown command');
      break;
  }
}

interactive();
