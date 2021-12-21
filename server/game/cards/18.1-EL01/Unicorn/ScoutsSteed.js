const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Locations, PlayTypes, Durations } = require('../../../Constants');
const PlayCharacterAction = require('../../../playcharacteraction');

class ScoutsSteedPlayAction extends PlayCharacterAction {
    constructor(card) {
        super(card, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class ScoutsSteed extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.reaction({
            title: 'Pick a character to be able to play',
            when: {
                onConflictDeclared: (event, context) => context.source.parent && event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => context.source.parent && event.defenders.includes(context.source.parent),
                onMoveToConflict: (event, context) => context.source.parent && event.card === context.source.parent
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.target,
                        effect: AbilityDsl.effects.gainPlayAction(ScoutsSteedPlayAction),
                        duration: Durations.UntilPassPriority,
                        targetLocation: Locations.Provinces
                    })),
                    AbilityDsl.actions.playCard(context => ({
                        target: context.target,
                        source: this,
                        resetOnCancel: false
                    }))
                ])
            },
            effect: 'play {0} into the conflict'
        });
    }
}

ScoutsSteed.id = 'scout-s-steed';
module.exports = ScoutsSteed;
