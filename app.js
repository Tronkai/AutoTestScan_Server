var createError = require('http-errors');
const cron = require("node-cron");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var tronscanUIRouter = require('./routes/tronscanUI');
var tronscanAPIRouter = require('./routes/tronscanAPI')
var djedAPIRouter = require('./routes/djedAPI')
var app = express();
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.use("/",tronscanUIRouter);
app.use("/",tronscanAPIRouter)
app.use("/",djedAPIRouter)
// cron.schedule("* * * * *", function() {
//   console.log("running a task every minute");
// });

// app.get('/autotest/tronscan',function (req, res) {
//   res.send('TRONSCAN UI Test');
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
