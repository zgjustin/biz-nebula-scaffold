/**
 * api接口处理， 支持在线可以更改api接口
 */
const siteDomainConfig:any = {};
let env = process.env.NODE_ENV;
let siteConfig =window['siteConfig'];
let config;
try{
    config = require('../../src/http').default;
}
catch{
    config = { 
        DOMAIN : 'http://139.9.236.174:5900', 
        PATH:'/v1' 
    }
}
if (env === 'production') {
    if(!siteConfig){
        siteDomainConfig.Domain = "";
        siteDomainConfig.Path = config.PATH;
    }else{
        siteDomainConfig.Domain = siteConfig.domain;
        siteDomainConfig.Path = siteConfig.path;
    }
} else{
    siteDomainConfig.Domain = config.DOMAIN;
    siteDomainConfig.Path = config.PATH;
}

export const baseURL = `${siteDomainConfig.Domain}${siteDomainConfig.Path}`

export default siteDomainConfig