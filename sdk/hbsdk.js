var CryptoJS = require('crypto-js');
var Promise = require('bluebird');
var moment = require('moment');
var HmacSHA256 = require('crypto-js/hmac-sha256')
var http = require('../framework/httpClient');

const URL_HUOBI_PRO = 'api.huobipro.com';
// const URL_HUOBI_PRO = 'api.huobi.pro'; //备用地址

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

function sign_sha(method, baseurl, path, data, config) {
    var pars = [];
    for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
    }
    var p = pars.sort().join("&");
    var meta = [method, baseurl, path, p].join('\n');
    // console.log(meta);
    var hash = HmacSHA256(meta, config.secretkey);
    var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);
    return p;
}

function get_body({access_key, config}) {
    let access = '';
    if(access_key == null){
        access = config.access_key;
    }else{
        access = access_key;
    }
    return {
        AccessKeyId: access,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
}

function call_api(method, path, payload, body, config) {
    return new Promise(resolve => {
        var account_id = config.account_id_pro || '';
        var url = `https://${URL_HUOBI_PRO}${path}?${payload}`;
        console.log(url);
        var headers = DEFAULT_HEADERS;
        headers.AuthData = get_auth(config);

        if (method == 'GET') {
            http.get(url, {
                timeout: 1000,
                headers: headers
            }).then(data => {
                let json = JSON.parse(data);
                if (json.status == 'ok') {
                    // console.log(JSON.stringify(json.data));
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
                    // console.log(JSON.stringify(json.data));
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

var HUOBI_PRO = {
    get_account: function(accessKeyId, config) {
        var path = `/v1/account/accounts`;
        var body = get_body({accessKeyId, config});
        var payload = sign_sha('GET', URL_HUOBI_PRO, path, body, config);
        return call_api('GET', path, payload, body, config);
    },
    get_balance: function(accountId, config) {
        var account_id;
        if(accountId == null){
            account_id = config.account_id_pro;
        }else{
            account_id = accountId;
        }
        
        var path = `/v1/account/accounts/${account_id}/balance`;
        var body = get_body({account_id, config});
        var payload = sign_sha('GET', URL_HUOBI_PRO, path, body, config);
        return call_api('GET', path, payload, body, config);
    },
    get_open_orders: function(symbol, config) {
        var path = `/v1/order/orders`;
        var body = get_body({config});
        body.symbol = symbol;
        body.states = 'submitted,partial-filled';
        var payload = sign_sha('GET', URL_HUOBI_PRO, path, body, config);
        return call_api('GET', path, payload, body, config);
    },
    get_order: function(order_id, config) {
        var path = `/v1/order/orders/${order_id}`;
        var body = get_body({config});
        var payload = sign_sha('GET', URL_HUOBI_PRO, path, body, config);
        return call_api('GET', path, payload, body, config);
    },
    buy_limit: function(symbol, amount, price, config) {
        var path = '/v1/order/orders/place';
        var body = get_body({config});
        var payload = sign_sha('POST', URL_HUOBI_PRO, path, body, config);

        body["account-id"] = config.account_id_pro;
        body.type = "buy-limit";
        body.amount = amount;
        body.symbol = symbol;
        body.price = price;

        return call_api('POST', path, payload, body, config);
    },
    /**
     * @param symbol : 货币对
     * @param amount ：市价单，卖出货币数量  小数点后精确 4 位
     * @param price  ：卖出价格（市价单不传该参数）
     * @param  account_id_pro : 用户数据 account_id
     */
    sell_limit: function(symbol, amount, price,account_id_pro, config) {
        var path = '/v1/order/orders/place';
        var body = get_body({config});
        var payload = sign_sha('POST', URL_HUOBI_PRO, path, body, config);

        body["account-id"] = account_id_pro;
        body.type = "sell-market";
        body.amount = amount;
        body.symbol = symbol;
        // body.price = price;

        return call_api('POST', path, payload, body, config);
    },
    withdrawal: function(address, coin, amount, payment_id, config) {
        var path = `/v1/dw/withdraw/api/create`;
        var body = get_body({config});
        var payload = sign_sha('POST', URL_HUOBI_PRO, path, body, config);

        body.address = address;
        body.amount = amount;
        body.currency = coin;
        if (coin.toLowerCase() == 'xrp') {
            if (payment_id) {
                body['addr-tag'] = payment_id;
            } else {
                console.log('huobi withdrawal', coin, 'no payment id provided, cancel withdrawal');
                return Promise.resolve(null);
            }
        }

        return call_api('POST', path, payload, body, config);
    }
}

module.exports = HUOBI_PRO;