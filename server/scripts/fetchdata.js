/*eslint no-console:0 */
const request = require('request');
const monk = require('monk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../services/CardService.js');
const PathToJSON = path.join(__dirname, '../../test/json/card');

function apiRequest(path) {
    const apiUrl = 'https://beta-emeralddb.herokuapp.com/api/';

    return new Promise((resolve, reject) => {
        request.get(apiUrl + path, function(error, res, body) {
            if(error) {
                return reject(error);
            }

            resolve(JSON.parse(body));
        });
    });
}

function fetchImage(url, id, imagePath, timeout) {
    setTimeout(function() {
        console.log('Downloading image for ' + id);
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

let db = monk('mongodb://127.0.0.1:27017/ringteki');
let cardService = new CardService(db);

let fetchCards = apiRequest('cards')
    .then(cards => cardService.replaceCards(cards))
    .then(cards => {
        console.info(cards.length + ' cards fetched');

        let imageDir = path.join(__dirname, '..', '..', 'public', 'img', 'cards');
        mkdirp(imageDir);
        mkdirp(PathToJSON);

        var i = 0;

        cards.forEach(function (card) {
            if(card.versions.length > 0) {
                var imagePath = path.join(imageDir, card.id + '.jpg');
                let firstCardWithImageUrl = card.versions.find(card => card.image_url);
                if(firstCardWithImageUrl) {
                    let imageSrc = firstCardWithImageUrl.image_url;
                    if(imageSrc && !fs.existsSync(imagePath)) {
                        fetchImage(imageSrc, card.id, imagePath, i++ * 200);
                    }
                }
            }
            const filePath = path.join(PathToJSON, `${card.id}.json`);
            fs.writeFile(filePath, JSON.stringify([card]), () => {});
            console.log(`Created file ${filePath}`);
        });

        return cards;
    })
    .catch(() => {
        console.error('Unable to fetch cards');
    });

let fetchPacks = apiRequest('packs')
    .then(packs => cardService.replacePacks(packs))
    .then(packs => {
        console.info(packs.length + ' packs fetched');
    })
    .catch(() => {
        console.error('Unable to fetch packs');
    });

Promise.all([fetchCards, fetchPacks])
    .then(() => db.close())
    .catch(() => db.close());

