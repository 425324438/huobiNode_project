const redis = require('redis');

let client = redis.createClient(6379,'120.55.48.46',{});

client.on("connect",(err)=>{
    console.log('连接Redis成功！');
});

client.on("error",(err)=>{
    console.log(`Redis链接出错！`);
    console.log(err);
});

client.on('end', function(){
    console.log('Redis关闭.');
})


// client.get('currencyList',(err,res)=>{
//     if(err){
//         console.log(`查询出错${err}`);
//     }else{
//         console.log(res);
//     }
// });

module.exports = client;