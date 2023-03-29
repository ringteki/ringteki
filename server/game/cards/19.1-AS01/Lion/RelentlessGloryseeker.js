const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { EventNames, Locations, Phases } = require('../../../Constants.js');
const EventRegistrar = require('../../../eventregistrar.js');

const MAXIMUM_RESSURRECTIONS = 1;

class RelentlessGloryseeker extends DrawCard {
    setupCardAbilities() {
        this.ressurrectionsThisRound = 0;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            EventNames.OnRoundEnded,
            EventNames.OnCardLeavesPlay
        ]);

        this.reaction({
            title: 'Put this character into play',
            location: Locations.DynastyDiscardPile,
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source &&
                    context.game.currentPhase === Phases.Conflict &&
                    this.ressurrectionsThisRound < MAXIMUM_RESSURRECTIONS
            },
            gameAction: AbilityDsl.actions.putIntoPlay(),
            effect: 'return to play - {0} is ready for more!',
            then: () => {
                this.ressurrectionsThisRound++;
                return { gameAction: AbilityDsl.actions.noAction() };
            }
        });
    }

    onRoundEnded() {
        this.ressurrectionsThisRound = 0;
    }

    onCardLeavesPlay(event) {
        if(
            event.card === this &&
            this.location !== Locations.RemovedFromGame &&
            this.ressurrectionsThisRound >= MAXIMUM_RESSURRECTIONS
        ) {
            this.game.addMessage(
                '{0} is removed from the game due to leaving play - may their tales lead them to Yomi',
                this
            );
            this.owner.moveCard(this, Locations.RemovedFromGame);
        }
    }
}

RelentlessGloryseeker.id = 'relentless-gloryseeker';

module.exports = RelentlessGloryseeker;
