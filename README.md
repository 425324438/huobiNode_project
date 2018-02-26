# huobiNode_project
重构火币网数字货币监控系统

修改redis配置文件：**huobiNode_project/bin/config.js**
```
module.exports = {
    host : 'localhost',
    port : 6379
}
```
1. 需安装pm2 管理项目
否则：自行修改**package.json**
```
 "scripts": {
    "start": "pm2 start ./bin/www --name huobiNode_project"
  } 
```
修改为：
```
 "scripts": {
   "start": "node app.js"
  } 
```
启动命令：`npm start`
