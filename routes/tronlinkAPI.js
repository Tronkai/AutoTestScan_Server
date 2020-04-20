var express = require('express');
var api = express.Router();
var result = {};
var lastresult = {};
var todayresult = {};

mysql();
api.get("/tronlinkapi",function (req, res) {
    res.json(mysql());
});
mysqllast();
api.get("/tronlinkapi/lastest",function (req, res) {
    res.json(mysqllast());
});
mysqltoday()
api.get("/tronlinkapi/today",function (req, res) {
    res.json(mysqltoday());
});
module.exports = api;

function mysql(){
    var test = "";
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : '39.105.200.151',
        user     : 'AutoTestScan',
        password : 'root'
    });

    connection.connect();
    connection.query('SELECT * FROM `AutoTestScan`.`tronlinkAPI` order by id desc  limit 30', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows);
        var string=JSON.stringify(rows);
        result = JSON.parse(string);
        console.log(result)
    });

    connection.end();
    return result;
}
function mysqllast(){
    var test = "";
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : '39.105.200.151',
        user     : 'AutoTestScan',
        password : 'root'
    });

    connection.connect();
    connection.query('SELECT * FROM `AutoTestScan`.`tronscanAPI` order by id DESC limit 1', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows);
        var string=JSON.stringify(rows);
        lastresult = JSON.parse(string);
        console.log(lastresult)
    });

    connection.end();
    return lastresult;
}
function mysqltoday(){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : '39.105.200.151',
        user     : 'AutoTestScan',
        password : 'root'
    });

    connection.connect();
    connection.query('SELECT COUNT(*) as "todaysum" FROM `AutoTestScan`.`tronlinkAPI` where to_days(time) = to_days(now())', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todaysum"] = rows[0].todaysum;

    });

    connection.query('SELECT COUNT(*) as "todayfail" FROM `AutoTestScan`.`tronlinkAPI` where to_days(time) = to_days(now()) and `status` = 2', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todayfail"] = rows[0].todayfail;

    });

    connection.query('SELECT COUNT(*) as "todaysucess" FROM `AutoTestScan`.`tronlinkAPI` where to_days(time) = to_days(now()) and `status` = 1', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todaysucess"] = rows[0].todaysucess;

    });
    connection.end();
    return todayresult;
}
