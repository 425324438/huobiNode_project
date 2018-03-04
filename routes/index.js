var express = require('express');
const fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('进入 根路径');
  res.render('index');
});


module.exports = router;
