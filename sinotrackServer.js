var net = require('net');
var process = require('process');
const dotenv = require('dotenv');
var mysql = require('mysql');


//require('events').EventEmitter.prototype._maxListeners = Infinity;
//require('events').defaultMaxListeners = Infinity;


if(process.env.NODE_ENV){
  dotenv.config({
    path:`${__dirname}/.env.${process.env.NODE_ENV}`
  });
}else{
  dotenv.config();
}

const {DB_OPTION} = require("./config/dbConfig")





// const CONNECTION = mysql.createPool({
//   connectionLimit: 250,
//   host:DB_OPTION[0].host,
//   user: DB_OPTION[0].user,
//   password:DB_OPTION[0].password,
//   database: DB_OPTION[0].database,
//   connectTimeout: 100,
//   waitForConnections: true,
//   queueLimit: 0 
// });


const CONNECTION = mysql.createPool({
  connectionLimit: 500,
  host:DB_OPTION[0].host,
  user: DB_OPTION[0].user,
  password:DB_OPTION[0].password,
  database: DB_OPTION[0].database,
  queueLimit: 0 ,
  debug :false,
});


const SinotracService = require("./services/SinotrakService")
const PORT = process.env.PORT;
const HOST = process.env.HOST;


 net.createServer(function(sock) {
    
    sock.on('data', function(buffer) {

    new SinotracService(buffer,CONNECTION);	

    // console.log(buffer.toString('utf8'))

    setTimeout(() => {
      sock.end();
    }, 300);

     
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

 