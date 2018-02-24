const hbsdk = require('./sdk/hbsdk');
const sendMail = require('./email/mail');

let  mainTest  = async (account) =>  {
    
    sendMail('2037520355@qq.com','NodeJs测试','数字货币价格监控测试');

    // let num = 1.726273600000000000;
    // let str = JSON.stringify(num);
    // Math.round(123.4567789*100)/100
    
}
mainTest();
// module.exports =  mainTest;