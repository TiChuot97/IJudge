/**
 * Created by lanhoangdao on 11/16/16.
 */

var express = require('express');
var router = express.Router();
var database = require('../database/database');
var common = require('../common');

/* GET problem creating page. */
router.get('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    if (!common.is_admin(req.cookies['user'])) {
        res.redirect('/');
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
    sample = sample.replace(/(?:\r\n|\r|\n)/g, '&#br;');
    sample = sample.replace(/\'/g, '&#39;');
    sample = sample.replace(/\"/g, '&#34;');
    console.log(sample);
    return sample;
}

function display_last_problem(data, res) {
    res.redirect('/problem/' + data[0].id);
}

/* Add new problem */
router.post('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    if (!is_admin(req.cookies['user'])) {
        res.redirect('/');
        return;
    }

    var name = req.body.name;
    var time = req.body.time;
    var memory = req.body.memo;
    var description = req.body.description;
    var num_cases = req.body.num_sample;
    var username = get_username(req.cookies['user']);

    var filtered_name = filter(name);
    var filtered_time = filter(time);
    var filtered_memory = filter(memory);
    var filtered_description = filter(description);

    var cases = {};
    var filtered_cases = {};
    for (var index = 1; index <= num_cases; ++index) {
        cases[index] = {};
        filtered_cases[index] = {};
        cases[index]['input'] = req.body['input_sample_' + index];
        cases[index]['output'] = req.body['output_sample_' + index];
        filtered_cases[index]['input'] = filter(cases[index]['input']);
        filtered_cases[index]['output'] = filter(cases[index]['output']);
    }

    database.add_problem(filtered_name, filtered_time, filtered_memory, filtered_description, username);
    database.add_sample(filtered_cases);

    database.get_last_problem(display_last_problem, res);
});

module.exports = router;
