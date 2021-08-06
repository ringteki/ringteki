const StrongholdCard = require('../../../strongholdcard.js');
const EventRegistrar = require('../../../eventregistrar.js');
const { EventNames, Phases, CardTypes, AbilityTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class LadyDojisOutpost extends StrongholdCard {
    setupCardAbilities() {
        this.namedCard = undefined;
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([{
            [EventNames.OnInitiateAbilityEffects + ':' + AbilityTypes.OtherEffects]: 'onInitiateAbilityEffectsOtherEffects'
        }]);
        this.abilityRegistrar.register([
            EventNames.OnPhaseEnded
        ]);

        this.reaction({
            title: 'Honor a character',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.nameCard()
            ],
            gameAction: AbilityDsl.actions.handler({
                handler: context => {
                    this.namedCard = context.costs.nameCardCost;
                }
            }),
            effect: 'cancel the first ability triggered by {1} from a non-Stronghold card named {2}',
            effectArgs: context => [context.player.opponent, context.costs.nameCardCost]
        });
    }

    onInitiateAbilityEffectsOtherEffects(event) {
        if(!this.namedCard) {
            return;
        }
        if(event.context.player === this.controller.opponent && !event.cancelled && event.card.type !== CardTypes.Stronghold && event.card.name === this.namedCard) {
            event.cancel();
            this.namedCard = undefined;
            this.game.addMessage('{0} attempts to initiate {1}{2}, but {3} cancels it', event.context.player, event.card, event.card.type === CardTypes.Event ? '' : '\'s ability', this);
        }
    }

    onPhaseEnded() {
        this.namedCard = undefined;
    }
}

LadyDojisOutpost.id = 'lady-doji-s-outpost';

module.exports = LadyDojisOutpost;
