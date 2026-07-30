export const getArgsValue = (arg) => {
  const args = process.argv.slice(2);

  if (!args.length) {
    return null;
  }

  if (arg === 'color') {
    const regexHexColor = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    const param = args[args.indexOf(`--${arg}`) + 1];

    return regexHexColor.test(param) ? param : null;
  }

  if (args.indexOf(`--${arg}`) !== -1) {
    const param = args[args.indexOf(`--${arg}`) + 1];

    return (typeof Number(param) === 'number' && !isNaN(Number(param))) ? param : null;
  }

  return null;
}

export const colorHex = (hex, text) => {
  if (hex === 'none') {
    return `\x1b[0m${text}\x1b[0m`;
  }

  const [r, g, b] = hex
    .replace('#', '')
    .match(/.{2}/g)
    .map(c => parseInt(c, 16));

  return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
}