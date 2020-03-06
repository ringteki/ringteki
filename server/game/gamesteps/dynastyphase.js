const _ = require('underscore');

const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DynastyActionWindow = require('./dynasty/dynastyactionwindow.js');
const { Locations, Phases, EffectNames } = require('../Constants');

/*
I Dynasty Phase
1.1 Dynasty phase begins.
1.2 Reveal facedown dynasty cards.
1.3 Collect fate.
1.4 SPECIAL ACTION WINDOW
    Players alternate playing cards from
    provinces and/or triggering Action abilities.
1.5 Dynasty phase ends.
 */

class DynastyPhase extends Phase {
    constructor(game, gainFate = true) {
        super(game, Phases.Dynasty);
        this.gainFate = gainFate;
        this.initialise([
            new SimpleStep(game, () => this.beginDynasty()),
            new SimpleStep(game, () => this.flipDynastyCards()),
            new SimpleStep(game, () => this.collectFate()),
            new SimpleStep(game, () => this.dynastyActionWindowStep())
        ]);

        this.steps = this.steps.concat([new SimpleStep(game, () => this.checkForRepeatDynasty())]);
    }

    createPhase() {
        this.game.roundNumber++;
        this.game.conflictRecord = [];
        super.createPhase();
    }

    beginDynasty() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            player.beginDynasty();
        });
    }

    flipDynastyCards () {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            let revealedCards = [];
            for(let province of [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]) {
                let cards = player.getDynastyCardsInProvince(province);
                cards.forEach(card => {
                    if(card && card.facedown) {
                        this.game.applyGameAction(null, { flipDynasty: card });
                        revealedCards.push(card);
                    }
                });
            }
            if(revealedCards.length > 0) {
                this.game.queueSimpleStep(() => this.game.addMessage('{0} reveals {1}', player, revealedCards));
            }
        });
    }

    collectFate() {
        if(this.gainFate) {
            _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
                player.collectFate();
            });
        }
    }

    dynastyActionWindowStep() {
        this.game.queueStep(new DynastyActionWindow(this.game));
    }

    checkForRepeatDynasty() {
        let restarted = false;
        this.game.getPlayersInFirstPlayerOrder().forEach(player => {
            if(!restarted && player.anyEffect(EffectNames.RestartDynastyPhase)) {
                restarted = true;
                let effectSource = player.mostRecentEffect(EffectNames.RestartDynastyPhase);
                this.game.addMessage('{0} has started a new dynasty phase!', effectSource);
                let dynastyPhase = new DynastyPhase(this.game, false);
                this.game.queueStep(dynastyPhase);
            }
        });
    }
}

module.exports = DynastyPhase;
