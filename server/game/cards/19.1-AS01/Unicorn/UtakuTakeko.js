const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, EventNames, Locations, Players, PlayTypes, TargetModes } = require('../../../Constants');
const DrawCard = require('../../../drawcard.js');
const EventRegistrar = require('../../../eventregistrar.js');
const PlayCharacterAction = require('../../../playcharacteraction.js');
const PlayDisguisedCharacterAction = require('../../../PlayDisguisedCharacterAction.js');

class UtakuTakekoPlayAction extends PlayCharacterAction {
    constructor(card) {
        super(card, false, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}
class UtakuTakekoPlayDisguisedAction extends PlayDisguisedCharacterAction {
    constructor(card) {
        super(card, false, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class UtakuTakeko extends DrawCard {
    setupCardAbilities() {
        this.charactersLeftPlayThisPhase = new Set();
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnPhaseStarted, EventNames.OnCardLeavesPlay]);

        this.action({
            title: 'Play character from your discard pile',
            target: {
                location: Locations.DynastyDiscardPile,
                mode: TargetModes.Single,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) =>
                    card.glory >= 1 &&
                    card.isFaction('unicorn') &&
                    !card.isUnique() &&
                    !this.charactersLeftPlayThisPhase.has(card.name),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.target,
                        effect: [
                            AbilityDsl.effects.gainPlayAction(UtakuTakekoPlayAction),
                            AbilityDsl.effects.gainPlayAction(UtakuTakekoPlayDisguisedAction)
                        ]
                    })),
                    AbilityDsl.actions.playCard((context) => ({
                        target: context.target
                    }))
                ])
            },
            effect: 'recall a {1} relative who is {2} {3}',
            effectArgs: (context) => [
                this._takekoDistanceMsg(context.target),
                this._takekoConnectiveForName(context.target),
                context.target
            ]
        });
    }

    _takekoDistanceMsg(card) {
        return card.hasTrait('gaijin') ? 'very distant' : 'distant';
    }

    _takekoConnectiveForName(card) {
        if(card.hasTrait('army')) {
            return 'in the';
        }

        switch(card.name[0]) {
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':
                return 'an';
            default:
                return 'a';
        }
    }

    onPhaseStarted() {
        this.charactersLeftPlayThisPhase.clear();
    }

    onCardLeavesPlay(event) {
        if(event.card.type === CardTypes.Character && event.card.controller === this.controller) {
            this.charactersLeftPlayThisPhase.add(event.card.name);
        }
    }
}

UtakuTakeko.id = 'utaku-takeko';

module.exports = UtakuTakeko;
