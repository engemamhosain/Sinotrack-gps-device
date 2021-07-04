 const KNOT=1.852000;
const MysqlData=require('./MysqlData'); 
const MongoData=require('./MongoData'); 
 class Sinotrack {
   
    imei_id = 0;
    cmd= 0;
    time =0;
    valid=0;
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
    rawData=0;

    constructor(rawData) {
      this.rawData = rawData;
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
            case "FFFF9FFF":
                this.engine_status = "engine_connection";
                break;   
            case "FFFFBBFF":
                this.engine_status = "power_connection";
                break;   
        
            default:
                this.engine_status = "other";
                break;
        }

    }

    makeObject=()=>{
     
    
        this.imei_id = this.rawData.substr(4, 10);
        this.cmd = this.rawData.substr(15, 2);
        this.time = this.rawData.substr(18, 6);
        this.valid =this.rawData.substr(25, 1);
        this.lat = this.lat_ddm_to_decimal(this.rawData.substr(27, 9));
        this.lat_direction = this.rawData.substr(37, 1);
        this.lng = this.lng_ddm_to_decimal(this.rawData.substr(39, 10));
        this.lng_direction = this.rawData.substr(50, 1);
        this.speed =this.knotToKM(this.rawData.substr(52, 6));
        this.direct = this.rawData.substr(59, 3); 
        this.date = this.rawData.substr(63, 6);
        this.bits = this.rawData.substr(70, 8);
        this.n_mcc = this.rawData.substr(79, 3);
        this.n_mnc =this.rawData.substr(83, 2);
        this.n_lac = this.rawData.substr(86, 5);
        this.n_celid =this.rawData.substr(92,5);

        this.setEngineStatus(this.bits);
    }

    
  }

  module.exports = Sinotrack;



