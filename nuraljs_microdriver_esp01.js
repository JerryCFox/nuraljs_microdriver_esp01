module.exports.init=init;
module.exports.details=IPdetails;

var err=null;
var method;
var mode;
var APconfig;
var config;
var wifi=0;
var IPdetails;

function init(options,cb){
    if(options){
        if(options.wifi){
            wifi=options.wifi;
            if(options.method){
                method=options.method;
                if(options.mode){
                    mode=options.mode;
                }
                if(options.config){
                    config=options.config;
                }
                if(options.APconfig){
                    APconfig=options.APconfig;
                }
                //establish wifi module
                wifi=wifi.connect(method,function(err){
                    if(err){
                        //wifi connect failed
                        cb(err,"ESP01 wifi enable failed");
                    }
                    else{
                        //reset to wipe artifacts
                        wifi.reset(function(err){
                            if(err){
                                //wifi reset failed
                                cb(err,"ESP01 wifi reset failed");
                            }
                            else{
                                if(mode=="AP"){
                                    if(APconfig){
                                        if(APconfig.name&&APconfig.channel&&APconfig.password&&APconfig.method){
                                            wifi.createAP(APconfig.name,APconfig.password,APconfig.channel,APconfig.method,function(err){
                                                if(err){
                                                    cb(err,"ESP01 Create AP failed");
                                                }
                                                else{
                                                    wifi.getIP(function(err,ipOb){
                                                        if(err){
                                                            cb(err,"ESP01 Failure getting IP Details");
                                                        }
                                                        else{
                                                            IPdetails=ipOb;
                                                            cb(err,"ESP01 Wifi Enabled");
                                                        }
                                                    });   
                                                }
                                            });
                                        }
                                        else{
                                            cb(err,"ESP01 APconfig not fully defined");
                                        }
                                    }
                                    else{
                                        cb(err,"ESP01 APconfig not defined");
                                    }
                                }
                                else{
                                    cb(err,"ESP01 mode is not understood");
                                }
                            }
                        });
                    }    
                });
            }
            else{
                cb(err,"ESP01 connection method not supplied");
            }
        }
        else{
            cb(err,"ESP01 require not supplied");
        }
    }
    else{
        cb(err,"ESP01 Chip Disabled");
    }
}
