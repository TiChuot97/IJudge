/**
 * Created by lanhoangdao on 11/30/16.
 */

var express = require('express');
var router = express.Router();
var database = require('../database/database');

function display_page(data, sample, res) {
    if (author != get_username(res.cookies['user'])) {
        res.redirect('/login');
        return;
    }

    var id = data[0].id;
    var name = data[0].name;
    var time = data[0].time;
    var memory = data[0].memory;
    var description = data[0].description;
    var author = data[0].author;

    var cases = {};
    for (var index = 0; index < sample.length; ++index) {
        cases[index + 1] = {};
        cases[index + 1]['input'] = sample[index].input;
        cases[index + 1]['output'] = sample[index].output;
    }

    res.render('edit_problem', {
        title: name,
        id: id,
        name: name,
        time: time,
        memory: memory,
        description: description,
        sample: JSON.stringify(cases),
        author: author
    });
}

/* GET problem editing page. */
router.get('/:id', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    var id = req.params.id;

    database.get_problem(id, display_page, res);
});

router.post('/:id', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    var id = req.params.id;
    var name = req.body.name;
    var time = req.body.time;
    var memory = req.body.memo;
    var description = req.body.description;
    var num_cases = req.body.num_sample;

    var cases = {};
    for (var index = 1; index <= num_cases; ++index) {
        cases[index] = {};
        cases[index]['input'] = req.body['input_sample_' + index];
        cases[index]['output'] = req.body['output_sample_' + index];
    }

    var id = req.params.id;

    database.edit_problem(id, name, time, memory, description);
    database.edit_sample(id, cases);

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
