


//sql: 'REPLACE into devices_last_location set created_on = now(), `imei_id` = \'6170948096\', `cmd` = \'V1\', `time` = \'112605\', `valid` = \'A\', `lat` = \'23.780185\', `lat_int` = 23780185, `d` = \'N\', `lng` = \'90.395100\', `lng_int` = 90395100, `g` = \'E\', `speed` = \'001.39\', `direct` = \'000\', `date` = \'130717\', `bits` = \'FFF7BBFF\', `n_mcc` = \'470\', `n_mnc` = \'03\', `n_lac` = \'00830\', `n_celid` = \'61182\', `created_on` = \'2020-04-17 00:33:27.457\', `_id` = \'5e98a4f70ea5455c01c4b476\' ' }
var gps_data="*HQ,6170948096,V1,112605,A,2346.8111,N,09023.7068,E,005.39,000,130717,FFF7BBFF,470,03,00830,61182#";
var net = require('net');
var client = new net.Socket();
client.connect(6968, '103.199.168.131', function() {
//client.connect(6968, '127.0.0.1', function() {
//client.connect(6968, '52.221.246.136', function() {
	console.log('Connected');
	client.write(gps_data);
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

