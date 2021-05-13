const DrawCard = require('../../drawcard.js');
const { Players, TargetModes, CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class FuSuiDisciple extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            targets: {
                player: {
                    mode: TargetModes.Select,
                    activePromptTitle: 'Choose a player',
                    targets: true,
                    choices: {
                        [this.owner.name]: context => context.game.rings[this.getCurrentElementSymbol('fu-sui-disciple-air')].isConsideredClaimed(this.owner),
                        [this.owner.opponent && this.owner.opponent.name || 'NA']: context => context.game.rings[this.getCurrentElementSymbol('fu-sui-disciple-air')].isConsideredClaimed(this.owner.opponent)
                    }
                },
                character: {
                    dependsOn: 'player',
                    player: context => context.selects.player.choice === context.player.name ? Players.Self : Players.Opponent,
                    activePromptTitle: 'Choose a character to be honored or dishonored',
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => {
                        let player = context.selects.player.choice === context.player.name ? context.player : context.player.opponent;
                        return !card.isHonored && !card.isDishonored && card.controller === player;
                    }
                },
                effect: {
                    dependsOn: 'character',
                    mode: TargetModes.Select,
                    choices: {
                        'Honor this character': AbilityDsl.actions.honor(context => ({ target: context.targets.character })),
                        'Dishonor this character': AbilityDsl.actions.dishonor(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'fu-sui-disciple-air',
            prettyName: 'Claimed Ring',
            element: Elements.Air
        });
        return symbols;
    }
}

FuSuiDisciple.id = 'fu-sui-disciple';

module.exports = FuSuiDisciple;
