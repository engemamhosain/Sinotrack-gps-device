const mongoose = require('mongoose');

const loadDB = () => {
    try{
        mongoose.connect('mongodb://tl_developer:Gw)-W-RwX3nupMN%3FOwner@j.trucklagbe.com:19928/tl_gps_device?authSource=tl_gps_device', {
            useUnifiedTopology: true,
            useNewUrlParser: true
          });
    }catch(err){
        console.log(err);
    }
};

module.exports = loadDB;