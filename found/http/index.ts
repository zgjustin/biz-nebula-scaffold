/**
 * api接口处理， 支持在线可以更改api接口
 */
let siteDomainConfig:any = {};
let env = process.env.NODE_ENV;
let siteConfig = undefined;// window['siteConfig'];
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
        let {DOMAIN,PATH,...other} = config;
        siteDomainConfig={...other,Domain:DOMAIN,Path:PATH};
    }else{
        let {domain,path,...other} = siteConfig;
        siteDomainConfig={...other,Domain:domain,Path:path};
    }
} else{
    siteDomainConfig.Domain = config.DOMAIN;
    siteDomainConfig.Path = config.PATH;
}

export const baseURL = `${siteDomainConfig.Domain}${siteDomainConfig.Path}`

export default siteDomainConfig