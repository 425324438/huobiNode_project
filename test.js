// const hbsdk = require('./sdk/hbsdk');
// const sendMail = require('./email/mail');
const fs = require('fs');
const {promisify} = require('util');
// let client = require('../sdk/redisClient');

let  mainTest  = async (account) =>  {
    
    // sendMail('2037520355@qq.com','NodeJs测试','数字货币价格监控测试');
    
    // let str = '{"btcusdt":"9445.63","dataTime":"2018-02-25 09:48:55"}';

    // console.log(JSON.parse(str));
    // fs.writeFile('test.txt','123123');
    let writeFile = promisify(fs.writeFile).bind(fs);
    let readFile = promisify(fs.readFile).bind(fs);

    let fileName = "currencyList";
    // let data = await writeFile(__dirname+'/'+fileName,"eosusdt,xrpusdt,ethusdt,btcusdt,htusdt,sntbtc,ltcusdt");
    let data = await readFile(__dirname+'/'+fileName);
    console.log(data.toString());

}


Date.prototype.convertDateFromString = function convertDateFromString(dateString) {
    if (dateString) { 
        var date = new Date(dateString.replace(/-/,"/")) 
        return date;
    }
}
mainTest();
