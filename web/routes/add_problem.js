var express = require('express');
var router = express.Router();

/* GET problem creating page. */
router.get('/', function(req, res, next) {
	res.render('add_problem', { title: 'Add Problem' });
});

/* Add new problem */
router.post('/', function(req, res, next) {
    var name = req.body.name;
    var time = req.body.time;
    var memory = req.body.memo;
    var description = req.body.description;
    var num_cases = req.body.num_sample;

    var cases = {};
    for (var index = 1; index <= num_cases; ++index) {
        cases[index] = {};
        cases[index]['input'] = req.body['sample_' + index][0];
        cases[index]['output'] = req.body['sample_' + index][1];
    }

    res.render('problem', {
        title: 'Problem',
        name: name,
        time: time,
        memory: memory,
        description: description,
        sample: cases
    });
});

module.exports = router;
