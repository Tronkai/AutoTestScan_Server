var express = require('express');
var api = express.Router();
var result = {};

api.get("/tronscanui",function (req, res) {
    res.json(mysql());
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
    connection.query('SELECT * FROM `AutoTestScan`.`tronscanUI` where to_days(time) = to_days(now())', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows);
        var string=JSON.stringify(rows);
        result = JSON.parse(string);
        console.log(result)
    });

    connection.end();
    return result;
}
