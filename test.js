// const hbsdk = require('./sdk/hbsdk');
// const sendMail = require('./email/mail');

// let client = require('../sdk/redisClient');

let  mainTest  = async (account) =>  {
    
    // sendMail('2037520355@qq.com','NodeJs测试','数字货币价格监控测试');

    // let num = 1.726273600000000000;
    // let str = JSON.stringify(num);
    // Math.round(123.4567789*100)/100
    
    // client.smembers('userEmail',(err,result)=>{
    //     console.log(result);
    // });
    // let dateString = '2018-02-16 10:20:00';
    // let zaodate = new Date().convertDateFromString(dateString);

    // let wandate = new Date().convertDateFromString('2018-02-16 10:25:00');
    // console.log(zaodate.getTime());
    // console.log(wandate.getTime());

    // console.log(zaodate.getTime() - wandate.getTime());
    // console.log(`${1000 * 60 * 5} ：5分钟的毫秒数`);

    let str = '{"btcusdt":"9445.63","dataTime":"2018-02-25 09:48:55"}';

    console.log(JSON.parse(str));
}


Date.prototype.convertDateFromString = function convertDateFromString(dateString) {
    if (dateString) { 
        var date = new Date(dateString.replace(/-/,"/")) 
        return date;
    }
}
mainTest();
// module.exports =  mainTest;