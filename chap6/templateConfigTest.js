const JsonConfig = require('./jsonConfig');

const jsonConfig = new JsonConfig();
jsonConfig.read('samples/conf.json');
jsonConfig.set('nodejs','deeesign patterns');
jsonConfig.save('samples/conf_mod.json');