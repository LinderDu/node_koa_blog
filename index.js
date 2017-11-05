const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const ejs = require('ejs');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.config.js');
const router = require('koa-router');
const views = require('koa-views');
const koaStatic = require('koa-static');
const app = new Koa();

// session config
const sessionMySqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST
};

// session middleware
app.use(session({
    key: "USER_SID",
    store: new MysqlStore(sessionMySqlConfig)
}));

// 静态资源加载中间件
app.use(koaStatic(
    path.join(__dirname, './public')
));

// 服务端模版渲染引擎
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

// 表单解析中间件
app.use(bodyParser());

// 路由
app.use(require('./routers/signup.js').routes());

// 端口监听
app.listen(config.port, "127.0.0.1");
console.log(config.port);








