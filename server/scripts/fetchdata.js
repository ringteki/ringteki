/*eslint no-console:0 */
const { default: axios } = require('axios');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const PathToJSON = path.join(__dirname, '../../test/json/Card');

function apiRequest(path) {
    // const apiUrl = 'https://beta-emeralddb.herokuapp.com/api/';
    const apiUrl = 'https://www.emeralddb.org/api/';
    return axios.get(apiUrl + path).then(res=>res.data);
}

let fetchCards = apiRequest('cards')
    .then(cards => {
        console.log(cards.length + ' cards fetched');
        mkdirp.sync(PathToJSON);
        cards.forEach(function (card) {
            const filePath = path.join(PathToJSON, `${card.id}.json`);
            fs.writeFile(filePath, JSON.stringify([card]), (err) => {
                if(err) {
                    console.log(`write error for ${filePath}`, err);
                }
            });
        });

        return cards;
    })
    .catch(() => {
        console.log('Unable to fetch cards');
    });

Promise.all([fetchCards])
    .then(() => console.log('fetched successfully'))
    .catch(() => console.log('error fetching'));

