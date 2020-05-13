var express = require('express');
const http = require('http');
const axios = require("axios");
var api = express.Router();
var result = {};
var lastresult = {};
var todayresult = {};
mysql()
api.get("/tronscanui",function (req, res) {
    res.json(mysql());
});
mysqllast()
api.get("/tronscanui/lastest",function (req, res) {
    res.json(mysqllast());
});
mysqltoday()
api.get("/tronscanui/today",function (req, res) {
    res.json(mysqltoday());
});

api.get("/tronscanui/run",function (req,res) {
    runTest()
    res.json()
})
module.exports = api;
function runTest() {
    let test = 'sss';
    axios.get("http://tronlink:tronlink@172.16.22.178:8080/job/Tronscan_AutoTest/build?token=tronscan").then(res=>{
        test = res;
    })
    console.log(test);
    // let getIP = ''
    // try {
    //     (async () => {
    //         getIP = (await http.get('http://tronlink:tronlink@172.16.22.178:8080/job/Tronscan_AutoTest/build?token=tronscan', (res) => {
    //             let itemUrl = res.headers.location + "api/json";
    //             return itemUrl;
    //             res.resume();
    //         }).on('error', (e) => {
    //             console.log(`Got error: ${e.message}`);
    //         }))
    //     })()
    // } catch (e) {
    //     console.log(e)
    // }
    // console.log(getIP)
    // http.get('http://tronlink:tronlink@172.16.22.178:8080/job/Tronscan_AutoTest/build?token=tronscan', (res) => {
    //     let itemUrl = res.headers.location + "api/json";
    //     console.log(`Got queue_item: ${res.headers.location}`);
    //     res.resume();
    // }).on('error', (e) => {
    //     console.log(`Got error: ${e.message}`);
    // });
    // var test = "";
    // var mysql      = require('mysql');
    // var connection = mysql.createConnection({
    //     host     : '39.105.200.151',
    //     user     : 'AutoTestScan',
    //     password : 'root'
    // });
    // connection.connect();
    // connection.query("INSERT INTO `AutoTestScan`.`tronscanAPI`(`time`, `status`, `sucessclass`, `sucessnum`,`failClass`,`failnum`,`sum`) VALUES ('"+time+"','"+status+"','"+sucessClass+"','"+sucessnum+"','"+failClass+"','"+failnum+"','"+sum+"')", function(err, rows, fields) {
    //     if (err) throw err;
    //     console.log('The solution is: ', rows);
    //     var string=JSON.stringify(rows);
    //     result = JSON.parse(string);
    //     console.log(result)
    // });
    //
    // connection.end();
    // return result;
}
function mysql(){
    var test = "";
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : '39.105.200.151',
        user     : 'AutoTestScan',
        password : 'root'
    });

    connection.connect();
    connection.query('SELECT * FROM `AutoTestScan`.`tronscanUI` order by id desc  limit 30', function(err, rows, fields) {
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
    connection.query('SELECT * FROM `AutoTestScan`.`tronscanUI` order by id DESC limit 1', function(err, rows, fields) {
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
    connection.query('SELECT COUNT(*) as "todaysum" FROM `AutoTestScan`.`tronscanUI` where to_days(time) = to_days(now())', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todaysum"] = rows[0].todaysum;

    });

    connection.query('SELECT COUNT(*) as "todayfail" FROM `AutoTestScan`.`tronscanUI` where to_days(time) = to_days(now()) and `status` = 2', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todayfail"] = rows[0].todayfail;

    });

    connection.query('SELECT COUNT(*) as "todaysucess" FROM `AutoTestScan`.`tronscanUI` where to_days(time) = to_days(now()) and `status` = 1', function(err, rows, fields) {
        if (err) throw err;
        todayresult["todaysucess"] = rows[0].todaysucess;

    });
    connection.end();
    return todayresult;
}
