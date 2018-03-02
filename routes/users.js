var express = require('express');
// let client = require('../sdk/redisClient');
var router = express.Router();

router.get('/get',(req, res, next)=>{
  console.log(req.query.user);
  // client.llen('userEmail',(err,length)=>{
  //   if(!err){
  //     client.lrange('userEmail', 0, length,(err,result)=>{
  //       if(err){
  //         console.log(`用户列表请求异常:${err}`);
  //       }else{
  //         console.log(`用户列表请求结果：${result}`);
  //         res.send(result);
  //       }
  //     });
  //   }
  // });
});

router.post('/add',(req, res, next)=>{
  console.log(req.query.user);
});

module.exports = router;
