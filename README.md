
# nebula Apps 应用开发脚手架

> nebula应用开发脚手架
> 依赖模块 biz-nebula-cli, dva, react-router, typescript
> 
>
### npm i biz-nebula-cli -g
### biz-nebula-cli init
### 输入工程名称 回车

由于从git上拉的项目代码，所有初始化后需要删除目录下的.git映射，使用本地github


### 主题配置
样式主题 配置theme.json配置文件

从/v1/nebula/theme/findTheme返回的数据中拿取 color数据结构用于自定义

### 更新脚手架
1. 下载最新版本脚手架
2. 替换env,found,package.json(有更新依赖)
3. npm install 安装最新依赖
4. npm start 启动本地开发
5. npm build 生产starter环境发布
6. npm run publish 生产node环境发布（性能提升)
