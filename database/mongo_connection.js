const {MONGO_DB_URI,DB_OPTION} = require("../config/dbConfig")
const MongoClient = require('mongodb').MongoClient;


var db,db_client;

function connectToServer( callback ) {
    MongoClient.connect(MONGO_DB_URI,  { useUnifiedTopology: true , useNewUrlParser: true}, function( err, client ) {
       try {
        if(db){
            db  = client.db(DB_OPTION[1].database);
            db_client=client;
        }
       
       } catch (error) {
           
       }
       
        return callback( err );
    })
}

function getDb() {
    return db
}



function closeClient() {
    try {
        db_client.close();
    } catch (error) {

    }
   
}


module.exports = {connectToServer, getDb,closeClient}

