
 
const DB_OPTION=[{
    host: "103.199.168.131",  
    user: "tl-builder",
    password: "B@ri22!R@st@15",
    database: "Gps_Device"
},{
    port:"19928",
    host:"103.199.168.131",
    user:"tl_developer",
    password:encodeURIComponent('Gw)-W-RwX3nupMN?Owner'),
    database:"tl_gps_device"

}
]



const MONGO_DB_URI=`mongodb://${DB_OPTION[1].user}:${DB_OPTION[1].password}@${DB_OPTION[1].host}:${DB_OPTION[1].port}/${DB_OPTION[1].database}`;

module.exports = {DB_OPTION,MONGO_DB_URI};

