var express = require('express');
var router = express.Router();
var database = require('../database/database');

router.get('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }


    res.render('edit_evaluation', {
        title: 'Edit Evaluation'
    });
});

router.post('/', function(req, res, next) {
    console.log(req);
});

module.exports = router;