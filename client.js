


//sql: 'REPLACE into devices_last_location set created_on = now(), `imei_id` = \'6170948096\', `cmd` = \'V1\', `time` = \'112605\', `valid` = \'A\', `lat` = \'23.780185\', `lat_int` = 23780185, `d` = \'N\', `lng` = \'90.395100\', `lng_int` = 90395100, `g` = \'E\', `speed` = \'001.39\', `direct` = \'000\', `date` = \'130717\', `bits` = \'FFF7BBFF\', `n_mcc` = \'470\', `n_mnc` = \'03\', `n_lac` = \'00830\', `n_celid` = \'61182\', `created_on` = \'2020-04-17 00:33:27.457\', `_id` = \'5e98a4f70ea5455c01c4b476\' ' }
var gps_data="*HQ,6170948097,V1,112605,A,2346.8111,N,09023.7068,E,005.39,000,130717,FFFFB9FF,470,03,00830,61182#";
//var gps_data="*HQ,6170937422,V1,005233,A,2343.1337,N,09028.0470,E,018.11,130,110721,FFFF9FFB,470,02,00049,4606#*HQ,6170937422,V1,005243,A,2343.0986,N,09028.0846,E,016.55,139,110721,FFFF9FFB,470,02,00049,4606#*HQ,100,V1,005243,A,2343.0986,N,09028.0846,E,016.55,139,110721,FBF7B9FF,470,02,00049,4606#";
var net = require('net');
var client = new net.Socket();


callFunc=()=>{
client.connect(6968, '127.0.0.1', function() {
//	client.connect(6968, '103.199.168.131', function() {
		console.log('Connected');
			client.write(gps_data);
			
	});
}	
	
callFunc();

// setInterval(() => {
// 	callFunc();
// }, 10000);

client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

process.on('uncaughtException', function (err) {
    console.log(err);
}); 


