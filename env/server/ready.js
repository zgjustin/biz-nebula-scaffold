/*
 * @Author: justin
 * @Date: 2020-07-28 16:30:35
 * @LastEditTime: 2020-09-09 11:19:21
 * @LastEditors: justin
 * @FilePath: /biz.nebula/nebula.scaffold/env/server/ready.js
 * @Description: 构建打包各个APP
 */ 

 //启用命令行
 //切换目录
 //编译打包
 //修改配置文件信息
 //copy编译后的文件到工程中apps目录下
 //运行next编译build

 const { exec } = require('child_process')
 const iconv = require('iconv-lite')
 const path = require('path')
 const template= require('@babel/template').default;
 const generate= require('@babel/generator').default;
 const t= require('@babel/types');
 const less = require('less');
 const fs = require('fs');
 const os = require('os');

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
/**
 * 运行命令
 * @param {*} commander 
 * @param {*} path 
 * @param {*} commandDesc 
 */
function runCommand(commander,appPath,commandDesc){
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
            //console.log('stdout\r\n',stdout);
            //输出警告不查看
            // console.log('stderr\r\n',stderr);
        });
    })
}

//命令数组需要同步处理
const commandSetting =[
    {pack:true,compile:'babel-pack',move:false,generateEntry:false, path:'../nebula.ui',packDesc:'编译UI库'},
    {pack:true,compile:'dll',move:true,generateEntry:false, path:'../nebula.dll',packDesc:'编译依赖功能库',moveDesc:'移动dll依赖库',asias:'dll'},
    {pack:true,compile:'ssr',move:true,generateEntry:true,path:'../nebula.account',packDesc:'编译Account应用',moveDesc:'移动Account应用',asias:'account'},
    {pack:true,compile:'ssr',move:true,generateEntry:true,path:'../nebula.doc',packDesc:'编译Doc应用',moveDesc:'移动Doc应用',asias:'doc'},
    {pack:true,compile:'ssr',move:true,generateEntry:true,path:'../nebula.toolkit.tool',packDesc:'编译Toolkit应用',moveDesc:'移动Toolkit应用',asias:'datasource'},
    {pack:true,compile:'ssr',move:true,generateEntry:false,path:'../nebula.page',packDesc:'编译Page应用',moveDesc:'移动Page应用',asias:'page'}
]

//开始编译处理
async function startCompile(){
    //准备编译
    let hasError = false;
    const compileCommands = commandSetting.filter(v=>v.pack);
    for(let i = 0;i<compileCommands.length;i++){
        let curCommander = compileCommands[i];
        let runResult = await runCommand(`npm run ${curCommander.compile}`,curCommander.path,curCommander.packDesc);
        if(!runResult) {
            hasError = true;
            break;
        }
    }
    if(!hasError){
        console.log('Nebula所有应用编译完成！');
    }
    return !hasError;
}
//开始移动App到当前Ssr工程下
async function startMoveApp(){
    let hasError = false;
    const mvCommands = commandSetting.filter(v=>v.move);
    for(let i=0;i<mvCommands.length;i++){
        let curCommander = mvCommands[i];
        let mvResult = await runCommand(`${getComman('mv','ssr-dist','../nebula.scaffold/env/resource/static/apps')}`,curCommander.path,curCommander.moveDesc);
        if(!mvResult) {
            hasError = true;
            break;
        }
        let renameResult = await runCommand(`${getComman('rename','ssr-dist',curCommander.asias)}`,'./env/resource/static/apps');
        if(!renameResult){
            hasError = true;
            break;
        }
    }
    //copy app.json文件
    // await runCommand(`cp app.json ./apps/app.json`,'./')
    return !hasError;
}
/**
 * 复制主题样式配置
 */
async function copyTheme(){
    console.log('开始准备主题...');
    //移除全局主题文件从新copy
    let cleanResult = await runCommand(`${getComman('rm','less')}`,'./env/resource/static/theme')
    if(!cleanResult) return;
    //copy 全局主题
    let cpResult = await runCommand(`${getComman('cp','node_modules/nebula-ui/lib/style/theme','./env/resource/static/theme')}`,'./')
    if(!cpResult) return;
    //修改全局主题文件夹名称
    cpResult = await runCommand(`${getComman('rename','theme','less')}`,'./env/resource/static/theme');
    if(!cpResult) return;
    //copy 组件主题
    cpResult = await runCommand(`${getComman('cp','node_modules/nebula-ui/lib/style/components','./env/resource/static/theme')}`,'./')
    if(!cpResult) return;

    //copy 字体库
    cpResult = await runCommand(`${getComman('cp','node_modules/nebula-ui/lib/_assets','./env/resource/static')}`,'./')
    if(!cpResult) return;
    //修改字体库文件夹名称
    cpResult = await runCommand(`${getComman('rename','_assets', 'fonts')}`,'./env/resource/static');
    return true;
}
//文件读写
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
//文件写入
function writeSettingFile(file,data){
    return new Promise((resolve)=>{
        fs.writeFile(file,data,function(err) {
            if (err) {
                resolve();
                return console.error('fileError',err);
            }
            resolve(true);
        });
    }) 
}
const routePathSetting = [];
//编译各APP的Ssr入口文件，根据模版使用babel编译生成入口文件
async function startGenerateEntry(appPath){
    // 异步读取
    const fileContent = await readSettingFile(path.join(process.cwd(), appPath,'./src/ssrEntry/moduleMap.json'));
    if(!fileContent) return;
    const codeTempalte = await readSettingFile(path.join(process.cwd(), appPath,'./src/ssrEntry/template.ejs'))
    if(!codeTempalte) return;
    const routePaths = JSON.parse(fileContent);
    let wirteResult = true;
    for(let i=0;i<routePaths.length;i++){
        const rp = routePaths[i];
        routePathSetting.push({...rp,appPath:appPath});
        const fn = template(codeTempalte);
        const templateParam = {};
        Object.entries(rp).forEach(([k,v])=>{
            if(k==='moduleName'){
                templateParam[k] = t.identifier(v);
            }else if(k==='pageModule'){
                v = path.join('../app',v);
                templateParam[k] =  t.stringLiteral(v);
            }else{
                templateParam[k] = t.stringLiteral(v);
            }
        })
        const ast = fn(templateParam);
        const results = ast.map(v=>{
            return generate(v).code
        })
        const code = results.join('\r\n');
        const writeResult = await writeSettingFile(path.join(process.cwd(), appPath,`./ssr/ssrEntry/${rp.moduleName}.js`),code);
        if(!writeResult){
            wirteResult = false;
            break;
        } 
    }
    return wirteResult;
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
/**
 * 检查并判定文件夹名是否存在
 * 不存在则创建文件夹 否则不做处理
 * @param {*} dirname 
 */
async function createDir(dirname,dirpath){
    if(!fs.existsSync(path.join(process.cwd(), dirpath+"/"+dirname))){
        return await runCommand(`${getComman('mkdir',dirname)}`,dirpath);
    }
    return true;
}
//开始所有的命令处理
async function start(){
    console.log('开始Nebula-SRR环境准备');
    //准备环境目录  初始化需要的目录
    let readyResult = await createDir('static','./env/resource');
    if(!readyResult) return;
    readyResult = await createDir('css','./env/resource/static');
    if(!readyResult) return;
    readyResult = await createDir('apps','./env/resource/static');
    if(!readyResult) return;
    readyResult = await createDir('fonts','./env/resource/static');
    if(!readyResult) return;
    readyResult = await createDir('theme','./env/resource/static');
    //清空apps下所有文件 准备重新copy编译文件过来
    let cleanResult = await runCommand(`${getComman('rm','apps')}`,'./env/resource/static','清理环境');
    if(!cleanResult) return;
    //创建apps文件夹
    cleanResult = await runCommand(`${getComman('mkdir','apps')}`,'./env/resource/static');
    if(!cleanResult) return;
    cleanResult = await runCommand(`${getComman('rm','fonts')}`,'./env/resource/static');
    if(!cleanResult) return;
    //清空build下所有文件
    let clearnBuild = await runCommand(`${getComman('rm','build')}`,'./');
    if(!clearnBuild) return;
    //创建build文件夹
    clearnBuild = await runCommand(`${getComman('mkdir','build')}`,'./');
    if(!clearnBuild) return;
    //编译APP
    let complieResult = await startCompile();
    if(!complieResult) return;
    //写入入口文件
    // console.log('准备入口文件');
    // const generateFiles = commandSetting.filter(v=>v.generateEntry);
    // let generateResult = true;
    // for(let i=0;i<generateFiles.length;i++){
    //     generateResult = await startGenerateEntry(generateFiles[i].path);
    //     if(!generateResult) break;
    // }
    // if(!generateResult) return;
    // //生成入口文件的ssr路由配置
    // const settingFn = template(`
        
    // `);
    // const itemCode = routePathSetting.map(v=>{
    //     return `{
    //         path: '${v.path}',
    //         component: ()=>import('${path.join('../',v.appPath,'./ssr/ssrEntry',v.moduleName)}')
    //     }`
    // }).join(',\r\n');
    // //写入文件
    // const fileTemplate = template(`const routes = [
    //     %%settingCode%%
    // ];
    // export default routes;`);
    // const fileAst = fileTemplate({
    //     settingCode:t.identifier(itemCode)
    // })
    // const saveCode = fileAst.map(f=>generate(f).code).join('\r\n');
    // const wirteRouteResult = await writeSettingFile(path.join(process.cwd(),`./config/route.js`),saveCode);
    // if(!wirteRouteResult) return;
    //移动APP到当前工程
    let moveResult = await startMoveApp();
    if(!moveResult) return;
    //复制主题样式
    await copyTheme();
    //less编译nebula.ui样式
    let antdLessResult = await runCommand(`${getComman('cp','node_modules/nebula-ui/node_modules/antd/dist/antd.css','./env/resource/static/css')}`,'./');
    if(!antdLessResult) return;
    let nebulaLessResult = await complieLess('@import "node_modules/nebula-ui/lib/style/nebula.less";',path.join(process.cwd(), './env/resource/static/css/nebula.css'));
    if(!nebulaLessResult) return;
    console.log('Nebula-SSR环境已准备好，可以进行Ssr打包了!')
}

//启动命令
start();


