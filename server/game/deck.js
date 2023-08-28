const { cards } = require('./cards');
const DrawCard = require('./drawcard.js');
const ProvinceCard = require('./provincecard.js');
const { StrongholdCard } = require('./StrongholdCard.js');
const { RoleCard } = require('./RoleCard');
const { Locations, CardTypes } = require('./Constants');
const { GameModes } = require('../GameModes');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            faction: {},
            conflictCards: [],
            dynastyCards: [],
            provinceCards: [],
            outOfPlayCards: [],
            stronghold: undefined,
            role: undefined
        };

        //faction
        result.faction = this.data.faction;

        //conflict
        this.eachRepeatedCard(this.data.conflictCards, cardData => {
            if(cardData && ['conflict'].includes(cardData.side)) {
                var conflictCard = this.createCard(DrawCard, player, cardData);
                conflictCard.location = Locations.ConflictDeck;
                result.conflictCards.push(conflictCard);
            }
        });

        //dynasty
        this.eachRepeatedCard(this.data.dynastyCards, cardData => {
            if(cardData && ['dynasty'].includes(cardData.side)) {
                var dynastyCard = this.createCard(DrawCard, player, cardData);
                dynastyCard.location = Locations.DynastyDeck;
                result.dynastyCards.push(dynastyCard);
            }
        });

        //provinces
        if(player.game.gameMode !== GameModes.Skirmish) {
            this.eachRepeatedCard(this.data.provinceCards, cardData => {
                if(cardData && cardData.type === CardTypes.Province) {
                    var provinceCard = this.createCard(ProvinceCard, player, cardData);
                    provinceCard.location = Locations.ProvinceDeck;
                    result.provinceCards.push(provinceCard);
                }
            });
        } else {
            for(let i = 0; i < 3; i++) {
                var provinceCard = new ProvinceCard(player, this.getSkirmishProvinceCardData(i));
                provinceCard.location = Locations.ProvinceDeck;
                result.provinceCards.push(provinceCard);
            }
        }

        //stronghold & role
        if(player.game.gameMode !== GameModes.Skirmish) {
            this.eachRepeatedCard(this.data.stronghold, cardData => {
                if(cardData && cardData.type === CardTypes.Stronghold) {
                    var strongholdCard = this.createCard(StrongholdCard, player, cardData);
                    strongholdCard.location = '';
                    result.stronghold = strongholdCard;
                }
            });
            this.eachRepeatedCard(this.data.role, cardData => {
                if(cardData && cardData.type === CardTypes.Role) {
                    var roleCard = this.createCard(RoleCard, player, cardData);
                    result.role = roleCard;
                }
            });
        }

        const shadowlandsNonUniques = [];
        if(this.data.outsideTheGameCards) {
            this.data.outsideTheGameCards.forEach(cardData => {
                let card = this.createCard(DrawCard, player, cardData);
                card.location = Locations.OutsideTheGame;
                shadowlandsNonUniques.push(card);
            });
        }

        result.outsideTheGameCards = shadowlandsNonUniques;
        result.allCards = result.provinceCards.concat(result.conflictCards).concat(result.dynastyCards);

        if(result.stronghold) {
            result.allCards.push(result.stronghold);
        }

        if(result.role) {
            result.allCards.push(result.role);
        }

        return result;
    }

    getSkirmishProvinceCardData(provinceNumber) {
        return { strength: 3, element: [], type: 'province', side: 'province', name: 'Skirmish Province', id: 'skirmish-province-' + provinceNumber };
    }

    eachRepeatedCard(cards, func) {
        if(!cards) {
            return;
        }
        for(const cardEntry of cards) {
            for(let i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        }
    }

    createCard(baseClass, player, cardData) {
        const CardConstructor = cards.get(cardData.id) || baseClass;
        return new CardConstructor(player, cardData);
    }
}

module.exports = Deck;
