// 引入koa,并实例化app
const Koa = require('koa')
const app = new Koa()
// 引入koa-bodyparser中间件解析post数据
const bodyParser = require('koa-bodyparser')
// 引入数据库配置
const config = require('./config')

// 解析请求体
app.use(bodyParser())
// 引入koa的路由
const router = require('./routes')
app.use(router.routes())

app.listen(config.port, () => {
  console.log(`server is started at port ${config.port}`)
})

