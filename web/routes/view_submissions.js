var express = require('express');
var router = express.Router();
var db = require('../database/database').connection;
var multer = require('multer');
var common = require('../common');
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    db.query('SELECT * FROM submissions', function(err, r) {
        if (err) throw err;
        var v = r.sort(function (a, b) {
            if (a.id != b.id)
                return a.id < b.id ? 1 : -1;
            return 0;
        });
        res.render('view_submissions', {
            arg: v
        })
    })
});

router.get('/:which', function (req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    var id = req.params.which;

    db.query('SELECT * FROM submissions WHERE id = ?', [id], function(err, r) {
        console.log(r);
        if (r.length > 0) {
            var v = r[0];
            res.render('view_single_submission', { arg_content: v.content, arg_result: v.result });
        }
        else
            res.redirect('/');
    });
});

module.exports = router;