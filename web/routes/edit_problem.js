/**
 * Created by lanhoangdao on 11/30/16.
 */

var express = require('express');
var router = express.Router();
var database = require('../database/database');

function display_page(data, sample, res) {
    var id = data[0].id;
    var name = data[0].name;
    var time = data[0].time;
    var memory = data[0].memory;
    var description = data[0].description;
    var author = data[0].author;

    if (author != get_username(res.req.cookies['user'])) {
        res.redirect('/');
        return;
    }

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

    console.log(id);

    database.get_problem(id, display_page, res);
});

function filter(sample) {
    sample = sample.replace(/(?:\r\n|\r|\n)/g, '&#br;');
    sample = sample.replace(/\'/g, '&#39;');
    sample = sample.replace(/\"/g, '&#34;');
    console.log(sample);
    return sample;
}

router.post('/:id', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
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

    var id = req.params.id;

    database.edit_problem(id, filtered_name, filtered_time, filtered_memory, filtered_description);
    database.edit_sample(id, cases);

    res.redirect('/problem/' + id);
});

module.exports = router;
