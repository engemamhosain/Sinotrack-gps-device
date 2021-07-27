module.exports = {

  apps : [{
    script: 'sinotrackServer.js',
    instances : "2",
    exec_mode : "cluster",
    env: {
      NODE_ENV: "development"
    },
    env_local: {
      NODE_ENV: "local",
    },
    env_staging: {
      NODE_ENV: "staging",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }],

   
 
  // Deployment Configuration TlTech 
     //   "key"  : "/Users/hello/other/key/id_rsa",
  deploy : {
    local : {

      "host" : ["localhost"],
       "ref"  : "origin/master",
       "repo" : `https://gitlab+deploy-token-509262:JGhetBnT3hsGdesxY6Ea@gitlab.com/emamhasan1137/GpsDeviceLocation.git`,
       "path" : " /Users/hello/Gps/TestDeploy",
       "pre-setup" : " cd /Users/hello/Gps && mkdir TestDeploy",
       'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env local'
    },

    production : {
      "key"  : "/Users/hello/other/key/id_rsa",
       "user" : "system",
       "host" : ["103.199.168.131"],
       "port":"40405",
       "ref"  : "origin/master",
       "repo" : `https://gitlab+deploy-token-509262:JGhetBnT3hsGdesxY6Ea@gitlab.com/emamhasan1137/GpsDeviceLocation.git`,
       "path" : "/data4tb/other/Sintorack/TestDeploy",
       "pre-setup" : "mkdir TestDeploy",
       'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      "key"  : "/Users/hello/other/key/id_rsa",
       "user" : "system",
       "host" : ["103.199.168.131"],
       "port":"40405",
       "ref"  : "origin/master",
       "repo" : `https://gitlab+deploy-token-509262:JGhetBnT3hsGdesxY6Ea@gitlab.com/emamhasan1137/GpsDeviceLocation.git`,
       "path" : "/data4tb/other/Sintorack/TestDeploy",
       "pre-setup" : "mkdir TestDeploy",
  //     'post-deploy' : 'npm install && pm2 delete sinotrackServer && pm2 start ecosystem.config.js --env production'
       'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    }


  }
};


