// server.js
const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');

// server extensions
const auth = require('./server/auth');
const routes = require('./server/routes');
const uploads = require('./server/uploads');

// config and internals
const config = require('./config');

/**
 * Configure Express production server
 * */

// initialize the server
const app = express();

// send compressed assets
app.use(compression());

// provide a session secret
app.use(
  session({
    secret: process.env.NHBA_SECRET || 'ut-oh',
    name: 'react-boilerplate',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 * 24 }, // 24 hours
  }),
);

// serve files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// enable the cookie parser
app.use(cookieParser());

// enable the body parser
app.use(bodyParser.urlencoded({ extended: true }));

// enable json body parsing
app.use(bodyParser.json());

// sanitize mongo queries
app.use(mongoSanitize());

// sanitize html input
app.use(expressSanitizer());

// enable method overrides
app.use(methodOverride());

// specify favicon
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));

// enable logging
morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
});

// send CORS headers to enable dev work on 8081
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

/**
 * Server extensions
 * */

auth(app);
routes(app);
uploads(app);

/**
 * Server environment
 * */

// check whether we need to initialize a production grade https server
if (process.env.NHBA_ENVIRONMENT == 'production') {
  const options = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert),
  };

  https.createServer(options, app).listen(443);

  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://${req.headers.host}${req.url}`,
      });
      res.end();
    })
    .listen(80);

  // if we're not in production, run on the config.js specified port
} else {
  const PORT = process.env.PORT || config.api.port;
  app.listen(PORT, () => {
    console.info(`Production Express server running at localhost:${PORT}`);
  });
}
