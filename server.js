var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var config = require("./config");
var cors = require('cors');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

var api = require('./app/routes/api')(app, express);
var report = require('./app/routes/report')(app, express);
var user = require('./app/routes/user')(app, express);
var supplier = require('./app/routes/supplier')(app, express);
var item = require('./app/routes/item')(app, express);
var customer = require('./app/routes/customer')(app, express);

app.use('/api', api);
app.use('/sys/report', report);
app.use('/api/user_manage', user);
app.use('/api/supplier_manage', supplier);
app.use('/api/item_manage', item);
app.use('/api/customer_manage', customer);

app.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("localhost:3000");
    }
});
