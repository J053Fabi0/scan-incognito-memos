const Datastore = require("nedb-promises");

const blocksDB = Datastore.create({ filename: "./db/blocks.db", autoload: true });
blocksDB.persistence.setAutocompactionInterval(86_400_000); // Compacts database every day
module.exports.blocksDB = blocksDB;

const memosDB = Datastore.create({ filename: "./db/memos.db", autoload: true });
memosDB.persistence.setAutocompactionInterval(86_400_000); // Compacts database every day
module.exports.memosDB = memosDB;
