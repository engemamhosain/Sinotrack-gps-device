const {MONGO_DB_URI,DB_OPTION} = require("../config/dbConfig")
const MongoClient = require('mongodb').MongoClient;
const collection_name=["gps_device_location_"];




class MongoDbClient{
    obj=null;
    
    constructor(obj) {
    this.obj=obj;
      this.insertMongoData(obj);
    }
  


    
    insertMongoData =(obj)=> {

        MongoClient.connect(MONGO_DB_URI,{useUnifiedTopology: true},function(err, client) {
          if(err){
                throw err
          }
          
          let date=new Date();
          let month=date.getMonth()+1;
          let collectionName=date.getDate()+"_"+month+"_"+date.getFullYear();
           const database  = client.db(DB_OPTION[1].database);
            const collection_gps_device_location = database.collection(collection_name+collectionName);
          
            collection_gps_device_location.insertOne(obj,function(err, item){
              //  collection_gps_device_location.createIndex({imei_id:1})
                client.close();

                if(err){
                    throw err
               }else{
                // console.log(item);
               }
            });

        });
    }    
}

module.exports = MongoDbClient

