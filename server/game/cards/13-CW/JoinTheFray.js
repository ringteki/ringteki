const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class JoinTheFray extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put a character into play from a province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('cavalry')
                },
                select: {
                    dependsOn: 'character',
                    mode: TargetModes.Select,
                    activePromptTitle: 'Which side should this character be on?',
                    choices: {
                        'Mine': AbilityDsl.actions.putIntoConflict(context => ({ side: Players.Self, target: context.targets.character })),
                        'My Opponent\'s': AbilityDsl.actions.putIntoConflict(context => ({ side: Players.Opponent, target: context.targets.character }))
                    }
                }
            },
            effect: 'have {1} join the conflict for {2}!',
            effectArgs: context => [context.targets.character, this.getEffectArg(context, context.selects.select.choice)]
        });
    }

    getEffectArg(context, selection) {
        if(selection === 'Mine') {
            return context.player;
        }
        return context.player.opponent;
    }
}

JoinTheFray.id = 'join-the-fray';

module.exports = JoinTheFray;
