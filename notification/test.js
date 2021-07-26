const { sendNotification } = require('./sendNotification');

const send = async function () {
    let res = await sendNotification(9170544298, 'geofence_in');
    console.log(res);
}

send();