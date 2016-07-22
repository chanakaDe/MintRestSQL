/**
 * Created by chanaka on 7/22/16.
 */
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;
var db = require('../util/database');
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

    api.get('/supplier/:limit/:offset', function (req, res) {

        var limit = parseInt(req.params.limit);
        var offset = parseInt(req.params.offset);
        var query = 'select * from supplier limit ' + limit + ' offset ' + offset + ' ';
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
            });
        });
    });

    api.post('/supplier', function (req, res) {

        var supplier = {
            id: 0,
            name: req.body.name,
            address: req.body.address,
            telephone: req.body.telephone,
            contact_person: req.body.contact_person,
            fax: req.body.fax,
            email: req.body.email,
            remark: req.body.remark
        };
        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO supplier SET ?', supplier, function (err, result) {
                res.json({type: "success", code: 200, data: result});
                connection.release();
            });
        });
    });

    api.put('/supplier', function (req, res) {

        var supplier = {
            id: req.body.id,
            name: req.body.name,
            address: req.body.address,
            telephone: req.body.telephone,
            contact_person: req.body.contact_person,
            fax: req.body.fax,
            email: req.body.email,
            remark: req.body.remark
        };
        pool.getConnection(function (err, connection) {
            connection.query('UPDATE supplier SET name = ?,address = ?,telephone = ?,contact_person = ?,fax = ?,email = ?,remark = ? WHERE id = ?',
                [supplier.name, supplier.address, supplier.telephone, supplier.contact_person, supplier.fax, supplier.email, supplier.remark, supplier.id], function (err, result) {
                    res.json({type: "success", code: 200, data: result});
                    connection.release();
                });
        });
    });

    api.get('/supplier/:id', function (req, res) {

        var id = parseInt(req.params.id);
        var query = 'select * from supplier where id = ' + id + '';
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
            });
        });
    });

    return api;
};
