// var net = require('net');
// var process = require('process');
// const MongoClient = require('mongodb').MongoClient;
// // var fs = require('fs');

// var HOST = '';
// var PORT = 6968;

// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",  
//   user: "tl-builder",
//   password: "B@ri22!R@st@15",
//   database: "gps_device"
// });


// var user ="tl_developer"
// var passsword=encodeURIComponent('op0hrut0Gupt0m0ntr0Owner')
// var mongo_uri = `mongodb://${user}:${passsword}@127.0.0.1:19930/tl_gps_device`;



// var db,collection_gps_device_location;

// MongoClient.connect(mongo_uri, { useUnifiedTopology: true,useNewUrlParser: true,poolSize:10})
// .then(client => {

//   db = client.db('tl_gps_device');
//   collection_gps_device_location = db.collection('gps_device_location');  
// }).catch(error => console.error(error));




// // *HQ,8170602418,V1,112605,A,2346.8111,N,09023.7068,E,001.39,000,130717,FFF7BBFF,470,03,00830,61182#


// var lat_ddm_to_decimal  = (string_ddm) =>{
//   return (parseInt(string_ddm.substring(0,2)) +  parseFloat(string_ddm.substring(2,9))/60).toFixed(6);
// },
// lng_ddm_to_decimal  = (string_ddm) =>{
//   return (parseInt(string_ddm.substring(0,3)) +  parseFloat(string_ddm.substring(3,9))/60).toFixed(6);
// },
// manage_raw = (r) => {
//   var length = r.length, lat, lng;

//   if(length < 96 || length > 99 || r.substr(0,4) !== "*HQ,"){
//     return false;
//   }

//   lat = lat_ddm_to_decimal(r.substr(27, 9));
//   lng = lng_ddm_to_decimal(r.substr(39, 10));

//   return {
//     imei_id: r.substr(4, 10),
//     cmd: r.substr(15, 2),
//     time: r.substr(18, 6),
//     valid: r.substr(25, 1),
//     lat: lat,
//     lat_int: lat * 1000000,
//     d: r.substr(37, 1),
//     lng: lng,
//     lng_int: lng * 1000000,
//     g: r.substr(50, 1),
//     speed: r.substr(52, 6),
//     direct: r.substr(59, 3),
//     date: r.substr(63, 6),
//     bits: r.substr(70, 8),
//     n_mcc: r.substr(79, 3),
//     n_mnc: r.substr(83, 2),
//     n_lac: r.substr(86, 5),
//     n_celid: r.substr(92, r.length - 93)
//   };
// },

// insert_check = (obj) => {
//   if (obj.valid === 'V'){
//     return false;
//   }

//   if (parseInt(obj.speed) < 2 && parseInt(obj.direct) === 0){
//     return false;
//   }

//   return true;
// },
// replace_sql = (obj)=>{
//   var insert_sql = 'REPLACE into devices_last_location set created_on = now(), ? '; 
//             con.query(insert_sql, obj, function(err, result){
//               if (err){
//                 throw err;
//               }
//             });
// };

// insetLocaionToMongodb = (locationData)=>{
// 	locationData.created_on=new Date();
// 	try{
// 		collection_gps_device_location.insertOne(locationData);   
// 	}catch(error){console.log(error);}
// }

// net.createServer(function(sock) {
    
//     sock.on('data', function(buffer) {
//   		var data = buffer.toString('utf8'),
//         formatedGpsData = manage_raw(data);
	
//       if(formatedGpsData !== false){

//         try{
//           replace_sql(formatedGpsData);
      	
//         }catch(error){
//             LogPrint(error);
//         }
//         try{
//             insetLocaionToMongodb(formatedGpsData);
//         }catch(error){
//           LogPrint(error);
//         }
        
//       }
//       sock.end();
//     });

        
//     sock.on('close', function(data) { });
    
// }).listen(PORT, HOST);

// console.log('Server listening on ' + HOST +':'+ PORT);


// process
//   .on('unhandledRejection', (reason, p) => {
 
//   })
//   .on('uncaughtException', err => {
//     // console.error(err, 'Uncaught Exception thrown');
//     //process.exit(1);
//   });

//   LogPrint =(err)=>{
//     //console.log(err);
//   }
