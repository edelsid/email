const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const { koaBody } = require('koa-body');
const Router = require('koa-router');
const { faker } = require('@faker-js/faker');

let unreadMail = [
  {
    "id": "1",
    "from": "anya@ivanova",
    "subject": "Hello from Anya",
    "body": "Long message body here" ,
    "received": Date.now(),
  }
];

const newMail = function() {
  const newLetter = {
    "id": faker.string.uuid(),
    "from": faker.internet.email(),
    "subject": faker.lorem.lines(),
    "body": faker.lorem.lines(2) ,
    "received": Date.now(),
  }
  unreadMail.push(newLetter);
}

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.response.body ='hello';
});

router.get('/messages/unread', async (ctx) => {
  try {
    const result = {
      status: "ok",
      timestamp: Date.now(),
      messages: unreadMail,
    };
    ctx.response.body = JSON.stringify(result);

    unreadMail = [];
    if (Math.random() > 0.5) {
      newMail();
    }
    if (Math.random() < 0.1) {
      throw new Error();
    } 
  } catch (err) {
    throw err;
  }
})

app.use(koaBody());
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

app.use((ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');

  console.log(ctx.headers);

  next();
})

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  return;
})

console.log('server is listening to port №' + port);