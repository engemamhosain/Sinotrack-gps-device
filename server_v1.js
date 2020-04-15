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



var ddm_to_decimal  = (string_ddm) =>{
	return (parseInt(string_ddm.substring(0,2)) +  parseFloat(string_ddm.substring(2,9))/60).toFixed(6);
}; 

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

        console.log('>>> ' + sock.remoteAddress + ' : ');
		console.log(data);

		 sock.write("&REPORT");


        var IMEI_ID = data.substring(2,13);
        var a_index = data.indexOf("A") + 1;
        var lat = data.substring(a_index,a_index + 9);
        a_index += 11;
        var lon = data.substring(a_index,a_index + 9);;

        console.log("### IMEI_ID ##", IMEI_ID);

        if(IMEI_ID !== "" && !isNaN(lat) && !isNaN(lon)){

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
                        console.log(lat + ' ~~ '+ ddm_to_decimal(lat));

                        var insert_sql = 'INSERT into trucks_location set truck_id="'+result[0].id+'", lat = "'+ddm_to_decimal(lat)
                                        +'", lon = "'+ ddm_to_decimal(lon) +'" '; // +', full_str = "' +data+'" ';

                        console.log(insert_sql);
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
        sock.end('goodbye\n');
        

    });
        // Add a 'close' event handler to this instance of socket
        sock.on('close', function(data) {
            console.log('<<CLOSED>>: ' + sock.remoteAddress +' '+ sock.remotePort);
        });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);


// https://maps.googleapis.com/maps/api/staticmap?zoom=16&size=480x600&center=2343.4497N,9022.9884E