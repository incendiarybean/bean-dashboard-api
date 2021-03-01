const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

require('dotenv').config();

let config_yaml = fs.readFileSync(path.join(__dirname, '../api/swagger/converter/swagger.yaml'));

const getSetVariables = () => {
    return new Promise((resolve, reject) => {
        console.log('Building YAML from ENV variables...');
        config_yaml = config_yaml.toString().replace(/{HOSTNAME}/g, process.env.HOSTNAME);
        fs.writeFileSync(path.join(__dirname, '../api/swagger/swagger.yaml'), config_yaml, (err) => {
            if(err) throw(err);
            console.log('File saved successfully.');
        });
        return resolve("Proceeding.");
    });
}

const returnVariables = async () => {
    return getSetVariables().then((data) => {

        console.log('Build process complete.');

    }).catch(e => {
        console.log(e)
        console.log('Could not complete the YAML build process.');
    });
}

returnVariables();

