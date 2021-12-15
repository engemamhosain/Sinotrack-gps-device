module.exports = {

  apps : [{
    script: 'sinotrackServer.js',
    instances : "4",
    exec_mode : "cluster",
    env: {
      NODE_ENV: "development"
    },
    env_local: {
      NODE_ENV: "local",
    },
    env_dev: {
      NODE_ENV: "dev",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }],

   
 
  // Deployment Configuration TlTech 
  //TlTech419@
     //   "key"  : "/Users/hello/other/key/id_rsa",
  deploy : {

  

    local : {
     
      "host" : ["localhost"],
       "ref"  : "origin/master",
       "repo" : `https://gitlab+deploy-token-509262:JGhetBnT3hsGdesxY6Ea@gitlab.com/emamhasan1137/GpsDeviceLocation.git`,
       "path" : "/Users/hello/Gps/Deploy/TestDeploy",
       'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env local'
    },

    production : {
      "key"  : "/home/emamhasan/Key/key/key.PEM",
       "user" : "ubuntu",
       "host" : ["52.221.246.136"],
       "port":"4770",
       "ref"  : "origin/master",
       "repo" : `https://gitlab+deploy-token-509262:JGhetBnT3hsGdesxY6Ea@gitlab.com/emamhasan1137/GpsDeviceLocation.git`,
       "path" : "/home/SinotrackProject/",
       'post-deploy' : 'npm install && sudo pm2 startOrRestart ecosystem.config.js --env production'
    },
    dev : {
       "user" : "system",
       "host" : ["103.199.168.131"],
       "port":"40405",
       "ref"  : "origin/master",
       "repo" : `https://gitlab+deploy-token-509262:JGhetBnT3hsGdesxY6Ea@gitlab.com/emamhasan1137/GpsDeviceLocation.git`,
       "path" : "/data4tb/Sinotrack",
   //    "pre-setup" : "sudo mkdir /data4tb/Sintorack/",
  //     'post-deploy' : 'npm install && pm2 delete sinotrackServer && pm2 start ecosystem.config.js --env production'
       'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env dev'
    }


  }
};


