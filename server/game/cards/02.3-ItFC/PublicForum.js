const ProvinceCard = require('../../provincecard.js');

class PublicForum extends ProvinceCard {
    setupCardAbilities(ability) {
    }
}

PublicForum.id = 'public-forum'; // This is a guess at what the id might be - please check it!!!

module.exports = PublicForum;
