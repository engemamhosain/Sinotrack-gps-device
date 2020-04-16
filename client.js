

var gps_data="*HQ,8170602418,V1,112605,A,2346.8111,N,09023.7068,E,001.39,000,130717,FFF7BBFF,470,03,00830,61182#";
var net = require('net');

var client = new net.Socket();
//client.connect(6968, '127.0.0.1', function() {
client.connect(6968, '52.221.246.136', function() {
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
