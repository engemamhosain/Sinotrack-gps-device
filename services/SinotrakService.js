const INSERT_QUERY = require("../config/mysqlQuery");
const CONNECTION= require("../database/connection");
 const MongoCon = require("../database/mongo_connection");
const Sinotrack = require("../models/Sinotrack");
const MONGO_INTERVAL_TIME = 10;
const collection_name=["gps_device_location_"];
 class SinotrackService {

      sinotrack = null;

    constructor(buffers){
      try {
        let arrayofBuffer=buffers.toString('utf8').split("#");
        for(var i=0;i<arrayofBuffer.length;i++){
          if(arrayofBuffer[i].length<10){
            continue;
          }
          this.sinotrack = new Sinotrack(arrayofBuffer[i]);
       //  this.updateGpsDataToMysql();
         this.updateGpsDataToMongo();

        }
      
      } catch (error) {
        throw error;  
      }
  
    }

  

    updateGpsDataToMysql= ()=>{
     
      try {
      

          if(this.sinotrack!=null){

            CONNECTION.query(INSERT_QUERY,this.sinotrack.getMysqlObject(), function(err, result){
              if (err){
                throw err;
              }
            });

          }

        
       
         
  
        } catch (error) {    
         throw error
        }
    }


     updateGpsDataToMongo(){
      try {
        
     
          if(this.sinotrack!=null){ 
            try{
              let date= new Date().getMinutes()%MONGO_INTERVAL_TIME;
              let obj=this.sinotrack.getMongoObject();
              
              if(date==0 && parseInt(new Date().getSeconds()/MONGO_INTERVAL_TIME)==2|| obj.bits=="FFFF9FFB"|| obj.bits=="FFFF9FFB" ){
             
              MongoCon.connectToServer( function( err) {
                if (err) console.log(err);
                let date=new Date();
                let month=date.getMonth()+1;
                let collectionName=date.getDate()+"_"+month+"_"+date.getFullYear();
               
                let collection_gps_device_location = MongoCon.getDb().collection(collection_name+collectionName);
               // collection_gps_device_location.insertOne(obj); 

                MongoCon.closeClient();

              });
            }
            }catch(error){
              console.log("err from updateGpsDataToMongo")
             throw error;
            }

       
        }  
  
        } catch (error) {  
          console.log("err from updateGpsDataToMongo")  
          throw error
        }
    }

  }

  module.exports = SinotrackService;
