var express = require('express');
var api = express.Router();
var result = {};
var lastresult = {};
var todayresult = {};

mysql();
api.get("/tronscanapi",function (req, res) {
    res.json(mysql());
});
mysqllast();
api.get("/tronscanapi/lastest",function (req, res) {
    res.json(mysqllast());
});
mysqltoday()
api.get("/tronscanapi/today",function (req, res) {
    res.json(mysqltoday());
});
api.get("/tronscanapi/run",function (req,res) {
    var params = req.query;
    console.log(params.users)
    runTest();
    // http.get('http://tronlink:tronlink@172.16.22.178:8080/job/Tronscan_Api/build?token=tronscan');
    res.json(params)
})
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
    connection.query('SELECT * FROM `AutoTestScan`.`tronscanAPI` order by id desc limit 30', function(err, rows, fields) {
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
    connection.query('SELECT COUNT(*) as "todaysum" FROM `AutoTestScan`.`tronscanAPI` where to_days(time) = to_days(now())', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todaysum"] = rows[0].todaysum;

    });

    connection.query('SELECT COUNT(*) as "todayfail" FROM `AutoTestScan`.`tronscanAPI` where to_days(time) = to_days(now()) and `status` = 2', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todayfail"] = rows[0].todayfail;

    });

    connection.query('SELECT COUNT(*) as "todaysucess" FROM `AutoTestScan`.`tronscanAPI` where to_days(time) = to_days(now()) and `status` = 1', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todaysucess"] = rows[0].todaysucess;

    });
    connection.end();
    return todayresult;
}
