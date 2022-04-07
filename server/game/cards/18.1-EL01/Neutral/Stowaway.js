const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, Players } = require('../../../Constants');

class Stowaway extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place a card underneath self',
            limit: AbilityDsl.limit.perRound(2),
            effect: 'place {0} beneath {1}',
            condition: context => context.source.isParticipating(),
            effectArgs: context => [context.source],
            target: {
                activePromptTitle: 'Choose a card',
                location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                player: Players.Any,
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        const card = context.target;
                        context.player.moveCard(card, this.uuid);
                        card.controller = context.source.controller;
                        card.facedown = false;
                        card.lastingEffect(() => ({
                            until: {
                                onCardMoved: event => event.card === card && event.originalLocation === this.uuid
                            },
                            match: card,
                            effect: [
                                AbilityDsl.effects.hideWhenFaceUp()
                            ]
                        }));
                    }
                })
            }
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(card => this.getSkillBonus(card))
        });
    }

    getSkillBonus(card) {
        return Math.min(2, card.game.allCards.filter(card => card.controller === this.controller && card.location === this.uuid).length);
    }
}

Stowaway.id = 'stowaway';

module.exports = Stowaway;
