/**
 * Created by lanhoangdao on 11/16/16.
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

    var cases = {};
    for (var index = 0; index < sample.length; ++index) {
        cases[index + 1] = {};
        cases[index + 1]['input'] = sample[index].input;
        cases[index + 1]['output'] = sample[index].output;
    }

    res.render('problem', {
        title: name,
        id: id,
        name: name,
        time: time,
        memory: memory,
        description: description,
        sample: cases,
        author: author
    });
}

/* GET problem by id page. */
router.get('/:id', function(req, res, next) {
    check_cookie(req, res);

    var id = req.params.id;
    database.get_problem(id, display_page, res);
});

module.exports = router;
