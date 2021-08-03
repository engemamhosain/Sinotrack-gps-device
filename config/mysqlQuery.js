const INSERT_QUERY = 'REPLACE into devices_last_location set updated_on = now(), ? ';
const GET_GEOFENCE_QUERY = 'SELECT * FROM  geofencing where imei_id=? AND active_status=1';

module.exports =  {INSERT_QUERY,GET_GEOFENCE_QUERY};