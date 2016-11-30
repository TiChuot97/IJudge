/**
 * Created by lanhoangdao on 11/16/16.
 */

var express = require('express');
var router = express.Router();
var database = require('../database/database');
var MAX_PAGE = 50;

function display_problem_list(data, res, num_page) {
    var total_page = Math.floor(data.length / MAX_PAGE);
    if (data.length % MAX_PAGE != 0)
        ++total_page;

    var problems = {};

    num_page = Math.min(num_page, total_page);
    num_page = Math.max(num_page, 1);

    var l = (num_page - 1) * MAX_PAGE;
    var r = Math.min(l + MAX_PAGE, data.length);

    for (var index = l; index < r; ++index) {
        var id = data[index].id;
        var name = data[index].name;
        problems[id] = { 'id': id, 'name': name };
    }

    var next_page = 0;
    if (num_page != total_page && total_page != 0)
        next_page = num_page + 1;

    var prev_page = num_page - 1;

    res.render('problem_list', {
        title: 'List all problems',
        problems: problems,
        page: num_page,
        next: next_page,
        prev: prev_page
    });
}

/* GET problem list page. */
router.get('/page/:num', function(req, res, next) {
    check_cookie(req, res);

    var num_page = req.params.num;
    database.get_all_problem(display_problem_list, res, num_page);
});

module.exports = router;
