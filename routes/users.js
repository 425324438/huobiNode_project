var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',(req, res, next)=>{
  console.log(`进入了 POST 方法`);
  console.log(req.query.user);
});

module.exports = router;
