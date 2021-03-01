const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const returnVariables = () => {
    let config_yaml = yaml.load(fs.readFileSync(path.join(__dirname, '../api/swagger/swagger.yaml'), 'utf8'));
    const swaggerDefinition = config_yaml;

    return {
        config: {
            appRoot: path.join(__dirname, '..'),
            swaggerSecurityHandlers: {
                APIKeyHeader: function (req, authOrSecDef, scopesOrApiKey, cb) {
                    if ('swagger' === scopesOrApiKey) {
                        cb()
                    } else {
                        cb(new Error('Access forbidden, please provide valid API key'));
                    }
                }
            }
        },
        options: {
            swaggerDefinition,
            apis: ['./api/controllers/*.js'],
        }
    };
}

module.exports = {
    returnVariables: returnVariables
}