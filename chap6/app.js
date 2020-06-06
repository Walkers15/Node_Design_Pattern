const Koa = require('koa');
const app = new Koa();

app.use(require('./rateLimit'));
console.log('a');
app.use(ctx => {
        ctx.body = new Date();
    }
);
app.listen(3000);