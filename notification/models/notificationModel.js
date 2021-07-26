var mongoose = require('mongoose'); 

var notificationSchema = mongoose.Schema({
    
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
    alert_type: {
        type: String,
        required: true,
    },
    createdOn: { type: String, default : function NOW(){
        return new Date(new Date +" UTC").toISOString().slice(0, 19).replace('T', ' ');
    }}

});

module.exports = mongoose.model('notification', notificationSchema);