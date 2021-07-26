var mongoose = require('mongoose'); 

var pushNotificationSchema = mongoose.Schema({
    
    imei_id: {
        type: Number,
        required: true,
     },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    intent: {
        type: String,
        required: true,
    },
    intent_id: {
        type: Number,
        required: true,
    },
    vibration: {
        type: String,
        required: true,
    },
    sound: {
        type: String,
        required: true,
    },
    sound_name: {
        type: String,
        required: true,
    },
    push_notification: {
        type: String,
        required: true,
    },
    redirect: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    alert_type: {
        type: String,
        required: true,
    },
    createdOn: { type: String, default : function NOW(){
        return new Date(new Date +" UTC").toISOString().slice(0, 19).replace('T', ' ');
    }}

});

module.exports = mongoose.model('push_notification', pushNotificationSchema);