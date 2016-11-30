/**
 * Created by lanhoangdao on 11/28/16.
 */

var express = require('express');
var database = require('../database/database');
var password_hash = require('password-hash');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] != undefined) {
        res.render('index', {
            title: 'Home'
        });
        return;
    }

    res.render('create_account', {
        title: 'Create Account',
        failed: 0
    });
});

function check_exist_username(data, username, password, res) {
    if (data.length != 0) {
        res.render('create_account', {
            title: 'Create Account',
            failed: 1
        });
        return;
    }

    var hash = password_hash.generate(password);

    database.add_user(username, hash);

    var random_number = Math.random().toString();
    random_number = random_number.substring(2, random_number.length);
    var new_cookie = username + '**' + random_number;
    res.cookie('user', new_cookie, { expire: new Date() + (30 * 60 * 1000) });

    map_cookies[username] = new_cookie;

    res.render('index', {
        title: 'Home'
    });
}

/* Receive login info */
router.post('/', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    database.get_hash_user(check_exist_username, username, password, res);
});

module.exports = router;