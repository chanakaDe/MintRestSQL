/**
 * Created by chanaka on 7/22/16.
 */
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var db = require('../util/database');
var secretKey = config.secretKey;
var pool = db.getPool();

module.exports = function (app, express) {
    var api = express.Router();

    api.use(function (req, res, next) {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({type: "failed", code: 403, data: false, message: "FAILED_TO_AUTHENTICATE"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({type: "failed", code: 403, data: false, message: "NO_VALID_TOKEN_PROVIDED"});
        }
    });

    api.get('/customer/:limit/:offset', function (req, res) {

        var limit = parseInt(req.params.limit);
        var offset = parseInt(req.params.offset);
        var query = 'select * from customer limit ' + limit + ' offset ' + offset + ' ';
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
            });
        });
    });

    api.post('/customer', function (req, res) {

        var customer = {
            id: 0,
            name: req.body.name,
            address: req.body.address,
            telephone: req.body.telephone,
            fax: req.body.fax,
            email: req.body.email,
            remark: req.body.remark,
            status: req.body.status
        };
        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO customer SET ?', customer, function (err, result) {
                res.json({type: "success", code: 200, data: result});
                connection.release();
            });
        });
    });

    api.put('/customer', function (req, res) {

        var customer = {
            id: req.body.id,
            name: req.body.name,
            address: req.body.address,
            telephone: req.body.telephone,
            fax: req.body.fax,
            email: req.body.email,
            remark: req.body.remark,
            status: req.body.status
        };
        pool.getConnection(function (err, connection) {
            connection.query('UPDATE customer SET name = ?,address = ?,telephone = ?,fax = ?,email = ?,remark = ?,status = ? WHERE id = ?',
                [customer.name, customer.address, customer.telephone, customer.fax, customer.email, customer.remark, customer.status, customer.id], function (err, result) {
                    res.json({type: "success", code: 200, data: result});
                    connection.release();
                });
        });
    });

    api.get('/customer/:id', function (req, res) {

        var id = parseInt(req.params.id);
        var query = 'select * from customer where id = ' + id + '';
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
            });
        });
    });

    return api;
};
