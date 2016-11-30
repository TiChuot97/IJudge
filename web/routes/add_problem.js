/**
 * Created by lanhoangdao on 11/16/16.
 */

var express = require('express');
var router = express.Router();
var database = require('../database/database');

/* GET problem creating page. */
router.get('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    res.render('add_problem', {
	    title: 'Add Problem'
	});
});

function get_username(cookie) {
    var pos = cookie.indexOf('**');
    return cookie.substring(0, pos);
}

function filter(sample) {
    sample = sample.replace(/\'/g, '&#39;');
    sample = sample.replace(/\"/g, '&#34;');
    return sample;
}

/* Add new problem */
router.post('/', function(req, res, next) {
    var name = req.body.name;
    var time = req.body.time;
    var memory = req.body.memo;
    var description = req.body.description;
    var num_cases = req.body.num_sample;
    var username = get_username(req.cookies['user']);

    name = filter(name);
    time = filter(time);
    memory = filter(memory);
    description = filter(description);

    console.log(description);

    var cases = {};
    for (var index = 1; index <= num_cases; ++index) {
        cases[index] = {};
        cases[index]['input'] = req.body['input_sample_' + index];
        cases[index]['output'] = req.body['output_sample_' + index];
        cases[index]['input'] = filter(cases[index]['input']);
        cases[index]['output'] = filter(cases[index]['output']);
    }

    database.add_problem(name, time, memory, description, username);
    database.add_sample(cases);

    res.render('problem', {
        title: 'Problem',
        name: name,
        time: time,
        memory: memory,
        description: description,
        sample: cases,
        author: username
    });
});

module.exports = router;
