var net = require('net');
var process = require('process');
// var fs = require('fs');

var HOST = '';
var PORT = 6968;

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "::1",  
  user: "emam-hasan",
  password: "iiqultr11234lokp",
  database: "tl_p2_backup"
});


// *HQ,8170602418,V1,112605,A,2346.8111,N,09023.7068,E,001.39,000,130717,FFF7BBFF,470,03,00830,61182#


var lat_ddm_to_decimal  = (string_ddm) =>{
  return (parseInt(string_ddm.substring(0,2)) +  parseFloat(string_ddm.substring(2,9))/60).toFixed(6);
},
lng_ddm_to_decimal  = (string_ddm) =>{
  return (parseInt(string_ddm.substring(0,3)) +  parseFloat(string_ddm.substring(3,9))/60).toFixed(6);
},
manage_raw = (r) => {
  var length = r.length, lat, lng;

  if(length < 96 || length > 99 || r.substr(0,4) !== "*HQ,"){
    return false;
  }

  lat = lat_ddm_to_decimal(r.substr(27, 9));
  lng = lng_ddm_to_decimal(r.substr(39, 10));

  return {
    imei_id: r.substr(4, 10),
    cmd: r.substr(15, 2),
    time: r.substr(18, 6),
    valid: r.substr(25, 1),
    lat: lat,
    lat_int: lat * 1000000,
    d: r.substr(37, 1),
    lng: lng,
    lng_int: lng * 1000000,
    g: r.substr(50, 1),
    speed: r.substr(52, 6),
    direct: r.substr(59, 3),
    date: r.substr(63, 6),
    bits: r.substr(70, 8),
    n_mcc: r.substr(79, 3),
    n_mnc: r.substr(83, 2),
    n_lac: r.substr(86, 5),
    n_celid: r.substr(92, r.length - 93)
  };
},

insert_check = (obj) => {
  if (obj.valid === 'V'){
    return false;
  }

  if (parseInt(obj.speed) < 2 && parseInt(obj.direct) === 0){
    return false;
  }

  return true;
},
replace_sql = (obj)=>{
  var insert_sql = 'REPLACE into devices_last_location set created_on = now(), ? '; 
            con.query(insert_sql, obj, function(err, result){
              if (err){
                //console.log('error? ', err);
                throw err;
              }
             // console.log('r');
            });
}, 
location_log_sql = (obj)=>{
  var insert_sql = 'INSERT into truck_location_log_nx set created_on = now(), ? '; 
            con.query(insert_sql, obj, function(err, result){
              if (err){
               // console.log('error? ', err);
                throw err;
              }
//            console.log('.');
            });
};

net.createServer(function(sock) {
    
    sock.on('data', function(buffer) {
  		var data = buffer.toString('utf8'),
      t = manage_raw(data);
      if(t !== false){
        replace_sql(t);
        if(insert_check(t) === true){
         // location_log_sql(t);
        }
      }
      sock.end();
    });
        
    sock.on('close', function(data) { });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);


process
  .on('unhandledRejection', (reason, p) => {
 //    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    // console.error(err, 'Uncaught Exception thrown');
    //process.exit(1);
  });

// https://maps.googleapis.com/maps/api/staticmap?zoom=16&size=480x600&center=2343.4497N,9022.9884E
