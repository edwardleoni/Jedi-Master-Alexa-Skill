const request = require('request');

const SWAPI_URL = "https://swapi.co/api/";

module.exports = {
    performRequest: function(path) {
        return new Promise(function(resolve, reject) {
            const options = {
                uri: `${SWAPI_URL}/${path}`,
                json: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            request(options, function(err, res, body) {
                if (err) {
                    reject(err);
                }
                resolve(body);
            });
        });
    },

};
