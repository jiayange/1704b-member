const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')

const router = require('./router/index')

const app = new Koa()

app.use(bodyParser())
app.use(static(path.join(process.cwd(), 'public')))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
console.log('3000端口监听')