import type AbilityContext from '../../../AbilityContext';
import { CardTypes, Locations } from '../../../Constants';
import type { Cost } from '../../../Costs';
import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';
import type Player from '../../../player';
import ProvinceCard from '../../../provincecard';

const CAPTURED_ORIGINAL_PROVINCE = Symbol('Capture Province');

type WithCapturedOriginalProvince<T> = T & { [CAPTURED_ORIGINAL_PROVINCE]?: ProvinceCard };

function captureOriginalProvince(): Cost {
    return {
        canPay() {
            return true;
        },
        resolve(context: AbilityContext) {
            context[CAPTURED_ORIGINAL_PROVINCE] = (context.game.currentConflict as Conflict).conflictProvince;
        },
        pay() {}
    };
}

export default class AllDistancesAreOne extends DrawCard {
    static id = 'all-distances-are-one';

    setupCardAbilities() {
        this.action({
            title: 'Move conflict to a different province',
            condition: (context) => context.game.isDuringConflict() && this.#hasBaseReq(context.player),
            cost: captureOriginalProvince(),
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict(),
                message: '{0} moves the conflict to {1}',
                messageArgs: (card) => [context.player, card]
            })),
            effect: 'move the conflict to another eligible province',
            then: (context: WithCapturedOriginalProvince<AbilityContext>) =>
                this.#hasKickerReq(context.player) && context[CAPTURED_ORIGINAL_PROVINCE] instanceof ProvinceCard
                    ? {
                          gameAction: AbilityDsl.actions.chooseAction({
                              messages: {
                                  Yes: 'Flip the original province facedown',
                                  No: 'Leave it faceup'
                              },
                              choices: {
                                  Yes: AbilityDsl.actions.turnFacedown({ target: context[CAPTURED_ORIGINAL_PROVINCE] }),
                                  No: AbilityDsl.actions.noAction()
                              }
                          })
                      }
                    : { gameAction: [] }
        });
    }

    #hasBaseReq(player: Player) {
        return player.anyCardsInPlay((card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja'));
    }

    #hasKickerReq(player: Player) {
        return player.anyCardsInPlay(
            (card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja') && card.hasTrait('water')
        );
    }
}
