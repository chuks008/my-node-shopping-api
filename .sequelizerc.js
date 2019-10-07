const path = require('path');

module.exports = {
    'config': path.resolve('config', 'config.json'),
    'migrations-path': path.resolve('src','migrations'),
    'models-path': path.resolve('src','models'),
    'seeders-path': path.resolve('src','seeders')
}