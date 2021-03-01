const express = require('express');
const cors = require('cors');
const path = require('path');
let settings = require('../../config/settings').returnVariables();
const fs = require ('fs');

// SWAGGER REQUIRES //
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = swaggerJSDoc(settings.options);

const bodyParser = require('body-parser');

let time = new Date();

// USE JSON BODY PARSING //
const route = (app, serverhttp) => {

    app.use(
        bodyParser.urlencoded({
        extended: true
        })
    )
    app.use(cors())
    app.use(express.json());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

}

module.exports = {
    route: route
}