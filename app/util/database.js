var mysql = require('mysql');
var pool;
module.exports = {
    getPool: function () {
        if (pool) return pool;
        pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'chanaka',
            database: 'shared_adult'
        });
        return pool;
    }
};