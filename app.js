var createError = require('http-errors');
const cron = require("node-cron");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var tronscanUIRouter = require('./routes/tronscanUI');
var tronscanAPIRouter = require('./routes/tronscanAPI')
var djedAPIRouter = require('./routes/djedAPI')
var tronlinAPIRouter = require('./routes/tronlinkAPI')
var tronlinUIRouter = require('./routes/tronlinkUI')
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
app.use("/",tronlinAPIRouter)
// app.use("/",tronlinUIRouter)
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

cron.schedule("0 30 22 * * *", function() {
  console.log("---------------------");
  mysqltoday('tronscanUI')
  mysqltoday('tronscanAPI')
  mysqltoday('djedAPI')
  mysqltoday('tronlinkAPI')

});

function mysqltoday(info){
  var todayresult = {}
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : '39.105.200.151',
    user     : 'AutoTestScan',
    password : 'root'
  });

  connection.connect();
  connection.query('SELECT COUNT(*) as "todaysum" FROM `AutoTestScan`.'+info+' where to_days(time) = to_days(now())', function(err, rows, fields) {
    if (err) throw err;
    todayresult["todaysum"] = rows[0].todaysum;
  });

  connection.query('SELECT COUNT(*) as "todayfail" FROM `AutoTestScan`.'+info+'  where to_days(time) = to_days(now()) and `status` = 2', function(err, rows, fields) {
    if (err) throw err;
    todayresult["todayfail"] = rows[0].todayfail;

  });

  connection.query('SELECT COUNT(*) as "todaysucess" FROM `AutoTestScan`.'+info+'  where to_days(time) = to_days(now()) and `status` = 1', function(err, rows, fields) {
    if (err) throw err;
    todayresult["todaysucess"] = rows[0].todaysucess;
    console.log(todayresult["todaysucess"])
    var DingRobot = require('ding-robot');
    var robot = new DingRobot('c1f36f510c16df2d261e91a2205fb21d487d853e87118b118d781ceffc3ee799');
    robot.text(info+' 今日执行情况：\n共执行次数：'+todayresult['todaysum']+'次\n成功次数：'+todayresult['todaysucess']+'次\n失败次数：'+todayresult['todayfail']+'次');
  });
  connection.end();
}

module.exports = app;
