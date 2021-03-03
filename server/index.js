'use strict';

// EXPRESS REQUIRES //
var SwaggerExpress = require('swagger-express-mw');
const bodyParser = require('body-parser');
const express = require('express');
var app = express();
let settings = require('../config/settings').returnVariables();
const fs = require('fs');
const cors = require('cors');

const routes = require('./routes/index.js').route;
const { Server } = require('http');

require('dotenv').config();

SwaggerExpress.create(settings.config, (err, swaggerExpress) => {
    if (err) { throw err; }

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(
        bodyParser.urlencoded({
        extended: true
        })
    )
    app.use(express.json());

    swaggerExpress.register(app);

    const serverhttp = require('https')
    .createServer({
        pfx: fs.readFileSync('./cert/certificate.pfx'),
        passphrase: process.env.PFX_KEY
    }, app)
    .listen(process.env.PORT || 10010, (err) => {
        if (err) throw err;
        console.debug(`${Date()} - Server has been initialised on PORT: ${ process.env.PORT || 10010 } `);
        console.debug(`${Date()} - Server has been initialised on HOSTNAME: ${ process.env.HOSTNAME || "localhost" } `);
    });

    routes(app, serverhttp);

});