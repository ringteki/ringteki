import { CardTypes, EventNames, Locations, Players, TargetModes } from '../../../Constants';
import { PlayCharacterAsIfFromHandAtHome } from '../../../PlayCharacterAsIfFromHand';
import { PlayDisguisedCharacterAsIfFromHandAtHome } from '../../../PlayDisguisedCharacterAsIfFromHand';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');
import EventRegistrar = require('../../../eventregistrar');

export default class UtakuTakeko extends DrawCard {
    static id = 'utaku-takeko';

    private charactersLeftPlayThisPhase: Set<string>;
    private eventRegistrar: EventRegistrar;

    public setupCardAbilities() {
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
                            AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHandAtHome),
                            AbilityDsl.effects.gainPlayAction(PlayDisguisedCharacterAsIfFromHandAtHome)
                        ]
                    })),
                    AbilityDsl.actions.playCard((context) => ({ target: context.target }))
                ])
            },
            effect: 'recall a {1} relative who is {2} {3}',
            effectArgs: (context: TriggeredAbilityContext) => [
                this.msgDistance(context.target),
                this.msgArticle(context.target),
                context.target
            ]
        });
    }

    public onPhaseStarted() {
        this.charactersLeftPlayThisPhase.clear();
    }

    public onCardLeavesPlay(event: any) {
        if (event.card.type === CardTypes.Character && event.card.controller === this.controller) {
            this.charactersLeftPlayThisPhase.add(event.card.name);
        }
    }

    private msgDistance(card: BaseCard): string {
        return card.hasTrait('gaijin') ? 'very distant' : 'distant';
    }

    private msgArticle(card: BaseCard): string {
        if (card.hasTrait('army')) {
            return 'in the';
        }

        switch (card.name[0]) {
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
}
