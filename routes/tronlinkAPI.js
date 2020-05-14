var express = require('express');
var api = express.Router();
const http = require('http');
const rpn = require('request-promise-native');
var result = {};
var job = {};
var jobqueue = {}
var lastresult = {};
var todayresult = {};
var resultJob = {}

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


jobQueue().then(r => job = r)
api.get("/tronlinkapi/jobqueue",function (req,res) {
    let jobmsg = {}
    jobQueue().then(r => job = r)
    jobmsg["inQueue"] = job.inQueue
    jobmsg["lastBuildNumber"] = job.lastBuild.number
    jobmsg["lastCompletedBuild"] = job.lastCompletedBuild.number
    jobmsg["nextBuildNumber"] = job.nextBuildNumber
    jobmsg["queueItem"] = job.queueItem
    res.json(jobmsg)
})
api.get("/tronlinkapi/run",function (req,res) {
    result = runJob()
    res.json(result)
})
module.exports = api;

async function jobQueue() {
    const rpn = require('request-promise-native');
    let options = {
        method: 'GET',
        uri: "http://tronlink:tronlink@172.16.22.178:8080/job/Tronlink_API/api/json",
        // auth:{
        //     'user' : 'tronlink',
        //     'password' : 'tronlink',
        //
        // },
        // resolveWithFullResponse: true
    };
    let res = await rpn(options);
    return JSON.parse(res.toString())
}

function runJob() {
    let resultJob = {}
    jobQueue().then(r => job = r )
    if (!job.inQueue){
        if (job.lastBuild.number == job.lastCompletedBuild.number){
            //没有正在执行的job，build直接开始
            http.get('http://tronlink:tronlink@172.16.22.178:8080/job/Tronlink_API/build?token=tronscan');
            resultJob['status'] = 1
            resultJob['buildid'] = job.nextBuildNumber
            resultJob['msg'] = "用例执行开始，请稍后"
            return resultJob
        }
        else if(job.lastBuild.number > job.lastCompletedBuild.number){
            //有正在执行的job，但队列未满，build加入队列
            http.get('http://tronlink:tronlink@172.16.22.178:8080/job/Tronlink_API/build?token=tronscan');
            resultJob['status'] = 2
            resultJob['buildid'] = job.nextBuildNumber
            resultJob['msg'] = "有未执行完成job，已加入执行队列，请稍后"
            return resultJob
        }
    } else {
        //有正在执行的job，且队列未满，build未执行
        resultJob['status'] = 3
        resultJob['queueItem'] = job.queueItem
        resultJob['msg'] = "执行队列已满，请稍后再试"
        return resultJob
    }

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
    connection.query('SELECT * FROM `AutoTestScan`.`tronlinkAPI` order by id DESC limit 1', function(err, rows, fields) {
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
