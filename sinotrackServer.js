var net = require('net');
var process = require('process');
const dotenv = require('dotenv');
var mysql = require('mysql');


require('events').EventEmitter.prototype._maxListeners = 3000;
require('events').defaultMaxListeners = 3000;


if(process.env.NODE_ENV){
  dotenv.config({
    path:`${__dirname}/.env.${process.env.NODE_ENV}`
  });
}else{
  dotenv.config();
}

const {DB_OPTION} = require("./config/dbConfig")

// const CONNECTION = mysql.createPool({

//   host:DB_OPTION[0].host,
//   user: DB_OPTION[0].user,
//   password:DB_OPTION[0].password,
//   database: DB_OPTION[0].database
// });

const CONNECTION = mysql.createPool({
  connectionLimit: 1000,
  host:DB_OPTION[0].host,
  user: DB_OPTION[0].user,
  password:DB_OPTION[0].password,
  database: DB_OPTION[0].database,
  connectTimeout: 3000,
  waitForConnections: true,
  queueLimit: 0 
});



const SinotracService = require("./services/SinotrakService")


const PORT = process.env.PORT;
const HOST = process.env.HOST;


net.createServer(function(sock) {
    
    sock.on('data', function(buffer) {
      //console.log(process.env.NODE_ENV)
     new SinotracService(buffer,CONNECTION);	

    // console.log(buffer.toString('utf8'))

      sock.end();
    });

        
    sock.on('close', function(data) { });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT,process.env);


process.on('unhandledRejection', (reason, p) => {
  //  console.error(reason, 'Unhandled Rejection at Promise', p);
})
  .on('uncaughtException', err => {
   // console.error(err, 'Uncaught Exception thrown');
   // process.exit(1);
  });

  process.on('warning', function (err) {
    if ( 'MaxListenersExceededWarning' == err.name ) {
      console.log('max listener');
      // write to log function
//      process.exit(1); // its up to you what then in my case script was hang

    }
  });