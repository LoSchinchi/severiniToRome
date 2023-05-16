var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/instructions', function(req, res, next) {
  res.render('index');
});
router.get('/downloads', function(req, res, next) {
  res.render('index');
});
router.get('/play', function(req, res, next) {
  res.render('index');
});

module.exports = router;
