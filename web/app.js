var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//var session = require('express-session')
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var add_problem = require('./routes/add_problem');
var problem = require('./routes/problem');
var problem_list = require('./routes/problem_list');
var login = require('./routes/login');
var logout = require('./routes/logout');
var create_account = require('./routes/create_account');
var delete_problem = require('./routes/delete_problem');
var edit_problem = require('./routes/edit_problem');

var app = express();

map_cookies = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/add_problem', add_problem);
app.use('/problem', problem);
app.use('/problem_list', problem_list);
app.use('/login', login);
app.use('/logout', logout);
app.use('/create_account', create_account);
app.use('/delete_problem', delete_problem);
app.use('/edit_problem', edit_problem);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function get_username(cookie) {
  var pos = cookie.indexOf('**');
  return cookie.substring(0, pos);
}

check_cookie = function check_cookie(req, res) {
  var cookie = req.cookies['user'];

  if (cookie != undefined) {
    var username = get_username(cookie);
    if (map_cookies[username] != undefined) {
      if (map_cookies[username] != cookie) {
        res.clearCookie('user');
        delete map_cookies[username];
      }
    }
    else
      res.clearCookie('user');
  }
}

module.exports = app;
