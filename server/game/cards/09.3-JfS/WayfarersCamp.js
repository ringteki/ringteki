const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations, Players, PlayTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class WayfarersCamp extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play two characters',
            effect: 'play two cards from their provinces',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to play',
                    cardType: CardTypes.Character,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.playCard({ resetOnCancel: true, source: this, playType: PlayTypes.PlayFromProvince })
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to play',
                    cardType: CardTypes.Character,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.playCard({ resetOnCancel: true, source: this, playType: PlayTypes.PlayFromProvince })
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to turn faceup',
                    location: Locations.Provinces,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.flipDynasty(),
                    message: '{0} turns {1} faceup',
                    messageArgs: (card, player) => [player, card]
                })
            ])
        });
    }
}

WayfarersCamp.id = 'wayfarer-s-camp';

module.exports = WayfarersCamp;
