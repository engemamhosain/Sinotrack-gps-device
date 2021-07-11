const DEVICE_NAME="Sinotrack";
class MongolData {
   
    imei_id=0;
    latitude=0;
    longitude=0;
    speed=0;
    engine_status=0;
    lat_direction=0;
    lng_direction=0;
    gps_date_time=0;
    bits=0;
    cmd=0;
    valid_bit=0;
    n_celid=0;
    n_lac=0;
    n_mcc=0;
    n_mnc=0;
    created_on=0;
    alarm_type=0;
    protocol_number=0;
    device_name=DEVICE_NAME;
    status=0;
    ignition=0;
    charging=0;
    alarm_type=0;
    gps_tracking=0;
    voltage_level=0;
    gsm_strength=0;

    constructor(contex) {
        try {

                this.imei_id=contex.imei_id,
                this.latitude=contex.lat,
                this.longitude=contex.lng,
                this.speed=contex.speed,
                this.engine_status=contex.engine_status,
                this.lat_direction=contex.lat_direction,
                this.lng_direction=contex.lng_direction,
                this.gps_date_time=contex.date+"/"+contex.time,
                this.bits=contex.bits,
                this.cmd=contex.cmd,
                this.valid_bit=contex.valid_bit;
                this.status=contex.valid,
                this.n_celid=contex.n_celid,
                this.n_lac=contex.n_lac,
                this.n_mcc=contex.n_mcc,
                this.n_mnc=contex.n_mnc,
                this.created_on=new Date()

        } catch (error) {
            throw error
        }

     

    }
}

module.exports = MongolData;