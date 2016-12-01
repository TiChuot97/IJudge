/**
 * Created by lanhoangdao on 11/29/16.
 */

var express = require('express');
var database = require('../database/database');
var router = express.Router();

function get_username(cookie) {
    var pos = cookie.indexOf('**');
    return cookie.substring(0, pos);
}

/* GET login page. */
router.get('/', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/');
        return;
    }

    var username = get_username(req.cookies['user']);
    delete map_cookies[username];
    res.clearCookie('user');
    
    res.redirect('/');
});

module.exports = router;