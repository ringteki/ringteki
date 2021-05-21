const CardSelector = require('../CardSelector.js');
const { CardTypes, Stages, Players, Locations } = require('../Constants.js');

class AbilityTargetToken {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.properties.location = this.properties.location || Locations.PlayArea;
        this.selector = this.getSelector(properties);
        this.properties.singleToken = this.properties.singleToken || true;
        for(let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget(context => context.tokens[name]);
        }
        this.dependentTarget = null;
        this.dependentCost = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let tokens = [...card.statusTokens];
            if(!tokens || tokens.length === 0) {
                return false;
            }
            let contextCopy = context.copy();
            contextCopy.tokens[this.name] = tokens;
            if(this.name === 'target') {
                contextCopy.token = tokens;
            }
            if(context.stage === Stages.PreTarget && this.dependentCost && !this.dependentCost.canPay(contextCopy)) {
                return false;
            }

            let tokensValid = true;
            if(properties.tokenCondition) {
                tokensValid = tokensValid && tokens.some(a => properties.tokenCondition(a, context));
            }
            let cardValid = true;
            if(properties.cardCondition) {
                cardValid = cardValid && properties.cardCondition(card, context);
            }

            return (tokensValid && cardValid) && (!this.dependentTarget || this.dependentTarget.hasLegalTarget(contextCopy)) &&
                    (properties.gameAction.length === 0 || properties.gameAction.some(gameAction => gameAction.hasLegalTarget(contextCopy)));
        };
        let cardType = properties.cardType || [CardTypes.Attachment, CardTypes.Character, CardTypes.Event, CardTypes.Holding, CardTypes.Province, CardTypes.Role, CardTypes.Stronghold];
        return CardSelector.for(Object.assign({}, properties, { cardType: cardType, cardCondition: cardCondition, targets: false }));
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return this.selector.optional || this.selector.hasEnoughTargets(context, this.getChoosingPlayer(context));
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context, this.getChoosingPlayer(context));
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.hasLegalTarget(context));
    }

    resolve(context, targetResults) {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let player = context.choosingPlayerOverride || this.getChoosingPlayer(context);
        if(player === context.player.opponent && context.stage === Stages.PreTarget) {
            targetResults.delayTargeting = this;
            return;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(context.stage === Stages.PreTarget) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            buttons: buttons,
            context: context,
            selector: this.selector,
            onSelect: (player, card) => {
                let validTokens = card.statusTokens.filter(token => (!this.properties.tokenCondition || this.properties.tokenCondition(token, context)) && (this.properties.gameAction.length === 0 || this.properties.gameAction.some(action => action.canAffect(token, context))));
                if(this.properties.singleToken && validTokens.length > 1) {
                    const choices = validTokens.map(token => token.name);
                    const handlers = validTokens.map(token => {
                        return () => {
                            context.tokens[this.name] = [token];
                            if(this.name === 'target') {
                                context.token = [token];
                            }
                        };
                    });
                    context.game.promptWithHandlerMenu(player, {
                        activePromptTitle: 'Which token do you wish to select?',
                        choices: choices,
                        handlers: handlers,
                        context: context
                    });
                } else {
                    context.tokens[this.name] = validTokens;
                    if(this.name === 'target') {
                        context.token = validTokens;
                    }
                }
                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'costsFirst') {
                    targetResults.costsFirst = true;
                    return true;
                }
                return true;
            }
        };
        context.game.promptForSelect(player, Object.assign(promptProperties, this.properties));
    }

    checkTarget(context) {
        if(!context.tokens[this.name] || context.tokens[this.name].length === 0 || context.choosingPlayerOverride && this.getChoosingPlayer(context) === context.player) {
            return false;
        }
        return this.selector.canTarget(context.tokens[this.name][0].card, context);
    }

    getChoosingPlayer(context) {
        let playerProp = this.properties.player;
        if(typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? context.player.opponent : context.player;
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        if(this.properties.gameAction.some(action => action.hasTargetsChosenByInitiatingPlayer(context))) {
            return true;
        }
        return this.getChoosingPlayer(context) === context.player;
    }
}

module.exports = AbilityTargetToken;
