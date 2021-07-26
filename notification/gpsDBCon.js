'user strict';
const util = require( 'util' );
const mysql = require('mysql');

const DBOptions = {
    host: 'j.trucklagbe.com',
    user: 'tl-builder',
    password: 'B@ri22!R@st@15',
    database: 'Gps_Device',
    dialect: 'mysql',

    pool: {
        min: 0,
        max: 100,
    }
};

var con = {
    host: DBOptions.host,
    user: DBOptions.user,
    password: DBOptions.password,
    database: DBOptions.database,
    dialect: DBOptions.dialect,
    timezone: "Asia/Dhaka",
    define: { timestamps: false, charset: "utf8", dialectOptions: { collate: "utf8_general_ci" } },        
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
    },
};


function makeDb( con ) {
    const connection = mysql.createConnection( con );
    return {
      query( sql, args ) {
        return util.promisify( connection.query )
          .call( connection, sql, args );
      },
      close() {
        return util.promisify( connection.end ).call( connection );
      }
    };
  }

const GPSDB = makeDb(con);

module.exports = GPSDB;