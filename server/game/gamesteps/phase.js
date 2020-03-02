const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const { EventNames } = require('../Constants');

class Phase extends BaseStepWithPipeline {
    constructor(game, name) {
        super(game);
        this.name = name;
        this.steps = [];
        this.currentActionWindow = null;
    }

    initialise(steps) {
        this.pipeline.initialise([new SimpleStep(this.game, () => this.createPhase())]);
        let startStep = new SimpleStep(this.game, () => this.startPhase());
        let endStep = new SimpleStep(this.game, () => this.endPhase());
        this.steps = [startStep].concat(steps).concat([endStep]);
    }

    createPhase() {
        this.game.raiseEvent(EventNames.OnPhaseCreated, { phase: this.name }, () => {
            for(let step of this.steps) {
                this.game.queueStep(step);
            }
        });
    }

    startPhase() {
        this.game.raiseEvent(EventNames.OnPhaseStarted, { phase: this.name }, () => {
            this.game.currentPhase = this.name;
            this.game.currentPhaseObject = this;
            if(this.name !== 'setup') {
                this.game.addAlert('endofround', 'turn: {0} - {1} phase', this.game.roundNumber, this.name);
            }
        });
    }

    endPhase() {
        //This block is currently only hooked into the dynasty phase, for A Season of War.
        //If another card is printed which ends a phase, make sure that the phase action window is completed properly when the card is played!
        if (this.currentActionWindow && !this.currentActionWindow.isComplete()) {
            this.currentActionWindow.complete();
            this.currentActionWindow = null;
        }

        this.game.raiseEvent(EventNames.OnPhaseEnded, { phase: this.name });
        this.game.currentPhase = '';
        this.game.currentPhaseObject = null;
    }
}

module.exports = Phase;
