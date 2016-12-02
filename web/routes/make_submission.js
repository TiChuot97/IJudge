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
var child = require('child_process');
var util = require('util');

/**
 * handler for the get request, renders the make_submission page
 */
router.get('/', function(req, res, next) {
    //redirect the user to the home page if not logged in
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    // render the page
    // if a problem id is specified, fill the blank automatically
    var id = req.query.id || "";
    res.render('make_submission', {arg_id: id});
});

/**
 * Adds a new record (submission) in the database.
 * @param id the id of the evaluation
 * @param content the user input
 * @param result the result of the evaluation
 * @param user the user who made the submission
 */
function new_entry(id, content, result, user) {
    db.query('CREATE TABLE IF NOT EXISTS submissions(id BIGINT NOT NULL AUTO_INCREMENT, problem TEXT, content TEXT, result TEXT, user TEXT, PRIMARY KEY (id))', function(err, r) {
        if (err) throw err;
        db.query('INSERT INTO submissions (problem, content, result, user) value (?, ?, ?, ?)', [id, content, result, user], function(err, r) {
            if (err) throw err;
        });
    });
}

/**
 * handler for the post request, issues new evaluations
 */
router.post('/', function(req, res, next) {
    // check the identity of the user
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    // not-that-comprehensive sanity check
    // should be fortified later
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

            // delete the runtime and data folder
            // data is used to store the file system the problem setter uploaded
            // runtime is where the user's input will be evaluate
            child.execSync("rm -rf runtime data", { cwd: path.join('.', 'eval') });
            child.execSync("mkdir runtime data", { cwd: path.join('.', 'eval') });

            // unpack the user uploaded package
            var z = path.join('.', 'packages', id + '.zip');
            if (fs.existsSync(z)) {
                var zs = util.format("unzip ./packages/%s.zip -d ./eval/data", id);
                child.execSync(zs);
            }

            // run the flowchart interpreter
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