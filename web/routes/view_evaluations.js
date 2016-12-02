/**
 * required modules
 */
var express = require('express');
var router = express.Router();
var db = require('../database/database').connection;
var multer = require('multer');
var common = require('../common');
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

/**
 * get request handler
 */
router.get('/', function(req, res, next) {
    // check if the user is an admin or not
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    if (!common.is_admin(req.cookies['user'])) {
        res.redirect('/');
        return;
    }

	db.query('CREATE TABLE IF NOT EXISTS packages(id TEXT, flow TEXT)', function(err, r) {
		if (err) throw err;
		db.query('SELECT * FROM packages', function(err, r) {
			if (err) throw err;
            // list all the evaluations
			var v = r.map(function (x) {
				return x.id;
			});
			res.render('view_evaluations', {
				arg: v
			});
		});
	});
});

module.exports = router;
