var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session')
const passport = require('passport');
const cors = require('cors')

require('dotenv').config();
require('./utils/connectdb');
require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

const whitelist = process.env.WHITELISTED_DOMAINS
	? process.env.WHITELISTED_DOMAINS.split(',')
	: [];
const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},

	credentials: true,
};
app.use(cors(corsOptions));

app.use(session({
    name: 'session-id',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      sameSite: 'strict',
    },
  }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
