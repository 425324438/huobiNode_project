# huobiNode_project
重构火币网数字货币监控系统
### 说明：
__nodeJs 版本：v9.6.1__，
__npm 版本：5.6.0__，
__pm2 版本： 2.9.1__
### 下载
```git clone git@github.com:425324438/huobiNode_project.git```
### 初始化
```npm i ```

1.  项目根目录下的 /job/resource/userEmail **清空此文件**
   
2. 需安装**pm2** 管理项目
否则：请自行修改**package.json**
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
