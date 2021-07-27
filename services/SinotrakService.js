const INSERT_QUERY = require("../config/mysqlQuery");
 const CONNECTION= require("../database/connection");
 const MongoDbClient = require("../database/mongo_connection");
 //const MongoCon = require("../database/mongo_connection");
const Sinotrack = require("../models/Sinotrack");
const MONGO_INTERVAL_TIME = 10;
const imei_ids=["FFFF9FFF","FFFFB9FF"]
const collection_name=["gps_device_location_"];
 class SinotrackService {

      sinotrack = null;

    constructor(buffers) {
      try {
        let arrayofBuffer=buffers.toString('utf8').split("#");
        for(var i=0;i<arrayofBuffer.length;i++){
          if(arrayofBuffer[i].length<10){
            continue;
          }
          this.sinotrack = new Sinotrack(arrayofBuffer[i]);
         this.updateGpsDataToMysql();
         this.updateGpsDataToMongo();

        }
      
      } catch (error) {
        throw error;  
      }
  
    }

  

    updateGpsDataToMysql= () => {
     
      try {
      

          if(this.sinotrack!=null) {

            CONNECTION.getConnection((err, connection) => {
              if(err) throw err;


              connection.query(INSERT_QUERY,this.sinotrack.getMysqlObject(), function(err, result){
  
                  connection.release(); // return the connection to pool
                  if(err) throw err;

              });

          });


            // CONNECTION.query(INSERT_QUERY,this.sinotrack.getMysqlObject(), function(err, result){
            //   if (err){
            //     throw err;
            //   }
            // });

          }

        
       
         
  
        } catch (error) {    
         throw error
        }
    }

   
      async updateGpsDataToMongo() {
      try {
        
     
          if(this.sinotrack!=null) { 
            try{
              let date= new Date().getMinutes()%MONGO_INTERVAL_TIME;
              let obj=this.sinotrack.getMongoObject();

              if(obj.bits==imei_ids[0] || obj.bits==imei_ids[1]){

                if(date==0 && parseInt(new Date().getSeconds()/MONGO_INTERVAL_TIME)==2 ){                
                  new MongoDbClient(obj);
                }
              }else{
          
                new MongoDbClient(obj);
              }
                
             

            }catch(error){
             throw error;
            }

       
        }  
  
        } catch (error) {  
          throw error
        }
    }


    async  test() {
      console.log("test async")
    }


  }

  module.exports = SinotrackService;

