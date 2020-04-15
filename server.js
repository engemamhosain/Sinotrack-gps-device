var net = require('net');
var fs = require('fs');

var HOST = '';
var PORT = 6969;

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "emam-hasan",
  password: "iiqultr11234lokp",
   database: "trucklagbe"
});



// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +': '+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(buffer) {
	var data = buffer.toString('utf8');
      	console.log(typeof data);
        console.log('>>> ' + sock.remoteAddress + ': ' + data);
	console.log(data);
        var IMEI_ID = data.substring(2,13);
        var lat = data.substring(39,50);
        var lon = data.substring(50,61);

        if(IMEI_ID !== "" && lat !== "" && lon !== ""){

//            con.connect(function(err) {
                
  //              if (err) {
    //                throw err;
     //           }
                console.log("Connected!");
                var sql = 'SELECT id FROM `truck_gps_data` where IMEI_ID = "'+IMEI_ID+'"  LIMIT 1 ';
               
                con.query(sql, function (err, result) {
               
                    if(result.length > 0){
                    	console.log(result.length);

                        if (err) {
                            throw err;
                        }
                        

                        var insert_sql = 'INSERT into trucks_location set truck_id="'+result[0].id+'", lat = " '+lat
                                        +'", lon = "'+ lon +'" , full_str = "' +data+'" ';

                        con.query(insert_sql, function(err, result){
                        	console.log("-------------- ??  wath?");
                            if (err){
                             throw err;
                            }
                            console.log('------------- inserted !');
                        });
                        console.log('------------- inserted !',result[0].id );
                    }    
                });
                

       //         });
    
        }
    });
        // Add a 'close' event handler to this instance of socket
        sock.on('close', function(data) {
            console.log('<<CLOSED>>: ' + sock.remoteAddress +' '+ sock.remotePort);
        });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
