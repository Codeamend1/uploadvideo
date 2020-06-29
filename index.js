var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash        = require('req-flash');

var apiuserRouter = require('./routes/userapi');
var apivendorRouter = require('./routes/vendorapi');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var vendorRouter = require('./routes/vendor');


var expressValidator = require('express-validator');

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

var app = express();
var reload = require('reload');

app.set('port', 7777);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"webnexs"}));
app.use(expressValidator());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root', 
        password : '', 
        port : 3306, 
        database:'wcart' 
    },'pool')
);
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/vendor', vendorRouter);

app.use('/userapi', apiuserRouter);
app.use('/vendorapi', apivendorRouter);

app.use(function(req, res, next) {
    req.header("Content-Type", "application/json");
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
    
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'));
console.log('Server Runnign on port localhost:' + app.get('port'));

module.exports = app;
