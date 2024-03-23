const Datastore = require('nedb');
const db = new Datastore({ filename: 'users.db', autoload: true });

module.exports = db;
