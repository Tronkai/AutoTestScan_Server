var express = require('express');
var api = express.Router();
var result = {};
var lastresult = {};
mysql()
api.get("/tronscanui",function (req, res) {
    res.json(mysql());
});
mysqllast()
api.get("/tronscanui/lastest",function (req, res) {
    res.json(mysqllast());
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
    connection.query('SELECT * FROM `AutoTestScan`.`tronscanUI` order by id desc', function(err, rows, fields) {
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
