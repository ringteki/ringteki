const DrawCard = require('../../../drawcard.js');
const { Players, TargetModes, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class Kinki extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Remove a fate from or move home a character',
            cost: AbilityDsl.costs.sacrificeSelf(),
            condition: context => context.game.isDuringConflict('military') && context.source.parent && context.source.parent.isParticipating(),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: Players.Opponent,
                    choices: {
                        'Remove a fate from this character': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character })),
                        'Move this character home': AbilityDsl.actions.sendHome(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}

Kinki.id = 'kinki';

module.exports = Kinki;
