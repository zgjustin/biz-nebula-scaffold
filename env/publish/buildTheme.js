/*
 * @Author: justin
 * @Date: 2020-11-22 21:04:04
 * @LastEditTime: 2020-11-25 15:21:09
 * @LastEditors: justin
 * @FilePath: /nebula.first/env/publish/buildTheme.js
 * @Description: 发布编译脚本
 */
const compressing = require("compressing");
const { exec } = require('child_process')
const fs = require('fs');
const iconv = require('iconv-lite')
const path = require('path')
const os = require('os')
const less = require('less')
const themeColor = require('../../src/theme.json')

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
/**
 * 编译less文件到对应的文件
 * @param {*} input less文本
 * @param {*} fileName 输入文件名
 */
async function complieLess(input,fileName){
    let outCss = await new Promise(resolve=>{
        less.render(input,{javascriptEnabled:true},(error,out)=>{
            if(error){
                console.error('less render:',error);
                resolve(false);
                return;
            }
            resolve(out.css);
        })
    })
    if(!outCss) return;
    return await writeSettingFile(fileName,outCss);
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
//文件读取
function readSettingFile(file){
    return new Promise((resolve,reject)=>{
        fs.readFile(file, function (err, data) {
            if(err){
                resolve();
                return console.error('fileError',err);
            }
            return resolve(data.toString());
        })
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
function execResult(result){
    if(!result){
        process.exit();
        return;
    }
}
//开始准备环境
async function start(){
    console.log('开始准备主题样式...');
    //生成nebula的主题样式
    let themeVar = ((themeColor||{}).color||{}).variables;
    if(themeVar){
        let themeVarString = Object.entries(themeVar).map(([k,v])=>`${k}:${v}`).join(';');
        //生成nebula主题
        execResult(await complieLess(`@import './env/resource/static/theme/less/default.less';${themeVarString};@import './env/resource/static/theme/less/index.less';`,path.join(process.cwd(), './env/resource/static/css/nebula.theme.css')));
        //生成扩展样式
        execResult(await complieLess(`@import './env/resource/static/theme/less/default.less';${themeVarString};@import './src/assert/index.less';`,path.join(process.cwd(), './env/resource/static/css/nebula.extend.css')));
        console.log('主题样式准备完成!');
    }else{
        console.log('未获取到主题样式，查看theme.json!');
    }
}
//准备发布包
start()
