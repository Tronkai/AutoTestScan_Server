var express = require('express');
var api = express.Router();
var result = {};
api.get("/tronlinkui",function (req, res) {
    res.json(mysql());
});
module.exports = api;

function mysql(){
    var test = "";
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'zK199595@'
    });

    connection.connect();
    connection.query('SELECT * FROM `AutoTestScan`.`tronlinkUI` where to_days(time) = to_days(now())', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows);
        var string=JSON.stringify(rows);
        result = JSON.parse(string);
        console.log(result)
    });

    connection.end();
    return result;
}