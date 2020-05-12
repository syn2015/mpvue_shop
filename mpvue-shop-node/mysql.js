// 获取基础配置
const configs = require('./config')

// 使用knex ，一款sql查询构建器，创建mysql连接池
var knex = require('knex') ({
  client: 'mysql',
  connection: {
    host: configs.mysql.host,
    port: configs.mysql.port,
    user: configs.mysql.user,
    password: configs.mysql.pass,
    database: configs.mysql.db,
  }
})
// 将基础配置和sdk.config 合并 导出初始化完成的sdk
module.exports = { mysql: knex }