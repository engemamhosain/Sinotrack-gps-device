const {DB_OPTION} = require("../config/dbConfig")
var mysql = require('mysql');


// const CONNECTION = mysql.createConnection({
//   host:DB_OPTION[0].host,
//   user: DB_OPTION[0].user,
//   password:DB_OPTION[0].password,
//   database: DB_OPTION[0].database
// });


const CONNECTION = mysql.createPool({
  host:DB_OPTION[0].host,
  user: DB_OPTION[0].user,
  password:DB_OPTION[0].password,
  database: DB_OPTION[0].database
});





module.exports = CONNECTION;