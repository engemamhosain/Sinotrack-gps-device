const INSERT_QUERY = require("../config/mysqlQuery");
const CONNECTION= require("../database/connection");
 const MongoCon = require("../database/mongo_connection");
const Sinotrack = require("../models/Sinotrack");


 class SinotracService {

      sinotrack = null;

    constructor(buffer){
      try {
        this.sinotrack = new Sinotrack(buffer.toString('utf8'));
        this.sinotrack.makeMysqlObject();
       this.updateGpsDataToMysql();
       
       this.updateGpsDataToMongo();
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
                let collection_gps_device_location = MongoCon.getDb().collection('gps_device_location');
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

  module.exports = SinotracService;
