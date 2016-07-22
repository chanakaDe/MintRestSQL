/**
 * Created by chanaka on 7/22/16.
 */
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var db = require('../util/database');
var secretKey = config.secretKey;
var pool = db.getPool();

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level
    }, secretKey, {
        expirtsInMinute: 1440
    });
    return token;
}

module.exports = function (app, express) {
    var api = express.Router();

    api.get('/user', function (req, res) {
        var query = 'select id,username,email,level,description from user';
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
            });
        });
    });

    api.post('/user', function (req, res) {
        var user = {
            id: 0,
            username: req.body.username,
            email: req.body.email,
            level: req.body.level,
            description: req.body.description,
            password: req.body.password
        };
        bcrypt.hash(user.password, null, null, function (err, hash) {
            user.password = hash;
        });
        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO user SET ?', user, function (err, result) {
                res.json({type: "success", code: 200, data: result});
                connection.release();
            });
        });
    });

    api.post('/login', function (req, res) {
        var user = {
            username: req.body.username,
            password: req.body.password
        };
        pool.getConnection(function (err, connection) {
            connection.query('SELECT id,username,email,level,password from user where username = ?', [user.username], function (err, result) {
                if (result == '') {
                    res.json({type: "error", code: 403, data: false});
                    return
                } else {
                    bcrypt.compare(user.password, result[0].password, function (err, status) {
                        if (status == true) {
                            var token = createToken({
                                id: result[0].id,
                                username: result[0].username,
                                email: result[0].email,
                                level: result[0].level
                            });
                            res.json({type: "success", code: 200, data: status, token: token});
                        } else {
                            res.json({type: "error", code: 403, data: status});
                        }
                    });
                }
                connection.release();
            });
        });
    });

    api.put('/user', function (req, res) {
        var user = {
            id: req.body.id,
            username: req.body.username,
            email: req.body.email,
            level: req.body.level,
            description: req.body.desc
        };
        pool.getConnection(function (err, connection) {
            connection.query('UPDATE user SET username = ?,email = ?,level = ?,description = ? WHERE id = ?',
                [user.username, user.email, user.level, user.description, user.password, user.id], function (err, result) {
                    res.json({type: "success", code: 200, data: result});
                    connection.release();
                });
        });
    });

    api.get('/check_user/:username', function (req, res) {
        var username = req.params.username;
        var query = 'select * from user where username = ?';
        pool.getConnection(function (err, connection) {
            connection.query(query, [username], function (err, rows) {
                if (rows == '') {
                    res.json({type: "success", code: 200, data: true});
                } else {
                    res.json({type: "error", code: 403, data: false});
                }
                connection.release();
            });
        });
    });

    return api;
};
