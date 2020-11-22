/*
 * @Author: justin
 * @Date: 2020-11-22 21:04:04
 * @LastEditTime: 2020-11-23 06:45:46
 * @LastEditors: justin
 * @FilePath: /nebula.first/env/publish/build.js
 * @Description: 发布编译脚本
 */
const extendRoutes = require('../../src/route.js');
const compressing = require("compressing");
const fs = require('fs');
const iconv = require('iconv-lite')

//win 删除文件夹目录
const winCommand = {
    rm:'rmdir /s/q',
    mv:'move',
    cp:'xcopy',
    rename:'rename',
    mkdir:'mkdir'
};
//mac 删除文件夹目录
const macCommand={
    rm:'rm -rf',
    mv:'mv',
    cp:'cp -R',
    rename:'mv',
    mkdir:'mkdir'
}

/**
 * 解压 ssr发布包
 * @param {*}} fileName 
 * @param {*} file 
 */
function unZip(fileName,folderPath){
    return new Promise(resolve=>{
        compressing.zip.uncompress(path.join(process.cwd(), fileName), path.join(process.cwd(), folderPath))
        .then(() => {
            resolve(true);
        })
        .catch(err => {
            console.error(`解压${fileName}错误:\r\n`,err);
            resolve(false);
        });
    })
}
//文件写入
function writeSettingFile(file,data){
    return new Promise((resolve)=>{
        fs.writeFile(file,data,function(err) {
            if (err) {
                resolve(false);
                return console.error('fileError',err);
            }
            resolve(true);
        });
    }) 
}
/**
 * 运行命令
 * @param {*} commander 
 * @param {*} path 
 * @param {*} commandDesc 
 */
function runCommand(commander,appPath,commandDesc,outWarn){
    return new Promise((resolve)=>{
        commandDesc = commandDesc||'';
        if(commandDesc){
            console.log(`正在${commandDesc}...`);
        }
        exec(commander,{ encoding:'gbk', cwd: path.join(process.cwd(), appPath) },(err, stdout, stderr)=>{
            if(err){
                let message = stderr?iconv.decode(stderr,'gbk'):err;
                console.error(`${commandDesc}错误:\r\n`,message);
                resolve(false);
            }
            // console.log(`${commandDesc}完成！`);
            resolve(true);
            //不需要查看执行命令
            // console.log('stdout\r\n',stdout);
            //输出警告不查看
            outWarn && console.log('warn:\r\n',iconv.decode(stderr,'gbk'));
        });
    })
}
//获得当前系统的命令
function getComman(cmd,originSource,newSource){
    let commandStr,commandTarget;
    //win环境
    if(os.type()==='Windows_NT'){
        if(cmd==='rm'){
            originSource = originSource.replace('*','.');
        }else{
            originSource = originSource.replace(/\//,"\\");
            newSource = newSource.replace(/\//,'\\');
        }
        commandTarget = winCommand;
    }else{
        commandTarget = macCommand;
    }
    if(commandTarget.hasOwnProperty(cmd)){
        commandStr = commandTarget[cmd]
    }else{
        commandStr = cmd;
    }
    return `${commandStr} ${originSource}${newSource?' '+newSource:''}`;
}

//开始准备环境
async function start(){
    //创建发布环境文件夹
    if(!fs.existsSync(path.join(process.cwd(), `./ssr-publish`))){
        return await runCommand(`${getComman('mkdir','./ssr-publish')}`,'./');
    }
    //解压发布包
    const ssrFiles = await unZip('./env/publish/ssr.zip','./ssr-publish/');
    if(!ssrFiles) return;
    //创建应用app路由文件
    ssrFiles = await writeSettingFile(path.join(process.cwd(),`./ssr-publish/extend.route.json`),JSON.stringify(extendRoutes));
    if(!ssrFiles) return;
    //移动编译后的ssr文件到发布包中
    ssrFiles = await runCommand(`${getComman('mv','ssr-dist/*','ssr-publish/static/apps')}`,'./','拷贝环境执行代码');
    if(!ssrFiles) return;
    //拷贝自定义样式文件供ssr编译
    //copy 全局主题
    let cpResult = await runCommand(`${getComman('cp','src/assert','ssr-publish/static/theme/')}`,'./');
    if(!cpResult) return;
    //修改全局主题文件夹名称
    cpResult = await runCommand(`${getComman('rename','assert','extend')}`,'./ssr-publish/static/theme');
    console.log('环境准备完成!');
}
//准备发布包
start()
