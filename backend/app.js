var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const aws = require('aws-sdk');

require('dotenv').config();
require('./utils/connectdb');
require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const indexRouter = require('./routes/index');
const { COOKIE_OPTIONS } = require('./authenticate');

aws.config.region = 'us-east-1'

var app = express();

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use(
	session({
		name: 'session-id',
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: COOKIE_OPTIONS,
	})
);

app.use(passport.initialize());

app.use('/api', indexRouter);

// app.use(express.static(path.join(__dirname, '../frontend/build'), { index: '_' }));
// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname + '/../frontend/build/index.html'))
// });

// app.get('/*', (req, res) => {
// 	res.sendFile('index.html', { root: path.join(__dirname, '/../frontend/build/')})
// })

app.use('/', express.static(path.join(__dirname, '/../frontend/build'), {index: false}))
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/../frontend/build/index.html'))
})

module.exports = app;
