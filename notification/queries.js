const notificationQueries = {
    getFcmToken: `select token from tb_owner_fcm where owner_id = ?;`,

    getAlertStatus: `select over_speed, geo_fencing, acceleration, low_battery, device_removed, engine, emergency_contact_id from alert_status where imei_id = ?`,

    getOwnerIdAndAlertStatusStart: 'select owner_id, ',

    getOwnerIdAndAlertStatusEnd: ' from alert_status where imei_id = ?;',

    getTruckNumAgainstImei: `select truck_no from trucks_info where imei_id = ?;`
}

module.exports = {
    notificationQueries
}