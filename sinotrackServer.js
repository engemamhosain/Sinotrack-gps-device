var net = require('net');
var process = require('process');
const dotenv = require('dotenv');


dotenv.config();

const SinotracService = require("./services/SinotrakService")

const PORT = process.env.PORT;
const HOST = process.env.HOST;


net.createServer(function(sock) {
    
    sock.on('data', function(buffer) {
     new SinotracService(buffer);
  		// var data = buffer.toString('utf8');
//       console.log(buffer)
  		//  var data = buffer.toString('utf8');
      //  console.log(data)
	
      sock.end();
    });

        
    sock.on('close', function(data) { });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT,process.env);

// process.on('unhandledRejection', (reason, p) => {
// throw reason
// }).on('uncaughtException', err => {
//   console.log(err)
//   //process.exit(1);
// });


process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
   // process.exit(1);
  });