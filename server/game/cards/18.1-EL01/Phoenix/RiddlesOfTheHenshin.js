const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants.js');

class RiddlesOfTheHenshin extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Resolve ring effects',
            condition: context => this.getNumberOfMonks(context) > 0 && context.player.getClaimedRings().length > 0,
            handler: context => {
                const maxRings = this.getNumberOfMonks(context);
                let chosenRings = [];
                let promptPlayer = () => {
                    let buttons = [];
                    if(chosenRings.length > 0) {
                        buttons.push({ text: 'Done', arg: 'done' });
                    }
                    context.game.promptForRingSelect(context.player, {
                        activePromptTitle: 'Choose a ring to resolve',
                        context: context,
                        buttons: buttons,
                        ringCondition: ring => ring.isConsideredClaimed(context.player) && !chosenRings.includes(ring),
                        onMenuCommand: player => {
                            this.game.addMessage('{0} resolves {1}', player, chosenRings);
                            let event = this.game.actions.resolveRingEffect().getEvent(chosenRings, this.game.getFrameworkContext(player));
                            this.game.openThenEventWindow(event);
                            return true;
                        },
                        onSelect: (player, ring) => {
                            chosenRings.push(ring);
                            if(Object.values(context.game.rings).some(ring => ring.isConsideredClaimed(context.player) && !chosenRings.includes(ring) && chosenRings.length < maxRings)) {
                                promptPlayer();
                                return true;
                            }
                            this.game.addMessage('{0} resolves {1}', player, chosenRings);
                            let action = this.game.actions.resolveRingEffect({ target: chosenRings});
                            let events = [];
                            action.addEventsToArray(events, this.game.getFrameworkContext(player));
                            this.game.openThenEventWindow(events);
                            return true;

                        }
                    });
                };
                promptPlayer();
            },
            effect: 'resolve ring effects'
        });
    }

    getNumberOfMonks(context) {
        return context.player.cardsInPlay.reduce((total, card) => total + ((card.getType() === CardTypes.Character && card.hasTrait('monk')) ? 1 : 0), 0);
    }
}

RiddlesOfTheHenshin.id = 'riddles-of-the-henshin';
module.exports = RiddlesOfTheHenshin;
