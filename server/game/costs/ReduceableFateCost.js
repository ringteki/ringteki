const Event = require('../Events/Event');
const { EventNames, Players, Locations } = require('../Constants');
const GameActions = require('../GameActions/GameActions');

class ReduceableFateCost {
    constructor(ignoreType) {
        this.ignoreType = ignoreType;
        this.isPlayCost = true;
    }

    canPay(context) {
        if(context.source.printedCost === null) {
            return false;
        }
        let minCost = context.player.getMinimumCost(context.playType, context, null, this.ignoreType);

        if(context.source.isTemptationsMaho() && minCost > 0) {
            return false;
        }

        return context.player.fate >= minCost &&
            (minCost === 0 || context.player.checkRestrictions('spendFate', context));
    }

    resolve(context, result) {
        let alternatePools = context.player.getAlternateFatePools(context.playType, context.source, context);
        let alternatePoolTotal = alternatePools.reduce((total, pool) => total + pool.fate, 0);
        let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
        if (context.source.isTemptationsMaho()) {
            maxPlayerFate = 0;
        }
        if(this.getReducedCost(context) > maxPlayerFate + alternatePoolTotal) {
            result.cancelled = true;
        } else if(!result.cancelled && alternatePools.length > 0) {
            let properties = {
                reducedCost: this.getReducedCost(context),
                remainingPoolTotal: alternatePoolTotal
            };
            context.costs.alternateFate = new Map();
            let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
            if (context.source.isTemptationsMaho()) {
                maxPlayerFate = 0;
            }

            let handler = (alternatePool) => {
                if (alternatePool === 'cancelled') {
                    result.cancelled = true;
                    return;
                }
                context.game.queueSimpleStep(() => {
                    properties.remainingPoolTotal -= alternatePool.fate;
                    properties.minFate = Math.max(properties.reducedCost - maxPlayerFate - properties.remainingPoolTotal, 0);
                    properties.maxFate = Math.min(alternatePool.fate, properties.reducedCost);
                    properties.pool = alternatePool;
                    properties.numberOfChoices = properties.maxFate - properties.minFate + 1;
                    if(result.cancelled || properties.numberOfChoices === 0) {
                        return;
                    }
                    let choiceHandler = (choice) => {
                        alternatePools = alternatePools.filter(a => a != alternatePool);
                        if (alternatePools.length > 0 && properties.reducedCost > 0) {
                            this.promptForAlternateFateCardSelect(context, alternatePools, handler);
                        }    
                    }
                    this.promptForAlternateFate(context, result, properties, choiceHandler);
                });
            }

            this.promptForAlternateFateCardSelect(context, alternatePools, handler);
            // for(const alternatePool of alternatePools) {
            //     context.game.queueSimpleStep(() => {
            //         properties.remainingPoolTotal -= alternatePool.fate;
            //         properties.minFate = Math.max(properties.reducedCost - maxPlayerFate - properties.remainingPoolTotal, 0);
            //         properties.maxFate = Math.min(alternatePool.fate, properties.reducedCost);
            //         properties.pool = alternatePool;
            //         properties.numberOfChoices = properties.maxFate - properties.minFate + 1;
            //         if(result.cancelled || properties.numberOfChoices === 0) {
            //             return;
            //         }
            //         this.promptForAlternateFate(context, result, properties);
            //     });
            // }
        }
    }
    
    promptForAlternateFateCardSelect(context, cards, handler) {
        let currentCard = context.source;
        let buttons = [];
        let waitingPromptTitle = '';
        buttons.push({ text: 'Cancel', arg: 'cancel' });
        if(context.ability.abilityType === 'action') {
            waitingPromptTitle = 'Waiting for opponent to take an action or pass';
        } else {
            waitingPromptTitle = 'Waiting for opponent';
        }

        context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a card to help pay the fate cost of ' + currentCard.name,
            context: context,
            location: Locations.PlayArea,
            controller: Players.Self,
            buttons: buttons,
            cardCondition: card => cards.includes(card),
            onSelect: (player, card) => {
                handler(card);
                return true;
            },
            onCancel: () => {
                handler('cancelled');
                return true;
            }
        });
    }

    getReducedCost(context) {
        return context.player.getReducedCost(context.playType, context.source, null, this.ignoreType);
    }

    promptForAlternateFate(context, result, properties, handler) {
        let choices = Array.from(Array(properties.numberOfChoices), (x, i) => i + properties.minFate);
        if(result.canCancel) {
            choices.push('Cancel');
        }
        if(properties.maxFate === 0) {
            context.costs.alternateFate.set(properties.pool, 0);
            return;
        }

        context.player.setSelectableCards([properties.pool]);
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose amount of fate to spend from ' + properties.pool.name,
            choices: choices,
            choiceHandler: choice => {
                context.player.clearSelectableCards();

                if(choice === 'Cancel') {
                    result.cancelled = true;
                    return;
                }
                context.costs.alternateFate.set(properties.pool, choice);
                properties.reducedCost -= choice;

                if(handler) {
                    handler(choice);
                }
            }
        });
    }

    payEvent(context) {
        const amount = context.costs.fate = this.getReducedCost(context);
        return new Event(EventNames.OnSpendFate, { amount, context }, event => {
            event.context.player.markUsedReducers(context.playType, event.context.source);
            event.context.player.fate -= this.getFinalFatecost(context, amount);
        });
    }

    getFinalFatecost(context, reducedCost) {
        if(!context.costs.alternateFate) {
            return reducedCost;
        }
        let totalAlternateFate = 0;
        for(let alternatePool of context.player.getAlternateFatePools(context.playType, context.source, context)) {
            let amount = context.costs.alternateFate.get(alternatePool);
            if(amount) {
                context.game.addMessage('{0} takes {1} fate from {2} to pay the cost of {3}', context.player, amount, alternatePool, context.source);
                GameActions.removeFate({ amount: context.costs.alternateFate.get(alternatePool)}).resolve(alternatePool, context);
                totalAlternateFate += context.costs.alternateFate.get(alternatePool);    
            }
        }
        return Math.max(reducedCost - totalAlternateFate, 0);
    }
}

module.exports = ReduceableFateCost;
