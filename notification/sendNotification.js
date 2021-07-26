const mongoose = require('mongoose');
const TLDB = require('./dbCon');
const GPSDB = require('./gpsDBCon');
const { notificationQueries } = require('./queries');
const notification = require('./models/notificationModel');
const pushNotification = require('./models/pushNotificationModel');
const loadDB = require('./loadMongoDb');
const axios = require('axios').default;



const insertInAppNotification = async function (imei_id, alert_type) {
    try{
        loadDB();
        let alertInfo = await getAlertInfo(imei_id, alert_type);

        if (alertInfo.responseCode === 1000){
            let truckInfo = await getTruckNum(imei_id);
            if(truckInfo.responseCode){
                if(truckInfo.responseCode === 1000){
                    let truck_num = truckInfo.truck_no;
                    let info = await insertInNotification(imei_id, alert_type, truck_num);
                    TLDB.close();
                    GPSDB.close();
                    mongoose.connection.close();
                    return info;
                } else {
                    TLDB.close();
                    GPSDB.close();
                    mongoose.connection.close();
                    return truckInfo;
                }
            } else {
                TLDB.close();
                GPSDB.close();
                mongoose.connection.close();
                return truckInfo;
            }
        } else {
            TLDB.close();
            GPSDB.close();
            mongoose.connection.close();
            return alertInfo;
        }   
    } catch (err){
        TLDB.close();
        GPSDB.close();
        mongoose.connection.close();
        return err;
    }
}

const sendPushNotification = async function (imei_id, alert_type) {
    try{
        console.log("send push call")

        loadDB();

        let finalOutput = await getAlertInfo(imei_id, alert_type);
        if(finalOutput.responseCode === 1000){
            finalOutput = await sendFcm(imei_id, alert_type, finalOutput.ownerId);
        }
        TLDB.close();
        GPSDB.close();
        mongoose.connection.close();
        return finalOutput;
    } catch (err){
        
        TLDB.close();
        GPSDB.close();
        mongoose.connection.close();
        return err;
    }
    
    
}

const getAlertInfo = async function (imei_id, alert_type) {
    try {
        let finalOutput = {};
        let alrt = alert_type;
        if(alert_type === 'engine_on' || alert_type === 'engine_off'){
            alrt = 'engine';
        } else if (alert_type === 'geofence_in' || alert_type === 'geofence_out'){
            alrt = 'geo_fencing';
        }
        let q = notificationQueries.getOwnerIdAndAlertStatusStart + alrt + notificationQueries.getOwnerIdAndAlertStatusEnd;
        let result = await GPSDB.query( q, [imei_id] );
        if( result.length > 0 ){
            let alert_status = checkAlertStatus(alrt, result[0]);
            if(alert_status === true){
                finalOutput.responseCode = 1000;
                finalOutput.ownerId = result[0].owner_id;
            } else {
                finalOutput.responseCode = 1002;
                finalOutput.status = 'failed';
                finalOutput.message = 'alert settings turned off';
            }
        } else {
            finalOutput.responseCode = 1002;
            finalOutput.status = 'failed';
            finalOutput.message = 'alert settings turned off';
        }
        return finalOutput;
    } catch (error) {
        return error;
    }
    
}

const sendFcm = async function (imei_id, alert_type, owner_id) {
    let truckInfo = await getTruckNum(imei_id);
    if(truckInfo.responseCode){
        if(truckInfo.responseCode === 1000){
            let truck_num = truckInfo.truck_no;
            let tokenInfo = await getToken(owner_id, truck_num, alert_type, imei_id);
            return tokenInfo;
        } else {
            return truckInfo;
        }
    } else {
        return truckInfo;
    }
}

const getToken = async function (owner_id, truck_num, alert_type, imei_id){
    try {
        let finalOutput = {};
        let tokenInfo = await TLDB.query(notificationQueries.getFcmToken, [owner_id]);
        if (tokenInfo.length > 0) {
            let tokens = [];
            tokens.push(tokenInfo[0].token);
            let body = getData(imei_id, alert_type, truck_num);
            const payload = {
                'registration_ids': tokens,
                'data': body,
                'priority': 'high'
            };
        
            //use axios to send fcm
            const resp = await axios({
                url: 'https://fcm.googleapis.com/fcm/send',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AAAAApV6qNc:APA91bHV9tY-4lYYkfWQkd0mec01CkU1SsRQw8ZYHL8zcZdn2W3KPIXyFUGN8-93f0CZvHDUcKw6ijlug8GkfNy-OsJm-bKHqoJYkLya5TBzv8sqfOfkplkrQD87DAx0U8h5AM_-yaig'
                },
                data: payload
            });

            if(resp.data.success === 1){
                finalOutput = await insertPushNotification(body);
            } else {
                finalOutput.responseCode = 1002;
                finalOutput.status = 'failed';
                finalOutput.message = 'Push Notification not sent';
            }
            
        } else {
            finalOutput.responseCode = 1002;
            finalOutput.status = 'failed';
            finalOutput.message = 'no fcm token found';
        }
        return finalOutput;
    } catch (error) {
        return error;
    } 
}

const checkAlertStatus = function (alert_type, arr){
    switch (alert_type) {
        case 'over_speed':
          if(arr.over_speed === 1){
            return true;
          } return false;
          
        case 'geo_fencing':
          if(arr.geo_fencing === 1){
            return true;
          } return false;
    
        case 'acceleration':
          if(arr.acceleration === 1){
            return true;
          } return false;
    
        case 'low_battery':
          if(arr.low_battery === 1){
            return true;
          } return false;
    
        case 'device_removed':
          if(arr.device_removed === 1){
            return true;
          } return false;
    
        case 'engine':
          if(arr.engine === 1){
            return true;
          } return false;
    
        case 'emergency_contact_id':
          if(arr.emergency_contact_id !== 0){
            return true;
          } return false;
    
    }
}

const getData = function ( imei_id, alert_type, truck_num ){
    let data = {
        imei_id,
        intent: 'GPS Alert',
        intent_id: 0,
        alert_type,
        push_notification : 'yes', 
        vibration: 'yes',
        sound: 'no',
        sound_name: 'none',
        redirect: 'Specific Truck Details Page',
        url: 'NA'
    };
    switch (alert_type) {
        case 'device_removed':
            data.title = 'ডিভাইস খোলা এলার্ট';
            data.message = `${truck_num} এর জিপিএস ডিভাইসটি খুলে ফেলা হয়েছে`;
            data.sound = 'yes';
            data.sound_name = 'OS_Cancelled';
            return data;

        case 'low_battery':
            data.title = 'লো ব্যাটারি এলার্ট';
            data.message = `${truck_num} এর ব্যাটারিটি পরীক্ষা করুন`;
            return data;

        case 'acceleration':
            data.title = 'হার্ডব্রেক/ এক্সেলারেশন এলার্ট';
            data.message = `${truck_num} এর বাজে ব্রেক/ এক্সেলারেশন হয়েছে`;
            return data;

        case 'over_speed':
            data.title = 'ওভারস্পিড এলার্ট';
            data.message = `${truck_num} এর ওভারস্পিড হয়েছে`;
            return data;

        case 'engine_on':
            data.title = 'ইঞ্জিন চালু/বন্ধ এলার্ট';
            data.message = `${truck_num} এর ইঞ্জিন চালু করা হয়েছে`;
            return data;

        case 'engine_off':
            data.title = 'ইঞ্জিন চালু/বন্ধ এলার্ট';
            data.message = `${truck_num} এর ইঞ্জিন বন্ধ করা হয়েছে`;
            return data;

        case 'emergency_contact_id':
            data.alert_type = 'emergency'
            data.title = 'ইমারজেন্সি এলার্ট';
            data.message = `${truck_num} এর ড্রাইভারের সাহায্যের প্রয়োজন`;
            data.sound = 'yes';
            data.sound_name = 'OS_Cancelled';
            return data;

        case 'geofence_in':
            data.title = 'জিওফেন্স এলার্ট';
            data.message = `${truck_num} GEOFENCE 01 এ ঢুকেছে`;
            data.redirect = 'NA';
            return data;

        case 'geofence_out':
            data.title = 'জিওফেন্স এলার্ট';
            data.message = `${truck_num} GEOFENCE 01 থেকে বের হয়েছে`;
            return data;
    
        default:
            return {responseCode: 1002};
    }
}

const insertInNotification = async function (imei_id, alert_type, truck_num){
    try{
        let finalOutput = {};
        let data = getData(imei_id, alert_type, truck_num);
        if (data.responseCode){
            finalOutput.responseCode = 1002;
            finalOutput.status = 'failed';
            finalOutput.message = 'wrong alert_type';
        } else {
            await notification.insertMany(data);
            finalOutput.responseCode = 1000;
            finalOutput.status = 'sucess';
            finalOutput.message = 'in app notification added';
        }
        return finalOutput;

    } catch (error){
        return error;
    }
}

const insertPushNotification = async function (data){
    try{
        let finalOutput = {};
        await pushNotification.insertMany(data);
        finalOutput.responseCode = 1000;
        finalOutput.status = 'sucess';
        finalOutput.message = 'push notification sent';
        return finalOutput;     
    } catch (error){
        return error;
    }
}



const getTruckNum = async function (imei_id) {
    try {
        let finalOutput = {};
        let result = await TLDB.query( notificationQueries.getTruckNumAgainstImei, [imei_id] );
        if( result.length > 0 ){
            return { responseCode: 1000, truck_no: result[0].truck_no}
        } else {
            finalOutput.responseCode = 1002;
            finalOutput.status = 'failed';
            finalOutput.message = 'truck_no not found';
            return finalOutput;
        }
    } catch (error) {
        return error;
    }
}

/*
 const print = async () => {
   let res = await insertInAppNotification (9170544298, 'geofence_in');
   console.log(res);
}


const print = async () => {
    let res = await sendPushNotification(9170544298, 'geofence_in');
    console.log(res);
 }


print();
*/


exports.sendPushNotification = sendPushNotification;
