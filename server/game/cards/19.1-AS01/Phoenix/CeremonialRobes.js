const DrawCard = require('../../../drawcard.js');
const { CardTypes, Durations, Locations, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class CeremonialRobes extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready your stronghold',
            condition: context => !!context.player.stronghold,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready(context => ({
                    target: context.player.stronghold
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.player.stronghold,
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.increaseLimitOnAbilities({
                        applyingPlayer: context.player
                    })
                }))
            ]),
            anyPlayer: true,
            effect: 'ready {1} and add an additional use to each of its abilities',
            effectArgs: context => [context.player.stronghold]
        });

        this.forcedReaction({
            title: 'Blank and reveal provinces',
            when: {
                onCardAbilityInitiated: (event, context) => event.card === context.source
            },
            targets: {
                myProvince: {
                    activePromptTitle: 'Choose a province to blank',
                    cardType: CardTypes.Province,
                    controller: Players.Self,
                    location: Locations.Provinces,
                    cardCondition: card => !card.isBroken && !card.isDishonored,
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.dishonorProvince(),
                        AbilityDsl.actions.reveal({ chatMessage: true })
                    ])
                },
                oppProvince: {
                    activePromptTitle: 'Choose a province to blank',
                    player: Players.Opponent,
                    controller: Players.Opponent,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: card => !card.isBroken && !card.isDishonored,
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.dishonorProvince(),
                        AbilityDsl.actions.reveal({ chatMessage: true })
                    ])
                }
            },
            effect: 'place a dishonored status token on {1} and {2}, blanking them',
            effectArgs: context => [context.targets.myProvince, context.targets.oppProvince]
        });
    }
}

CeremonialRobes.id = 'ceremonial-robes';

module.exports = CeremonialRobes;
