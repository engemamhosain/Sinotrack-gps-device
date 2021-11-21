class MysqlData {
   
    imei_id=0;
    lat=0;
    lng=0;
    speed=0;
    engine_status=0;
    lat_direction=0;
    lng_direction=0;
    gps_date_time=0;
    bits=0;

    constructor(contex){
        try {
            this.imei_id=contex.imei_id;
            this.lat=contex.lat;
            this.lng=contex.lng;
            this.speed=contex.speed;
            this.engine_status=contex.engine_status;
            this.lat_direction=contex.lat_direction;
            this.lng_direction=contex.lng_direction;
            this.gps_date_time=contex.date+"/"+contex.time;
            this.bits=contex.bits;

        } catch (error) {
            throw error
        }

     

    }
}

module.exports = MysqlData;