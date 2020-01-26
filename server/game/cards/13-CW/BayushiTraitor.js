const DrawCard = require('../../drawcard.js');
const { Locations, Players, EffectNames, EventNames, PlayTypes } = require('../../Constants');
const GameActions = require('../../GameActions/GameActions');
const PlayCharacterAction = require('../../playcharacteraction');
const AbilityDsl = require('../../abilitydsl');

class BayushiTraitorPlayAction extends PlayCharacterAction {
    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('playCharacter') ? ignoredRequirements : ignoredRequirements.concat('playCharacter');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }

    executeHandler(context) {
        const extraFate = context.source.sumEffects(EffectNames.GainExtraFateWhenPlayed);
        let cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: PlayTypes.PlayFromHand
        });
        context.game.addMessage('{0} plays {1} at {2}\'s home with {3} additional fate', context.player, context.source, context.player.opponent, context.chooseFate);
        context.game.openEventWindow([GameActions.putIntoPlay({ fate: context.chooseFate + extraFate, controller: Players.Opponent }).getEvent(context.source, context), cardPlayedEvent]);
    }
}

class BayushiTraitor extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            condition: context => context.player.opponent && context.source.controller !== context.source.owner,
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker(),
                AbilityDsl.effects.cannotParticipateAsDefender()
            ]
        });
        this.persistentEffect({
            location: Locations.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'playCharacter',
                restricts: 'source'
            })
        });

        this.persistentEffect({
            location: Locations.Any,
            targetLocation: Locations.Any,
            match: (card, context) => card === context.source,
            effect: AbilityDsl.effects.gainPlayAction(BayushiTraitorPlayAction)
        });
    }
}

BayushiTraitor.id = 'bayushi-traitor';

module.exports = BayushiTraitor;
