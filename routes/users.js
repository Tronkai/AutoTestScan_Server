var express = require('express');
var api = express.Router();
const mysql = require('mysql');
var db = require('../config/db');
var user = require('../config/user');
var connection = mysql.createConnection(db.mysql);
connection.connect();

api.post("/login",function (req, res) {
    let params = req.body;
    connection.query(user.query,params.username,(err,result) => {
        if (err) throw err
        else {
            if (result.length == 0){
                res.send({
                    status: 1,
                    msg:'用户名不存在'
                })
                res,end()
            } else {
                let response = result[0]
                if (response.username == params.username && response.password == params.password){
                    res.send({
                        status:0,
                        msg:'登录成功'
                    })
                    res.end()
                } else {
                    res.send({
                        status:2,
                        msg:'密码错误'
                    })
                    res.end()
                }
            }
        }
    })
});
module.exports = api;
