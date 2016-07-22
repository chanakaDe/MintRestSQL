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

    api.get('/item/:limit/:offset', function (req, res) {

        var limit = parseInt(req.params.limit);
        var offset = parseInt(req.params.offset);
        var query = 'select * from item limit ' + limit + ' offset ' + offset + ' ';
        pool.getConnection(function (err, connection) {
            connection.query(query, function (err, rows) {
                res.json({type: "success", code: 200, data: rows});
                connection.release();
            });
        });
    });

    api.post('/item', function (req, res) {

        var item = {
            id: 0,
            part_no: req.body.part_no,
            stamp_no: req.body.stamp_no,
            description: req.body.description,
            stock_in_hand: req.body.stock_in_hand,
            reorder_level: req.body.reorder_level,
            selling_price: req.body.selling_price,
            mesurment: req.body.mesurment,
            bin_card_no: req.body.bin_card_no,
            location: req.body.location,
            cost_price: req.body.cost_price
        };
        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO item SET ?', item, function (err, result) {
                res.json({type: "success", code: 200, data: result});
                connection.release();
            });
        });
    });

    api.put('/supplier', function (req, res) {

        var supplier = {
            id: req.body.id,
            part_no: req.body.part_no,
            stamp_no: req.body.stamp_no,
            description: req.body.description,
            stock_in_hand: req.body.stock_in_hand,
            reorder_level: req.body.reorder_level,
            selling_price: req.body.selling_price,
            mesurment: req.body.mesurment,
            bin_card_no: req.body.bin_card_no,
            location: req.body.location,
            cost_price: req.body.cost_price
        };
        pool.getConnection(function (err, connection) {
            connection.query('UPDATE item SET name = ?,address = ?,telephone = ?,contact_person = ?,fax = ?,email = ?,remark = ? WHERE id = ?',
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
