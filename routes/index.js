var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WISDOM FROM AFAR' });
});


console.log('Server running at http:localhost:3000');

module.exports = router;