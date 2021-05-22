const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes, CardTypes } = require('../../Constants');
const EventRegistrar = require('../../eventregistrar');

class DiscipleOfDeception extends DrawCard {
    setupCardAbilities() {
        this.tokensChanged = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished']);

        this.action({
            title: 'Treat a status token as a different token',
            condition: context => context.game.isDuringConflict(),
            effect: 'replace {1}\'s {2} with {3} until the end of the conflict',
            effectArgs: context => [context.tokens.second[0].card, context.tokens.second, context.tokens.first],
            targets: {
                first: {
                    activePromptTitle: 'Choose the status token to copy',
                    mode: TargetModes.Token,
                    cardType: CardTypes.Character
                },
                second: {
                    dependsOn: 'first',
                    activePromptTitle: 'Choose the status token to overwrite',
                    mode: TargetModes.Token,
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => {
                        return card !== context.tokens.first[0].card && !card.hasStatusToken(context.tokens.first[0].grantedStatus);
                    },
                    tokenCondition: (token, context) => {
                        return token.grantedStatus !== context.tokens.first[0].grantedStatus;
                    },
                    gameAction: AbilityDsl.actions.handler({
                        handler: context => {
                            const targetToken = context.tokens.second[0];
                            const newStatus = context.tokens.first[0].grantedStatus;
                            const targetCard = targetToken.card;
                            targetToken.overrideStatus = newStatus;
                            this.tokensChanged.push(targetToken);
                            targetCard.updateStatusTokenEffects();
                        }
                    })
                }
            }
        });
    }

    onConflictFinished() {
        this.tokensChanged.forEach(a => {
            const targetCard = a.card;
            a.overrideStatus = undefined;
            if(targetCard) {
                targetCard.updateStatusTokenEffects();
            }
        });
        this.tokensChanged = [];
    }
}

DiscipleOfDeception.id = 'disciple-of-deception';

module.exports = DiscipleOfDeception;
