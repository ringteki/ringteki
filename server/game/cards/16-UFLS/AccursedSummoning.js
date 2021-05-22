const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const OniOfObsidianAndBlood = require('../16-UFLS-Oni/OniOfObsidianAndBlood.js');

class AccursedSummoning extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Create an Oni',
            gameAction: AbilityDsl.actions.sequentialContext(context => {
                const outOfPlay = context.player.outsideTheGameCards;
                const oni = outOfPlay[9];
                const copy = new oni.constructor(context.player, oni.cardData);
                context.game.allCards.push(copy);
                return ({
                    gameActions: [
                        AbilityDsl.actions.putIntoPlay(() => ({
                            target: copy
                        }))
                    ]
                });                
            })
        });
    }
}

AccursedSummoning.id = 'accursed-summoning';

module.exports = AccursedSummoning;
