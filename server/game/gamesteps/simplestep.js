const { BaseStep } = require('./BaseStep');

class SimpleStep extends BaseStep {
    constructor(game, continueFunc) {
        super(game);
        this.continueFunc = continueFunc;
    }

    continue() {
        return this.continueFunc();
    }

    getDebugInfo() {
        return this.continueFunc.toString();
    }
}

module.exports = SimpleStep;
