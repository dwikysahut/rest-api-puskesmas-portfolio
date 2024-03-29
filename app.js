// import instaRefreshCron from './crons/instaRefresh.cron';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const cron = require('node-cron');

const https = require('https');
const http = require('http');

const fs = require('fs');
const path = require('path');

const socketIo = require('socket.io');
const { instagramToken } = require('./src/utils/instaRefresh.cron');

const routeNavigator = require('./src/index');
const { errorMiddleware } = require('./src/middleware/errorMidd');

const app = express();
require('dotenv').config();

const server = https
  .createServer(
    {
      key: fs.readFileSync('./security/cert.key'),
      cert: fs.readFileSync('./security/cert.pem'),
    },
    app,
  );

const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

const usersConnected = [];
io.on('connection', (socket) => {
  socket.on('user-connected', (userId) => {
    usersConnected[userId] = socket.id;
    console.log(usersConnected); // ojIckSD2jqNzOqIrAGzL
  });
});
// const server = app.listen(process.env.PORT, process.env.HOST_LOCAL, () => {
//   const host = server.address().address;
//   const { port } = server.address();

//   console.log(`server running at${host} : ${port}`);
// });

// setting https
server.listen(process.env.PORT, process.env.NODE_ENV === 'production'
  ? process.env.HOST_DEPLOY : process.env.HOST_LOCAL, () => {
  console.log(
    `app running and listening on port ${server.address().port}! Go to https://${process.NODE_ENV === 'production' ? process.env.HOST_DEPLOY : process.env.HOST_LOCAL}:${server.address().port}/`,
  );
});

// refresh instaAccessToken eg: weekly(every Sat)
cron.schedule('* * * * * 7', async () => {
  await instagramToken();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${__dirname}/public`));
app.use(morgan('dev'));
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: 'true',
  optionSuccessStatus: 200,

}));

app.use('/', routeNavigator);
app.use(errorMiddleware);

module.exports = app;
