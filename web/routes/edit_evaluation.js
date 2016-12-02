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

    var id = req.query.id || "";
    if (id != "")
		db.query('CREATE TABLE IF NOT EXISTS packages(id TEXT, flow TEXT)', function(err, r) {
			if (err) throw err;
			db.query('SELECT flow FROM packages WHERE id = ?', [id], function(err, r) {
				if (err) throw err;
				if (r.length > 0) {
					console.log(r[0].flow);
					res.render('edit_evaluation', {
						title: 'Edit Evaluation',
						arg_flow: r[0].flow,
						arg_id: id
					});
				}
				else
					res.redirect('/');
			});
		});
    else
        res.render('edit_evaluation', {
            title: 'Add Evaluation'
        });
});

var upload = multer({dest: './uploads'});

router.post('/', upload.any(), function(req, res, next) {
    check_cookie(req, res);



    if (req.cookies['user'] == undefined || !common.is_admin(req.cookies['user'])) {
        res.redirect('/');
        return;
    }

    db.query('CREATE TABLE IF NOT EXISTS packages(id TEXT, flow TEXT)', function(err, r) {
        if (err) throw err;
        var id = req.body.id, flow = req.body.flow;
        if (!id || !flow || id == "" || flow == "")
            return;
        db.query('DELETE FROM packages WHERE id = ?', [id], function (err, r) {
            if (err) throw err;
            db.query('INSERT INTO packages(id, flow) value (?, ?)', [id, flow], function (err, r) {
                if (err) throw err;
                var f = req.files;
                if (f.length > 0) {
                    f = f[0];
                    if (!fs.existsSync('packages'))
                        fs.mkdir('packages');
                    fs.createReadStream(path.join('.', f.path))
                        .pipe(fs.createWriteStream(path.join('./packages', id + '.zip')));
                }
                res.redirect('/view_evaluations');
            });
        });
    });

});

module.exports = router;
