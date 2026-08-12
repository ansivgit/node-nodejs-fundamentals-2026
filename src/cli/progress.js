import { colorHex, getArgsValue } from './helpers.js';

const progress = () => {
  const defaultBarValues = {
    duration: 5000,
    interval: 100,
    length: 30,
    color: 'none',
  };

  let currentTime = 0;
  let duration = getArgsValue('duration') ?? defaultBarValues.duration;
  let interval = getArgsValue('interval') ?? defaultBarValues.interval;
  let length = getArgsValue('length') ?? defaultBarValues.length;
  let color = getArgsValue('color') ?? defaultBarValues.color; // test color '#FF5733'

  const timerFinished = () => {
    clearInterval(progressInterval);
    console.info('\n');
    console.info('Done!');
  };

  setTimeout(timerFinished, duration + 100);

  const drawProgressBar = (progress) => {
    const filledWidth = Math.floor(progress / 100 * length);
    const emptyWidth = length - filledWidth;

    const progressBar = colorHex(color, '█').repeat(filledWidth) + ' '.repeat(emptyWidth);
    return `[${progressBar}] ${progress}%`;
  };

  const incTime = () => {
    currentTime += interval;
    const progressPercentage = Math.round(currentTime / duration * 100);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Progress: ${drawProgressBar(progressPercentage)}`);
  };

  const progressInterval = setInterval(incTime, interval);
};

progress();
