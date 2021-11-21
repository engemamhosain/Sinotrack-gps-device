
 const axios = require('axios').default;
 const GEOFENCE_STATUS = ["geofence_in","geofence_out"]
class Geofence {

    GeofenceData=null;
    gpsData=null;

    constructor(GeofenceData,gpsData){
        this.GeofenceData= GeofenceData;
        this.gpsData= gpsData;

       this.getAllGeofence();
    }

    getAllGeofence() {

        this.GeofenceData.forEach(element => {
            //console.log("element-------")
           // console.log(element)

          let distance=this.calcCrow(element.latitude,element.longitude,parseFloat(this.gpsData.lat),parseFloat(this.gpsData.lng))
         
         if(distance>element.radius) {
            if(distance-element.radius<0.2){
                this.sendPushNotification(element.imei_id,GEOFENCE_STATUS[1],element.id)
               // console.log("geofence---------------out")
            // out----

            }
      
         }else{
            //in  
            this.sendPushNotification(element.imei_id,GEOFENCE_STATUS[0],element.id)
           // console.log("geofence---------------in")

         }
        });
    }

    calcCrow(lat1, lon1, lat2, lon2) 
    {
    var R = 6371; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
    }

    toRad(Value) 
    {
        return Value * Math.PI / 180;
    }


    sendPushNotification = async function (imei_id,alert_type,geo_fence_id) {
        try {

            axios({
                url: process.env.NOTIFICATION_URL,
                method: 'POST',
                data: {
                  imei_id: imei_id,
                  alert_type:alert_type,
                  geofence_id:geo_fence_id
                }
              }).then(function(res){
             //     console.log(res)

              }).catch(function(err){
                    throw err
              });
                  
        } catch (error) {
            throw error
        }
 
    }

}
module.exports = Geofence;

