
 
const DB_OPTION=[{
    host: process.env.MYSQL_HOST,  
    user:  process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: MYSQL_DATABASE
},{
    port:MONGO_PORT,
    host:MONGO_HOST,
    user:MONGO_USER,
    password:MONGO_PASSOWRD,
    database:MONGO_DATABASE

}
]



const MONGO_DB_URI=`mongodb://${DB_OPTION[1].user}:${DB_OPTION[1].password}@${DB_OPTION[1].host}:${DB_OPTION[1].port}/${DB_OPTION[1].database}`;

module.exports = {DB_OPTION,MONGO_DB_URI};

