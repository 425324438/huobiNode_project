const redis = require('redis');
const {promisify} = require('util');

const hb_currency = require('../sdk/hb_currency');
const sendMail = require('../email/mail');
const RedisConfig = require('../bin/config');

var config = {
    access_key : '0e44466a-072c6d96-121dc8f5-bd52d',
    secretkey : '079f54ea-165848f7-aefbc94c-70cea'
}


let Job = async function()  {
    let client = redis.createClient(RedisConfig.port,RedisConfig.host,{});
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
        

        let msg = '';
        if(amount[0].close > symbol[this_cur]){
            msg = "上涨";
        }else{
            msg = "下跌";
        }
        //波动百分比
        let rose =(amount[0].close - symbol[this_cur]) / amount[0].close * 100;
        rose = rose.toFixed(2);
        console.log(`当前货币对：${this_cur},价格：${amount[0].close},波动(${msg}${rose}%),上次记录价格：${symbol[this_cur]},上次记录时间是：${symbol.dataTime}`);
        if(rose >= 2.0 || rose <= -2.0 ){
            let str = `${this_cur}：5min内波动(${msg}${rose}%),当前价格：${amount[0].close},之前价格：${symbol[this_cur]}`;
            let length =  await clientLlen('userEmail');
            let userList =  await clientLrange('userEmail',0 ,length);
            for(let i =0; i < userList.length; i++){
                let user = userList[i];
                user = JSON.parse(user);
                console.log(user.currency);
                if(user.currency.indexOf(this_cur) != -1){
                    // sendMail(user.user,str,str);
                    console.log(`发送邮件...${this_cur}: 发送给 ${user.user}`);
                    sendMail(user.user,str,str);
                }
            }
            let cur_str = `{"${this_cur}":"${amount[0].close}","dataTime":"${new Date().Format('yyyy-MM-dd hh:mm:ss')}"}`;
            clientSet(this_cur,cur_str);
        }

        let date = new Date();
        let beforeDate = new Date().convertDateFromString(symbol.dataTime);
        if(date.getTime() - beforeDate.getTime() > 300000){
            if(this_cur == 'btcusdt'){
                let cur_str = `{"${this_cur}":"${amount[0].close}","dataTime":"${new Date().Format('yyyy-MM-dd hh:mm:ss')}"}`;
                clientSet(this_cur,cur_str);
            }
        }
    }
}

Date.prototype.convertDateFromString = function convertDateFromString(dateString) {
    if (dateString) { 
        var date = new Date(dateString.replace(/-/,"/")) 
        return date;
    }
}

// yyyy-MM-dd hh:mm:ss
Date.prototype.Format=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}

module.exports = Job;
