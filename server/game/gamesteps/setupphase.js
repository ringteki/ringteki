const _ = require('underscore');
const { Phase } = require('./Phase.js');
const { SimpleStep } = require('./SimpleStep.js');
const MulliganDynastyPrompt = require('./setup/mulligandynastyprompt.js');
const MulliganConflictPrompt = require('./setup/mulliganconflictprompt.js');
const SetupProvincesPrompt = require('./setup/setupprovincesprompt.js');
const { Locations } = require('../Constants');
const { GameModes } = require('../../GameModes.js');

class SetupPhase extends Phase {
    constructor(game) {
        const name = 'setup';
        super(game, name);
        this.game.currentPhase = name;
        this.pipeline.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new SimpleStep(game, () => this.chooseFirstPlayer()),
            new SimpleStep(game, () => this.attachStronghold()),
            new SimpleStep(game, () => this.setupProvinces()),
            new SimpleStep(game, () => this.fillProvinces()),
            new MulliganDynastyPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new MulliganConflictPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    setupBegin() {
        let allPlayersShuffled = _.shuffle(this.game.getPlayers());

        let firstPlayer = allPlayersShuffled.shift();
        firstPlayer.firstPlayer = true;
    }

    chooseFirstPlayer() {
        let firstPlayer = this.game.getFirstPlayer();
        if(firstPlayer.opponent) {
            this.game.promptWithHandlerMenu(firstPlayer, {
                activePromptTitle: 'You won the flip. Do you want to be:',
                source: 'Choose First Player',
                choices: ['First Player', 'Second Player'],
                handlers: [
                    () => {
                        this.game.setFirstPlayer(firstPlayer);
                    },
                    () => {
                        this.game.setFirstPlayer(firstPlayer.opponent);
                    }
                ]
            });
        }
    }

    attachStronghold() {
        if(this.game.gameMode === GameModes.Skirmish) {
            return;
        }
        _.each(this.game.getPlayers(), player => {
            player.moveCard(player.stronghold, Locations.StrongholdProvince);
            if(player.role) {
                player.role.moveTo(Locations.Role);
            }
        });
    }

    setupProvinces() {
        if(this.game.gameMode === GameModes.Skirmish) {
            for(let player of this.game.getPlayers()) {
                player.moveCard(player.provinceDeck.first(), Locations.ProvinceOne);
                player.moveCard(player.provinceDeck.first(), Locations.ProvinceTwo);
                player.moveCard(player.provinceDeck.first(), Locations.ProvinceThree);
                player.hideProvinceDeck = true;
            }
        } else {
            this.queueStep(new SetupProvincesPrompt(this.game));
        }
    }

    fillProvinces() {
        let provinces = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            provinces.push(Locations.ProvinceFour);
        }
        _.each(this.game.getPlayers(), player => {
            for(let province of provinces) {
                let card = player.dynastyDeck.first();
                if(card) {
                    player.moveCard(card, province);
                    card.facedown = false;
                }
            }
        });
        this.game.allCards.each(card => {
            card.applyAnyLocationPersistentEffects();
        });
    }

    drawStartingHands() {
        _.each(this.game.getPlayers(), player => player.drawCardsToHand(this.game.gameMode === GameModes.Skirmish ? 3 : 4));
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.honor = this.game.gameMode === GameModes.Skirmish ? 6 : player.stronghold.cardData.honor;
            player.readyToStart = true;
        });
        this.endPhase();
    }
}

module.exports = SetupPhase;
