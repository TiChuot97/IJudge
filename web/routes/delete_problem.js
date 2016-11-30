/**
 * Created by lanhoangdao on 11/30/16.
 */

var express = require('express');
var router = express.Router();
var database = require('../database/database');

/* Delete a problem. */
router.post('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    var id = req.body.id;
    database.delete_problem(id);

    res.redirect('/');
});

module.exports = router;
