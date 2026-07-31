import {readdir} from "node:fs/promises";

const dynamic = async () => {
  try {
    const entities = await readdir('src/modules/plugins', { withFileTypes: true });
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
    const plugins = new Set();
    let currentPlugin = '';

    if (!args.length) {
      console.info('Plugin not found');
      process.exit(1);
    }

    for (const entity of entities) {
      const fileName = entity.name.slice(0, -3);

      if (!entity.isFile()) {
        console.info('Plugin not found');
        process.exit(1);
      }

      plugins.add(fileName);
    }

    plugins.forEach((plugin) => {
      if (args[0] === plugin || args[0] === `${plugin}.js`) {
        currentPlugin = plugin;
      }
    })
    // console.log(`Current plugin: ${currentPlugin}`);

    if (!currentPlugin) {
      console.info('Plugin not found');
      process.exit(1);
    }

    const pluginFunction = await import(`./plugins/${currentPlugin}.js`);
    console.info(pluginFunction.run());

    process.exit(1);
  } catch (err) {
    console.error(err);
  }
};

await dynamic();
