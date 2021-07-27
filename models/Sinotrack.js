
 const axios = require('axios').default;
const KNOT=1.852000;
const MysqlData=require('./MysqlData'); 
const MongoData=require('./MongoData'); 

const GPS_STATE_NAME=["engine_on","engine_off","power_cut","device_removed","battery_backup","shock_alarm","over_speed"]
 class Sinotrack {
   
    imei_id = 0;
    cmd= 0;
    time =0;
    version=0;//V1 version
    valid_bit=0;//gps valid A gps invalid V
    lat=0;
    lng=0;
    lat_direction="";
    lng_direction="";
    speed = 0;
    direct= 0;
    date = 0;
    bits = 0;
    n_mcc = 0;
    n_mnc = 0;
    n_lac = 0;
    n_celid = 0;
    engine_status=GPS_STATE_NAME[1];
    alarm_type="normal";
    ignition=false;
    voltage_level="";
    rawData=0;

    constructor(rawData) {
      this.rawData = rawData;
      this.makeObject();
    }

    getMysqlObject=()=>{

        let mysqlObj={};
        try {
            mysqlObj=new MysqlData(this);
        } catch (error) {
        }      
       return mysqlObj;
    }

    getMongoObject=()=>{

        let mongoObj={};
        try {
            mongoObj = new MongoData(this);
        } catch (error) {  
            throw error 
        }
        return mongoObj;
    }

    lat_ddm_to_decimal  = (string_ddm) =>{
        return (parseInt(string_ddm.substring(0,2)) +  parseFloat(string_ddm.substring(2,9))/60).toFixed(6);
    }
    lng_ddm_to_decimal  = (string_ddm) =>{
        return (parseInt(string_ddm.substring(0,3)) +  parseFloat(string_ddm.substring(3,9))/60).toFixed(6);
    }
    knotToKM =(speed)=>{
        return KNOT*speed;
    }

     hex2bin=(hex)=>{
        return (parseInt(hex, 16).toString(2)).padStart(8, '0');
    }

    sendPushNotification = async function (imei_id,alert_type) {
        try {

            axios({
                url: process.env.NOTIFICATION_URL,
                method: 'POST',
                data: {
                  imei_id: imei_id,
                  alert_type:alert_type
                }
              }).then(function(res){
                //  console.log(res)

              }).catch(function(err){
                   // throw err
              });
                  
        } catch (error) {
          //  throw error
        }
 
    }
    setEngineStatus  = (bits) =>{

       let result = this.hex2bin(bits)

        if(result[21]==1){
            this.ignition = true;
        }

        if(result[18]==0){
            this.engine_status = GPS_STATE_NAME[0];
        }

        if(result[14]==0){
            this.alarm_type=GPS_STATE_NAME[5];
            
        }

        if(result[3]==0){
            this.alarm_type=GPS_STATE_NAME[2];
            this.sendPushNotification(  this.imei_id ,GPS_STATE_NAME[3])
        }

        if(result[29]==0){
            this.alarm_type=GPS_STATE_NAME[6];
            this.sendPushNotification(  this.imei_id ,GPS_STATE_NAME[6])
            
        }

        if(result[12]==0){
            this.voltage_level=GPS_STATE_NAME[4];
        }


    }
    getValidBit=(bitStatus)=>{

       let status="";
        try {
            status = bitStatus=="A"?"GPS valid":"GPS invalid"
        } catch (error) {
            
        }
        return status;

    }

    makeObject=()=> {
        try {
            
            let gpsArrayData = this.rawData.split(",");

            this.cmd = gpsArrayData[0];
            this.imei_id = gpsArrayData[1];
            this.version =gpsArrayData[2];
            this.time = gpsArrayData[3];
            this.valid_bit= this.getValidBit(gpsArrayData[4]);           

            this.lat = this.lat_ddm_to_decimal(gpsArrayData[5]);
            this.lat_direction = gpsArrayData[6];
            this.lng = this.lng_ddm_to_decimal(gpsArrayData[7]);
            this.lng_direction =gpsArrayData[8];
            this.speed =this.knotToKM(gpsArrayData[9]);

            this.direct = gpsArrayData[10];
            this.date = gpsArrayData[11];
            this.bits = gpsArrayData[12];
            this.n_mcc = gpsArrayData[13];
            this.n_mnc =gpsArrayData[14];
            this.n_lac = gpsArrayData[15];
            this.n_celid =gpsArrayData[16];
    
            this.setEngineStatus(this.bits);
        } catch (error) {
            throw error
        }
      
    }
  
  }

  module.exports = Sinotrack;



