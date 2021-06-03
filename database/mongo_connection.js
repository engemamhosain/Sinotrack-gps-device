const {MONGO_DB_URI,DB_OPTION} = require("../config/dbConfig")
const MongoClient = require('mongodb').MongoClient;


var db;

function connectToServer( callback ) {
    MongoClient.connect(MONGO_DB_URI,  { useUnifiedTopology: true , useNewUrlParser: true }, function( err, client ) {
        db  = client.db(DB_OPTION[1].database);
        return callback( err );
    })
}

function getDb() {
    return db
}

module.exports = {connectToServer, getDb}

