/*
 * @Author: justin
 * @Date: 2020-11-23 07:12:00
 * @LastEditTime: 2020-11-30 19:34:31
 * @LastEditors: justin
 * @FilePath: /business-middle-platform-web-dev/env/publish/routeConfig.js
 * @Description: 
 */
const path = require('path')
// const babelConfig = require('../../.babelrc');
// const tsConfig = require('../../tsconfig.json')
// tsConfig.compilerOptions.module='commonjs'
// require("ts-node").register(tsConfig);
require("@babel/register")({
    babelrc: false,
    ignore:['node_modules','found'],
    only:['src'],
    // include:['src','biz-nebula-ui','antd','found'],
    extensions:[".tsx", ".ts", ".js", ".json", ".less"],
    presets: [
		"@babel/preset-typescript",
		"@babel/preset-react",
		[
			"@babel/preset-env",
			{
			  "modules": 'auto'
			}
		]
    ],
    plugins: [
		["@babel/plugin-transform-runtime"],
		["@babel/plugin-proposal-decorators", { "legacy": true }],
		["@babel/plugin-proposal-class-properties", { "loose": true }],
		["syntax-dynamic-import"],
		["module-resolver",{
			"extensions":[".tsx", ".ts", ".js", ".json", ".less"],
			"root": ["./src"],
			"alias": {
			  "@":  "./src"
			}
		  }
	  ]
	]
})
module.exports = require(path.join(process.cwd(), 'src/route.ts'));