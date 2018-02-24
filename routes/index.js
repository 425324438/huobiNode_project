var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('进入 根路径');
  res.render('index.html', { title: 'Express' });
});

module.exports = router;
