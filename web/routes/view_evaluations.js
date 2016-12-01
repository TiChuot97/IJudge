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

    if (!common.is_admin(req.cookies['user'])) {
        res.redirect('/');
        return;
    }

    db.query('SELECT * FROM packages', function(err, r) {
        if (err) throw err;
        var v = r.map(function (x) {
            return x.id;
        });
        res.render('view_evaluations', {
            arg: v
        })
    })
});

module.exports = router;