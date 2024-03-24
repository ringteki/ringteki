import type { AbilityContext } from '../AbilityContext';
import type BaseCard from '../basecard';
import CardSelector from '../CardSelector';
import type BaseCardSelector from '../CardSelectors/BaseCardSelector';
import { CardTypes, EffectNames, Locations, Players, TargetModes } from '../Constants';
import type DrawCard from '../drawcard';
import type Player from '../player';
import type { ProvinceCard } from '../ProvinceCard';
import type { RoleCard } from '../RoleCard';
import type { StrongholdCard } from '../StrongholdCard';
import { type CardActionProperties, CardGameAction } from './CardGameAction';
import type { GameAction } from './GameAction';

type CardCondition =
    | {
          cardCondition?: (card: BaseCard, context: AbilityContext) => boolean;
          messageArgs?: (card: BaseCard, player: Player, properties: SelectCardProperties) => any[];
          subActionProperties?: (card: BaseCard) => any;
      }
    | {
          cardType: CardTypes.Stronghold;
          cardCondition?: (card: StrongholdCard, context: AbilityContext) => boolean;
          messageArgs?: (card: StrongholdCard, player: Player, properties: SelectCardProperties) => any[];
          subActionProperties?: (card: StrongholdCard) => any;
      }
    | {
          cardType: CardTypes.Role;
          cardCondition?: (card: RoleCard, context: AbilityContext) => boolean;
          messageArgs?: (card: RoleCard, player: Player, properties: SelectCardProperties) => any[];
          subActionProperties?: (card: RoleCard) => any;
      }
    | {
          cardType: CardTypes.Province;
          cardCondition?: (card: ProvinceCard, context: AbilityContext) => boolean;
          messageArgs?: (card: ProvinceCard, player: Player, properties: SelectCardProperties) => any[];
          subActionProperties?: (card: ProvinceCard) => any;
      }
    | {
          cardType:
              | CardTypes.Character
              | CardTypes.Holding
              | CardTypes.Event
              | CardTypes.Attachment
              | Array<CardTypes.Character | CardTypes.Holding | CardTypes.Event | CardTypes.Attachment>;
          cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
          messageArgs?: (card: DrawCard, player: Player, properties: SelectCardProperties) => any[];
          subActionProperties?: (card: DrawCard) => any;
      };

export type SelectCardProperties = CardActionProperties &
    CardCondition & {
        activePromptTitle?: string;
        player?: Players;
        controller?: Players;
        location?: Locations | Locations[];
        targets?: boolean;
        message?: string;
        manuallyRaiseEvent?: boolean;
        gameAction: GameAction;
        selector?: BaseCardSelector;
        mode?: TargetModes;
        numCards?: number;
        hidePromptIfSingleCard?: boolean;
        cancelHandler?: () => void;
        effect?: string;
        effectArgs?: (context: AbilityContext) => Array<string|Player>
    };

export class SelectCardAction extends CardGameAction<SelectCardProperties> {
    defaultProperties: SelectCardProperties = {
        cardCondition: () => true,
        gameAction: null,
        subActionProperties: (card) => ({ target: card }),
        targets: false,
        hidePromptIfSingleCard: false,
        manuallyRaiseEvent: false
    };

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target, effect, effectArgs } = this.getProperties(context);
        if (effect) {
            return [effect, effectArgs(context) || []];
        }
        return ['choose a target for {0}', [target]];
    }

    getProperties(
        context: AbilityContext,
        additionalProperties = {}
    ): SelectCardProperties & { selector: BaseCardSelector } {
        let properties = super.getProperties(context, additionalProperties);
        properties.gameAction.setDefaultTarget(() => properties.target);
        if (!properties.selector) {
            let cardCondition = (card, context) =>
                properties.gameAction.allTargetsLegal(
                    context,
                    Object.assign({}, additionalProperties, properties.subActionProperties(card))
                ) && properties.cardCondition(card, context);
            properties.selector = CardSelector.for(Object.assign({}, properties, { cardCondition }));
        }
        return properties as SelectCardProperties & { selector: BaseCardSelector };
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let player =
            (properties.targets && context.choosingPlayerOverride) ||
            (properties.player === Players.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.canTarget(card, context, player);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let player =
            (properties.targets && context.choosingPlayerOverride) ||
            (properties.player === Players.Opponent && context.player.opponent) ||
            context.player;
        return properties.selector.hasEnoughTargets(context, player);
    }

    addEventsToArray(events, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if (properties.player === Players.Opponent && !context.player.opponent) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        let mustSelect = [];
        if (properties.targets) {
            player = context.choosingPlayerOverride || player;
            mustSelect = properties.selector
                .getAllLegalTargets(context, player)
                .filter((card) =>
                    card
                        .getEffects(EffectNames.MustBeChosen)
                        .some((restriction) => restriction.isMatch('target', context))
                );
        }
        if (!properties.selector.hasEnoughTargets(context, player)) {
            return;
        }
        let defaultProperties = {
            context: context,
            selector: properties.selector,
            mustSelect: mustSelect,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (player, cards) => {
                if (properties.message) {
                    context.game.addMessage(properties.message, ...properties.messageArgs(cards, player, properties));
                }
                properties.gameAction.addEventsToArray(
                    events,
                    context,
                    Object.assign({ parentAction: this }, additionalProperties, properties.subActionProperties(cards))
                );
                if (properties.manuallyRaiseEvent) {
                    context.game.openEventWindow(events);
                }
                return true;
            }
        };
        const finalProperties = Object.assign(defaultProperties, properties);
        if (properties.hidePromptIfSingleCard) {
            const cards = properties.selector.getAllLegalTargets(context);
            if (cards.length === 1) {
                finalProperties.onSelect(player, cards[0]);
                return;
            }
        }
        context.game.promptForSelect(player, finalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.targets && properties.player !== Players.Opponent;
    }
}