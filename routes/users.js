var express = require('express');
const fs = require('fs');
var router = express.Router();

let resource_url = '../huobiNode_project/job/resource';

router.get('/get',(req, res, next)=>{
  console.log(req.query.user);
  fs.readFile( resource_url + `/userEmail`,(err,data)=>{
    if(err){
      console.log(err);
    }else{
      console.log(data.toString());
      res.send(JSON.parse(data.toString()));
      res.end();
    }
  });
});

router.post('/add',(req, res, next)=>{
  /**
   { user: '123',
   currency: '123',
    email: '123',
    user_start: '123',
    user_end: '123' 
   }
   */  
  console.log(req.body);
});

module.exports = router;
