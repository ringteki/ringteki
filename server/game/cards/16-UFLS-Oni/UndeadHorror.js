const { Durations, CardTypes, AbilityTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class UndeadHorror extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Attach a character to this card',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating() && context.player.opponent && context.player.opponent.dynastyDiscardPile.filter(card => card.type === CardTypes.Character).length > 0;
                }
            },
            effect: 'attach a random character from {1}\'s dynasty discard pile to {2}',
            effectArgs: context => [context.player.opponent, context.source],
            gameAction: AbilityDsl.actions.sequentialContext(context => {
                const potentialTargets = context.player.opponent.dynastyDiscardPile.filter(card => card.type === CardTypes.Character);
                var j = Math.floor(Math.random() * (potentialTargets.length));
                const targetCard = potentialTargets[j];

                this.messageShown = false;
                return ({
                    gameActions: [
                        AbilityDsl.actions.cardLastingEffect({
                            target: targetCard,
                            canChangeZoneOnce: true,
                            duration: Durations.Custom,
                            effect: [
                                AbilityDsl.effects.blank(true),
                                AbilityDsl.effects.changeType(CardTypes.Attachment),
                                AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                                    match: (card, context) => card === context.source.parent,
                                    targetController: Players.Opponent,
                                    effect: [
                                        AbilityDsl.effects.modifyMilitarySkill((card, context) => context.source.printedMilitarySkill || 0),
                                        AbilityDsl.effects.modifyPoliticalSkill((card, context) => context.source.printedPoliticalSkill || 0)
                                    ]
                                })
                            ]
                        }),
                        AbilityDsl.actions.attach({
                            target: context.source,
                            attachment: targetCard
                        }),
                        AbilityDsl.actions.handler({
                            handler: (context) => {
                                if(!this.messageShown) { // for some reason, it shows the message twice
                                    context.game.addMessage('{0} is attached to {1}', targetCard, context.source);
                                }
                            }
                        })
                    ]
                });
            })
        });
    }
}

UndeadHorror.id = 'undead-horror';

module.exports = UndeadHorror;
