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
    findPerson: function(path) {
        return {
            name: 'name',
            height: 'height',
            weight: 'weight',
            gender: 'gender',
            skinColour: 'skin_colour',
            eyeColour: 'eye_colour',
            hairColour: 'hair_colour'
        }
    },
    findPlanet: function(path) {
        return {
            name: 'name',
            population: 'population',
            orbitalPeriod: 'orbital_period',
            rotationPeriod: 'rotation_period'
        }
    },
    findSpecies: function(path) {
        return {
            name: 'name',
            height: 'height',
            lifespan: 'lifespan',
            classification: 'classification',
            language: 'language'
        }
    },

};
