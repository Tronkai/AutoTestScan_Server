var express = require('express');
var api = express.Router();
const mysql = require('mysql');
var db = require('../config/db');
var user = require('../config/user');

// api.post("/login",function (req, res) {
//     let params = req.body;
//     connection.query(user.query,params.username,(err,result) => {
//         if (err) throw err
//         else {
//             if (result.length == 0){
//                 res.send({
//                     status: 1,
//                     msg:'用户名不存在'
//                 })
//                 res,end()
//             } else {
//                 let response = result[0]
//                 if (response.username == params.username && response.password == params.password){
//                     res.send({
//                         status:0,
//                         msg:'登录成功'
//                     })
//                     res.end()
//                 } else {
//                     res.send({
//                         status:2,
//                         msg:'密码错误'
//                     })
//                     res.end()
//                 }
//             }
//         }
//     })
// });
api.post("/login",function (req, res) {
    var body = '', jsonStr;
    req.on('data', function (chunk) {
        body += chunk; //读取参数流转化为字符串
    });
    req.on('end', function () {
        //读取参数流结束后将转化的body字符串解析成 JSON 格式
        try {
            jsonStr = JSON.parse(body);
            let params = jsonStr;
            var mysql      = require('mysql');
            var connection = mysql.createConnection({
                host     : '39.105.200.151',
                user     : 'AutoTestScan',
                password : 'root'
            });
            connection.connect();
            connection.query('select * from `AutoTestScan`.`users` where username = '+ "'"+params.username+ "'",(err,result) => {
                if (err) throw err
                else {
                    if (result.length == 0){
                        res.send({
                            status: 1,
                            msg:'用户名不存在'
                        })
                        res.end()
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
        } catch (err) {
            res.send({
                status:3,
                msg:'参数错误'
            })
            jsonStr = null;
        }
    });

});
module.exports = api;
