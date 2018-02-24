var CryptoJS = require('crypto-js');
var Promise = require('bluebird');
var moment = require('moment');
var HmacSHA256 = require('crypto-js/hmac-sha256');
var http = require('../framework/httpClient');


const URL_HUOBI_PRO = 'api.huobipro.com';
// const URL_HUOBI_PRO = 'api.huobi.pro'; //备用地址


var currency = {
    /**
           var config = {
                access_key : '0e44466a-072c6d96-121dc8f5-bd52d',
                secretkey : '079f54ea-165848f7-aefbc94c-70cea'
            }
     */
    get_currency : function(symbol,config) {
        var path = `/market/history/kline`;
        var body = get_body(symbol,config.access_key);
        var payload = sign_sha('GET', URL_HUOBI_PRO, path, body,config.secretkey);
        return call_api('GET', path, payload, body, config);
    }
}

module.exports = currency;



const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
}

function get_auth(config) {
    if (config.trade_password) {
        var sign = config.trade_password + 'hello, moto';
        var md5 = CryptoJS.MD5(sign).toString().toLowerCase();
        let ret = encodeURIComponent(JSON.stringify({
            assetPwd: md5
        }));
        return ret;
    }
    return ''
}

function sign_sha(method, baseurl, path, data,secretkey) {
    var pars = [];
    for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
    }
    var p = pars.sort().join("&");
    var meta = [method, baseurl, path, p].join('\n');
    // console.log(meta);
    var hash = HmacSHA256(meta, secretkey);
    var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);
    return p;
}

function get_body(symbol,access_key) {
    return {
        symbol : symbol,
        period : '1min',
        AccessKeyId: access_key,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
}

function call_api(method, path, payload, body, config) {
    return new Promise(resolve => {
        var account_id = config.account_id_pro;
        var url = `https://${URL_HUOBI_PRO}${path}?${payload}`;
        // console.log(url);
        var headers = DEFAULT_HEADERS;
        headers.AuthData = get_auth(config);

        if (method == 'GET') {
            http.get(url, {
                timeout: 1000,
                headers: headers
            }).then(data => {
                let json = JSON.parse(data);
                if (json.status == 'ok') {
                    // console.log(json.data);
                    resolve(json.data);
                } else {
                    console.log('调用错误', json);
                    resolve(null);
                }
            }).catch(ex => {
                console.log(method, path, '异常', ex);
                resolve(null);
            });
        } else if (method == 'POST') {
            http.post(url, body, {
                timeout: 1000,
                headers: headers
            }).then(data => {
                let json = JSON.parse(data);
                if (json.status == 'ok') {
                    // console.log(json.data);
                    resolve(json.data);
                } else {
                    console.log('调用错误', json);
                    resolve(null);
                }
            }).catch(ex => {
                console.log(method, path, '异常', ex);
                resolve(null);
            });
        }
    });
}
