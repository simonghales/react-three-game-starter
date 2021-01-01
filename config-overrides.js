
const WorkerPlugin = require('worker-plugin');

module.exports = function override(config, env) {
    config.plugins.push(new WorkerPlugin());
    return config;
}