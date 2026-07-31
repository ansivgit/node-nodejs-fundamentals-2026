const dynamic = async () => {
    let pluginName = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))[0];

    if (!pluginName) {
      console.info('Plugin not found');
      process.exit(1);
    }

    if (!pluginName.endsWith('.js')) {
      pluginName = `${pluginName}.js`;
    }
  try {
    const plugin = await import(`./plugins/${pluginName}`);
    console.info(plugin.run());

    process.exit(1);
  } catch (err) {
    console.info('Plugin not found');
    process.exit(1);
  }
};

await dynamic();
