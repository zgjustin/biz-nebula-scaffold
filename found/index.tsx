/**
 * 开发环境入口文件
 */
import entry from './entry'

export default entry(require('./app/index.tsx').default,require('./model/index.ts').default)