var express = require('express');
var router = express.Router();
var db = require('../database/database').connection;
var multer = require('multer');
var common = require('../common');
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

router.get('/:which', function(req, res, next) {
    check_cookie(req, res);

    if (req.cookies['user'] == undefined) {
        res.redirect('/login');
        return;
    }

    if (!common.is_admin(req.cookies['user'])) {
        res.redirect('/');
        return;
    }

    var id = req.params.which;
    db.query('DELETE FROM packages WHERE id = ?', [id], function(err, r) {
        if (err) throw err;
        var p = path.join('./packages', id + '.zip');
        if (fs.existsSync(p))
            fs.unlinkSync(p);
        res.redirect('/view_evaluations');
    })
});

module.exports = router;