const redis = require('redis');
const {promisify} = require('util');
const hb_currency = require('../sdk/hb_currency');
const sendMail = require('../email/mail');
var config = {
    access_key : '0e44466a-072c6d96-121dc8f5-bd52d',
    secretkey : '079f54ea-165848f7-aefbc94c-70cea'
}


let Job = async function()  {
    let client = redis.createClient(6379,'120.55.48.46',{});
    const clientGet = promisify(client.get).bind(client);
    const clientSet = promisify(client.set).bind(client);
    const clientLlen = promisify(client.llen).bind(client);
    const clientLrange = promisify(client.lrange).bind(client);
    
    
     
    let rsu = await clientGet('currencyList');
    let curr = rsu.split(',');
    for(let i =0;i < curr.length ;i++){
        let this_cur = curr[i]; //当前货币对
        //获取当前货币对价格
        let amount = await hb_currency.get_currency(this_cur,config);
        // console.log(amount[0].close);
        //获取之前记录价格
        let symbol = await clientGet(this_cur);
        symbol = JSON.parse(symbol);
        // console.log(`当前货币对：${this_cur},当前价格是：${amount[0].close},上次记录价格：${symbol[this_cur]},上次记录时间是：${symbol.dataTime}`);

        let msg = '';
        if(amount[0].close > symbol[this_cur]){
            msg = "上涨";
        }else{
            msg = "下跌";
        }
        //波动百分比
        let rose =(amount[0].close - symbol[this_cur]) / amount[0].close * 100;
        if(rose >= 2.0 || rose <= -2.0 ){
            let str = `${this_cur}：5min内波动(${msg}${rose}%),当前价格：${amount[0].close},之前价格：${symbol[this_cur]}`;
            let length =  await clientLlen('userEmail');
            let userList =  await clientLrange('userEmail',0 ,length);
            userList.forEach(user => {
                user = JSON.parse(user);
                if(user.currency.indexOf(this_cur) != -1){
                    console.log(`包含此货币对${this_cur}`);
                }
            });
            // sendMail('2037520355@qq.com',str,str);
            //修改redis记录的价格
        }
        
    }

    // sendMail('2037520355@qq.com','NodeJs测试','数字货币价格监控测试');
}

Job();

module.exports = Job;
