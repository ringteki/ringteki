/*eslint no-console:0 */
const request = require('request');
const monk = require('monk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../services/CardService.js');
const PathToJSON = path.join(__dirname, '../../test/json/Card');

function apiRequest(path) {
    const apiUrl = 'https://www.emeralddb.org/api/';
    return new Promise((resolve, reject) => {
        request.get(apiUrl + path, function(error, res, body) {
            if(error) {
                return reject(error);
            }

            const result = JSON.parse(body);
            resolve(result);
        });
    });
}

function fetchImage(url, id, imagePath, timeout) {
    setTimeout(function() {
        console.log('Downloading image for ' + id);
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

let fetchCards = apiRequest('cards')
    .then(cards => {
        console.log(cards.length + ' cards fetched');
        console.log(`making ${PathToJSON}`);
        mkdirp(PathToJSON);
        console.log('made path to json');

        var i = 0;

        cards.forEach(function (card) {
            const filePath = path.join(PathToJSON, `${card.id}.json`);
            fs.writeFile(filePath, JSON.stringify([card]), () => {});
            console.log(`Created file ${filePath}`);
        });

        return cards;
    })
    .catch(() => {
        console.log('Unable to fetch cards');
    });

Promise.all([fetchCards])
    .then(() => console.log('fetched'))
    .catch(() => console.log('error fetching'))

