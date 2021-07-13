module.exports = {
  apps : [{
    script: 'sinotrackServer.js',
  }],
  env_production: {
    NODE_ENV: "production"
 },
 env_development: {
    NODE_ENV: "development"
 },
   
 
  // Deployment Configuration TlTech
     //   "key"  : "/Users/hello/other/key/id_rsa",
  deploy : {
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
    }
  }
};


