const QUERY = require("../config/mysqlQuery");
 //const CONNECTION= require("../database/connection");
 const MongoDbClient = require("../database/mongo_connection");
 //const MongoCon = require("../database/mongo_connection");
const Sinotrack = require("../models/Sinotrack");
const Geofence = require("../models/Geofence");
const MONGO_INTERVAL_TIME = 10;
const imei_ids=["FFFF9FFF","FFFFB9FF","FFFFBBFF"]
const collection_name=["gps_device_location_"];
 class SinotrackService {

      sinotrack = null;

      CONNECTION = null

    constructor(buffers,CONNECTION) {
      try {
        this.CONNECTION = CONNECTION;
        let arrayofBuffer=buffers.toString('utf8').split("#");
       
        for(var i=0;i<arrayofBuffer.length;i++){
          if(arrayofBuffer[i].length<90){
            continue;
          }
          this.sinotrack = new Sinotrack(arrayofBuffer[i]);

         this.updateGpsDataToMysql();

        // basic package package 
         if(this.sinotrack.speed>5){
          this.setGeofencInfo(); 
         }
        
         this.updateGpsDataToMongo();

        }
      
      } catch (error) {
        throw error;  
      }
  
    }

  

    updateGpsDataToMysql= () => {
     
      try {
      
         
          if(this.sinotrack!=null) {

            let mysqlData=this.sinotrack.getMysqlObject();

            // if(mysqlData.imei_id==9170544140){
            //   console.log(mysqlData)

            // }


            if(mysqlData.imei_id=="NaN" || mysqlData.lat=="NaN"){
              return
            }

            let sinotrakObj=this.sinotrack;
    
            this.CONNECTION.getConnection((err, connection) => {
             
          
              let conn=connection;
              if(err) {

                if(typeof connection !== 'undefined' && connection) {
                  
                  connection.release();
                  console.log("err from initial")
                 }
               
              }else{
                    connection.query(QUERY.GET_LAST_UPDATE_LOCATION_QUERY,mysqlData.imei_id, function(err, result){

                      if(err) {
                        console.log("err from first query ",err)
                        console.log(result)
                        connection.release(); 
                        return;
                      }  


                  

                        sinotrakObj.SendEngineStatusNotification(result)

                        // if(mysqlData.imei_id==6170944873){
                        //   console.log("after first  query",result)
    
                        // }
                    
                        connection.query(QUERY.INSERT_QUERY,mysqlData, function(err, result){
                        

                          // if(mysqlData.imei_id==6170944873){
                          //   console.log("after second  query",result)
      
                          // }

                          conn.release();
                        

                         if(err) {
                           console.log("err from second query",err)
                         }
            
                        });
        
                  });
              }      


           
             // connection.release(); 
            });  


          }
  
        } catch (error) {    
         throw error
        }
    }

    setGeofencInfo= () => {
     
      try {
      

          if(this.sinotrack!=null) {
            let mysqlData=this.sinotrack.getMysqlObject();

            
            this.CONNECTION.getConnection((err, connection) => {
              if(err) throw err;


              connection.query(QUERY.GET_GEOFENCE_QUERY,mysqlData.imei_id, function(err, result){
                new Geofence(result,mysqlData);
  
                  connection.release(); // return the connection to pool
               
                  if(err) throw err;

              });

          });

          }else{
            console.log("this.sinotrack is null")
          }
  
        } catch (error) {    
         throw error
        }
    }


   
       updateGpsDataToMongo() {

      try {     
          if(this.sinotrack!=null) { 
            try{
           
              let date= new Date().getMinutes()%MONGO_INTERVAL_TIME;
              let obj=this.sinotrack.getMongoObject();


              if(obj.imei_id=="NaN" || obj.lat=="NaN"){
                console.log("imei_id is NA")
                return
              }


              if(obj.imei_id==1170948091){
                console.log("pre")
                console.log(obj)
  
              }


              if(obj.bits==imei_ids[1]|| obj.bits==imei_ids[2]){

                if(date==0 && parseInt(new Date().getSeconds()/MONGO_INTERVAL_TIME)==2 ){                
                  new MongoDbClient(obj);
                }

              }else if(obj.bits==imei_ids[0]){
                if(obj.bits ==1170948091){
                  console.log("after ")
                  console.log(obj)
                }
               // if( parseInt(new Date().getSeconds()/MONGO_INTERVAL_TIME)==2 ){                
                  new MongoDbClient(obj);
               // }
              }else{
                new MongoDbClient(obj);
              }

       
                
             

            }catch(error){
             throw error;
            }

            
        } else{
          console.log("this.sinotrack is null for mongo")
        } 
  
        } catch (error) {  
          throw error
        }
    }
    


  }

  module.exports = SinotrackService;

