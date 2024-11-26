const INSERT_QUERY = 'REPLACE into devices_last_location set updated_on = now(), ? ';
const GET_GEOFENCE_QUERY = 'SELECT * FROM  geofencing where imei_id=? AND active_status=1';
const GET_LAST_UPDATE_LOCATION_QUERY = 'SELECT imei_id,speed ,engine_status,bits FROM  devices_last_location where imei_id=?';

module.exports =  {INSERT_QUERY,GET_GEOFENCE_QUERY,GET_LAST_UPDATE_LOCATION_QUERY};