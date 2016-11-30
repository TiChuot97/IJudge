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
        res.redirect('/');
        return;
    }

    res.render('login', {
        title: 'Login',
        failed: 0
    });
});

function login(data, username, password, res) {
    if (data.length == 0) {
        res.render('login', {
            title: 'Login',
            failed: 1
        });
        return;
    }

    var hash = data[0].hash;

    if (!password_hash.verify(password, hash)) {
        res.render('login', {
            title: 'Login',
            failed: 1
        });
        return;
    }

    var admin = data[0].admin;
    var random_number = Math.random().toString();
    random_number = random_number.substring(2, random_number.length);
    var new_cookie = username + '**' + admin +  random_number;
    res.cookie('user', new_cookie, { maxAge: 300 * 60 * 1000 });

    map_cookies[username] = new_cookie;

    res.redirect('/');
}

/* Receive login info */
router.post('/', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    database.get_hash_user(login, username, password, res);
});

module.exports = router;