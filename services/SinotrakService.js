const INSERT_QUERY = require("../config/mysqlQuery");
const CONNECTION= require("../database/connection");
 const MongoCon = require("../database/mongo_connection");
const Sinotrack = require("../models/Sinotrack");

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
          this.sinotrack.makeObject();
         this.updateGpsDataToMysql();
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
    
        let date= new Date().getMinutes()%10;
        if( date==0 && new Date().getSeconds()%10==2 || this.sinotrack.speed>5){

          if(this.sinotrack!=null){

            try{
              let obj=this.sinotrack.getMongoObject();
              MongoCon.connectToServer( function( err) {
                if (err) console.log(err);
                let date=new Date();
                let month=date.getMonth()+1;
                let collectionName=date.getDate()+"_"+month+"_"+date.getFullYear();
                let collection_gps_device_location = MongoCon.getDb().collection(collection_name+collectionName);
                collection_gps_device_location.insertOne(obj);  
              });
      
            }catch(error){
             throw error;
            }

          }
        }  
  
        } catch (error) {    
          throw error
        }
    }

  }

  module.exports = SinotrackService;
