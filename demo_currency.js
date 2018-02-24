const hb_currency = require('./sdk/hb_currency');

let  run = ()=>{
    var config = {
        access_key : '0e44466a-072c6d96-121dc8f5-bd52d',
        secretkey : '079f54ea-165848f7-aefbc94c-70cea'
    }
    hb_currency.get_currency('xrpusdt',config).then(console.log);
    // console.log(json);
    
}
run();