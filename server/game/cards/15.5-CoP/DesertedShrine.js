const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes } = require('../../Constants');

class DesertedShrine extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard the top 10 cards of a deck',
            when:{
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetModes.Select,
                targets: true,
                activePromptTitle: 'Choose a deck',
                choices: context => {
                    let choices = {};
                    if(context.player.dynastyDeck.size() > 0) {
                        choices[`${context.player.name}'s Dynasty`] = AbilityDsl.actions.discardCard(context => ({ target: context.player.dynastyDeck.first(10) }));
                    }
                    if(context.player.conflictDeck.size() > 0) {
                        choices[`${context.player.name}'s Conflict`] = AbilityDsl.actions.discardCard(context => ({ target: context.player.conflictDeck.first(10) }));
                    }
                    if(context.player.opponent) {
                        if(context.player.opponent.dynastyDeck.size() > 0) {
                            choices[`${context.player.opponent.name}'s Dynasty`] = AbilityDsl.actions.discardCard(context => ({ target: context.player.opponent.dynastyDeck.first(10) }));
                        }
                        if(context.player.opponent.conflictDeck.size() > 0) {
                            choices[`${context.player.opponent.name}'s Conflict`] = AbilityDsl.actions.discardCard(context => ({ target: context.player.opponent.conflictDeck.first(10) }));
                        }
                    }

                    return choices;
                }
            },
            effect: 'discard the top 10 cards of {1} deck',
            effectArgs: context => [context.select]
        });
    }

    getCards(deck) {
        return deck && deck.size() > 0 ? deck.first(10) : [];
    }

    getChoiceName(key) {
        if(key === 'MyDynasty') {
            return `${this.owner.name}'s Dynasty`;
        }
        if(key === 'MyConflict') {
            return `${this.owner.name}'s Conflict`;
        }
        if(this.owner.opponent) {
            if(key === 'OppDynasty') {
                return `${this.owner.opponent.name}'s Dynasty`;
            }
            if(key === 'OppConflict') {
                return `${this.owner.opponent.name}'s Conflict`;
            }
        }

        return 'N/A';
    }
}

DesertedShrine.id = 'deserted-shrine';

module.exports = DesertedShrine;
