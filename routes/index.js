var express = require('express'),
    router = express.Router(),
    scraper = require('../models/scraper.js');

/* GET home page. */
scraper.then(function(data) {
	var bbc,
	    sky;
	for(var i = 0; i < data.length; i++) {
		if(data[i][0] === 'http://www.bbc.com/news') {
			bbc = data[i];
		} else {
			sky = data[i];
		}
	}
    var bbcUrl = bbc.shift(),
        skyUrl = sky.shift();
    bbcUrl = bbcUrl.slice(0, - 5);
    router.get('/', function(req, res) {
        res.render('index', { 
        	title: 'Latest News', 
        	bbc: bbc, 
        	sky: sky,
            bbcUrl: bbcUrl,
            skyUrl: skyUrl
        });
    });
    console.log('Application ready in http://localhost:3000/');
});


module.exports = router;
