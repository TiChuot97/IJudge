var express = require('express');
var router = express.Router();
var db = require('../database/database').connection;
var multer = require('multer');
var common = require('../common');
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
var child = require('child_process');
var util = require('util');

router.get('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    console.log(req.query);

    var id = req.query.id || "";
    console.log(id);
    res.render('make_submission', {arg_id: id});
});

function new_entry(id, content, result, user) {
    db.query('CREATE TABLE IF NOT EXISTS submissions(id BIGINT NOT NULL AUTO_INCREMENT, problem TEXT, content TEXT, result TEXT, user TEXT, PRIMARY KEY (id))', function(err, r) {
        if (err) throw err;
        db.query('INSERT INTO submissions (problem, content, result, user) value (?, ?, ?, ?)', [id, content, result, user], function(err, r) {
            if (err) throw err;
        });
    });
}


router.post('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    var user = common.get_username(req.cookies['user']);

    var id = req.body.id;
    var content = req.body.content;
    if (!id || id == "" || !content || content == "") {
        res.redirect('/');
        return;
    }
    db.query('SELECT * FROM packages WHERE id = ?', [id], function(err, r) {
        if (err) throw err;
        if (r.length > 0) {
            var fl = JSON.parse(r[0].flow);
            fl.input = content;

            child.execSync("rm -rf runtime data", { cwd: path.join('.', 'eval') });
            child.execSync("mkdir runtime data", { cwd: path.join('.', 'eval') });

            var z = path.join('.', 'packages', id + '.zip');
            if (fs.existsSync(z)) {
                var zs = util.format("unzip ./packages/%s.zip -d ./eval/data", id);
                child.execSync(zs);
            }

            var p = child.exec("python3 ../scripts/main.py", {
                cwd: path.join('.', 'eval/runtime')
            }, function (err, stdout, stderr) {
                if (err) {
                    new_entry(id, content, '(system error)', user);
                    res.redirect('/view_submissions');
                }
                else {
                    new_entry(id, content, stdout.toString(), user);
                    res.redirect('/view_submissions');
                }
            });
            p.stdin.write(JSON.stringify(fl));
            p.stdin.end();
        }
        else {
            new_entry(id, content, '(no such problem)', user);
            res.redirect('/');
        }
    });
});

module.exports = router;