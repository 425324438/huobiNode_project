var express = require('express');
// let client = require('../sdk/redisClient');
var router = express.Router();

/* GET home page. */
router.get('/getCurrenc', function(req, res, next) {
    // client.get('currencyList',(err,result)=>{
    //     if(err){
    //         console.log(`查询出错:${err}`);
    //     }else{
    //         console.log(`货币对列表:${result}`);
    //         res.send(result);
    //     }
    // });
});

// updateCurrency
router.post('/updateCurrency',(req, res, next)=>{
    // client.set('currencyList',req.body.currency);
    res.send({state : 0});
});
module.exports = router;
