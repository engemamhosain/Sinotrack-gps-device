 //var gps_data="*HQ,6170948097,V1,112605,A,2346.8111,N,09023.7068,E,005.39,000,130717,FFF7BBFF,470,03,00830,61182#";

 const KNOT=1.852000;
const MysqlData=require('./MysqlData'); 
const MongoData=require('./MongoData'); 
 class Sinotrack {
   
    imei_id = 0;
    cmd= 0;
    time =0;
    version=0;//V1 version
    valid_bit=0;//gps valid A gps invalid V
    lat=0;
    lng=0;
    lat_direction=0;
    lng_direction=0;
    speed = 0;
    direct= 0;
    date = 0;
    bits = 0;
    n_mcc = 0;
    n_mnc = 0;
    n_lac = 0;
    n_celid = 0;
    engine_status=0;
    alarm_type=0;
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



    setEngineStatus  = (bits) =>{
        switch (bits) {
            case "FBF7BBFF":
                this.engine_status = "charge_drained";
                break;
            case "FFF79FFF":
                this.engine_status = "earthing_connected";
                break;   
            case "FFF7BBFF":
                this.engine_status = "battery_backup";
                break;   
                
                
            case "FBF7BBFF":
                this.engine_status = "battery_backup";
                break;   

            case "FBF79FFF":
                this.engine_status = "battery_backup";
                break;   

            case "FFFF9FFF":
                this.engine_status = "engine_connection";
                break;   
            case "FFFFBBFF":
                this.engine_status = "power_connection";
                break;   
            case "FFFF9FFB":
                this.engine_status = "engine_connection";
                this.alarm_type = "over_speed";
                break; 

            case "FBFF9FFB":
                this.engine_status = "engine_connection";
                this.alarm_type="over_speed";
            break;  
        
        
            default:
                this.engine_status = "other";
                break;
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
        } catch (error) {}
      
    }

    
  }

  module.exports = Sinotrack;



