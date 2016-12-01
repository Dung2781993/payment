var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var reportData = require('../data/data.json')
var fs = require('fs');
router.get('/api',function(req,res){
	res.json(reportData);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.post('/api',function(req,res){
	fs.writeFile('app/data/data.json', JSON.stringify(reportData), 'utf8', function(err) {
    	if (err) {
      		console.log(err);
    	}
  	});
	res.json(reportData);
});




module.exports = router;