const DrawCard = require('../../../drawcard.js');
const { CardTypes, Durations, EventNames, Locations, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar.js');

class CeremonialRobes extends DrawCard {
    setupCardAbilities() {
        this.declaredDefenders = [];
        this.movedToDefend = [];

        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnDefendersDeclared, EventNames.OnMoveToConflict, EventNames.OnPhaseEnded, EventNames.OnPhaseStarted]);

        this.action({
            title: 'Ready your stronghold',
            condition: context => context.player.stronghold && this.declaredDefenders.includes(context.source) || this.movedToDefend.includes(context.source),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready(context => ({
                    target: context.player.stronghold
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.player.stronghold,
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.increaseLimitOnAbilities()
                }))
            ]),
            effect: 'ready {1} and add an additional use to each of its abilities',
            effectArgs: context => [context.player.stronghold]
        });

        this.forcedReaction({
            title: 'Blank and reveal a province',
            when: {
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source)
            },
            target: {
                activePromptTitle: 'Choose a province to blank',
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                controller: Players.Self,
                cardCondition: card => !card.isBroken,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonorProvince(),
                    AbilityDsl.actions.reveal({ chatMessage: true })
                ])
            }
        });
    }

    onDefendersDeclared(event) {
        if(event.defenders) {
            this.declaredDefenders.push(...event.defenders);
        }
    }

    onMoveToConflict(event) {
        if(event.card.type === CardTypes.Character && event.card.isDefending()) {
            this.movedToDefend.push(event.card);
        }
    }

    onPhaseEnded() {
        this.declaredDefenders = [];
        this.movedToDefend = [];
    }

    onPhaseStarted() {
        this.declaredDefenders = [];
        this.movedToDefend = [];
    }
}

CeremonialRobes.id = 'ceremonial-robes';

module.exports = CeremonialRobes;
