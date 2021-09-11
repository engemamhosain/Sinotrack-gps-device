const {DB_OPTION} = require("../config/dbConfig")
var mysql = require('mysql');


// const CONNECTION = mysql.createConnection({
//   host:DB_OPTION[0].host,
//   user: DB_OPTION[0].user,
//   password:DB_OPTION[0].password,
//   database: DB_OPTION[0].database
// });

//this config from sinotrackServer.js
const CONNECTION = mysql.createPool({
  connectionLimit: 3000,
  host:DB_OPTION[0].host,
  user: DB_OPTION[0].user,
  password:DB_OPTION[0].password,
  database: DB_OPTION[0].database,
  connectTimeout: 3000,
  waitForConnections: true,
  queueLimit: 0 
});





module.exports = CONNECTION;