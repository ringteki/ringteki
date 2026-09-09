describe('SoD - Unicorn', function () {
    integration(function () {
        describe('Campfire Counsel', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'kakita-toshimoko', 'keeper-initiate'],
                        dynastyDiscard: ['campfire-counsel'],
                        hand: ['renowned-singer']
                    },
                    player2: {
                        inPlay: ['doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.liar = this.player1.findCardByName('bayushi-liar');
                this.keeper = this.player1.findCardByName('keeper-initiate');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.campfire = this.player1.findCardByName('campfire-counsel');
                this.singer = this.player1.findCardByName('renowned-singer');

                this.player1.placeCardInProvince(this.campfire, 'province 1');
                this.liar.bow();
                this.toshimoko.bow();
            });

            it('should work', function () {
                this.player1.clickCard(this.campfire);
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                this.player1.clickCard(this.liar);

                expect(this.liar.isDishonored).toBe(true);
                expect(this.liar.bowed).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 uses Campfire Counsel, sacrificing Campfire Counsel to ready Bayushi Liar');
                expect(this.getChatLogs(5)).toContain('Bayushi Liar is dishonored');
            });

            it('with storyteller should work', function () {
                this.player1.clickCard(this.singer);
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.clickCard(this.campfire);
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                this.player1.clickCard(this.liar);

                expect(this.liar.isDishonored).toBe(false);
                expect(this.liar.bowed).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 uses Campfire Counsel, sacrificing Campfire Counsel to ready Bayushi Liar');
                expect(this.getChatLogs(5)).not.toContain('Bayushi Liar is dishonored');
            });
        });

        describe('Cornering Maneuver', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'kakita-toshimoko', 'keeper-initiate', 'asahina-augur'],
                        hand: ['cornering-maneuver']
                    },
                    player2: {
                        inPlay: ['doji-diplomat', 'brash-samurai', 'doji-challenger'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.liar = this.player1.findCardByName('bayushi-liar');
                this.augur = this.player1.findCardByName('asahina-augur');
                this.keeper = this.player1.findCardByName('keeper-initiate');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.cornering = this.player1.findCardByName('cornering-maneuver');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko, this.augur],
                    defenders: [this.brash, this.challenger]
                });

                this.player2.pass();

                this.player1.clickCard(this.cornering);
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).toBeAbleToSelect(this.augur);
                expect(this.player1).not.toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.brash);

                let mil = this.toshimoko.getMilitarySkill();

                this.player1.clickCard(this.toshimoko);
                expect(this.getChatLogs(5)).toContain('player1 plays Cornering Maneuver to give Kakita Toshimoko +2military');

                expect(this.toshimoko.getMilitarySkill()).toBe(mil + 2);
                expect(this.player1).toHavePrompt('Choose a character to move');
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.brash);

                expect(this.keeper.isParticipating()).toBe(false);
                this.player1.clickCard(this.keeper);
                expect(this.keeper.isParticipating()).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 moves Keeper Initiate to the conflict');
            });

            it('send home', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.brash]
                });

                this.player2.pass();

                this.player1.clickCard(this.cornering);
                this.player1.clickCard(this.toshimoko);
                this.player1.clickCard(this.toshimoko);
                expect(this.toshimoko.isParticipating()).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 moves Kakita Toshimoko home');
            });

            it('outnumbering', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko, this.keeper],
                    defenders: [this.brash]
                });

                this.player2.pass();

                this.player1.clickCard(this.cornering);
                this.player1.clickCard(this.toshimoko);
                expect(this.player1).toHavePrompt('Choose a character to move');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Incesssant Moto', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['admit-defeat']
                    },
                    player2: {
                        inPlay: ['incessant-moto'],
                        hand: ['way-of-the-scorpion']
                    }
                });

                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.moto = this.player2.findCardByName('incessant-moto');
                this.defeat = this.player1.findCardByName('admit-defeat');
                this.scorp = this.player2.findCardByName('way-of-the-scorpion');
            });

            it('should have berserker trait', function () {
                expect(this.moto.hasTrait('berserker')).toBe(true);
            });

            it('should contribute when bowed', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.moto]
                });

                this.player2.pass();

                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(2);

                this.player1.clickCard(this.defeat);
                this.player1.clickCard(this.moto);

                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(2);
                expect(this.moto.bowed).toBe(true);

                this.toshimoko.bowed = true;
                this.game.checkGameState(true);
                expect(this.game.currentConflict.attackerSkill).toBe(0);
                expect(this.game.currentConflict.defenderSkill).toBe(2);
            });

            it('should move in after event', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: []
                });

                this.player2.clickCard(this.scorp);
                this.player2.clickCard(this.toshimoko);

                expect(this.player2).toBeAbleToSelect(this.moto);
                this.player2.clickCard(this.moto);

                expect(this.moto.isParticipating()).toBe(true);
                expect(this.getChatLogs(5)).toContain('player2 uses Incessant Moto to move Incessant Moto into the conflict');
            });
        });

        describe('Utaku Tomoe', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['admit-defeat']
                    },
                    player2: {
                        inPlay: ['utaku-tomoe', 'moto-youth', 'moto-horde'],
                        hand: ['dispatch']
                    }
                });

                this.tomoe = this.player2.findCardByName('utaku-tomoe');
                this.youth = this.player2.findCardByName('moto-youth');
                this.horde = this.player2.findCardByName('moto-horde');
                this.yokuni = this.player1.findCardByName('togashi-yokuni');
            });

            it('when winning should gain honor', function () {
                let honor = this.player2.honor;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yokuni],
                    defenders: [this.tomoe, this.youth, this.horde]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.tomoe);

                this.player2.clickCard(this.tomoe);
                expect(this.player2.honor).toBe(honor + 2);
                expect(this.tomoe.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player2 uses Utaku Tomoe to gain 2 honor');
            });

            it('when losing should ready', function () {
                let honor = this.player2.honor;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yokuni],
                    defenders: [this.tomoe]
                });

                this.player2.pass();
                this.player1.pass();

                this.player1.clickPrompt('Gain 2 honor');

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.tomoe);

                this.player2.clickCard(this.tomoe);
                expect(this.player2.honor).toBe(honor);
                expect(this.tomoe.bowed).toBe(false);
                expect(this.getChatLogs(5)).toContain('player2 uses Utaku Tomoe to ready Utaku Tomoe');
            });

            it('when character was not participating', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yokuni],
                    defenders: [this.horde, this.youth]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Utaku Tomoe and Palm Strike', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-ichi'],
                        hand: ['palm-strike']
                    },
                    player2: {
                        inPlay: ['utaku-tomoe', 'moto-youth']
                    }
                });

                this.ichi = this.player1.findCardByName('togashi-ichi');
                this.palmStrike = this.player1.findCardByName('palm-strike');
                this.tomoe = this.player2.findCardByName('utaku-tomoe');
                this.youth = this.player2.findCardByName('moto-youth');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ichi],
                    defenders: [this.tomoe, this.youth]
                });

                this.player2.pass();
                this.player1.clickCard(this.palmStrike);
                this.player1.clickCard(this.ichi);
                this.player1.clickCard(this.tomoe);
                expect(this.tomoe.bowed).toBe(true);
            });

            it('lets Tomoe ready once the conflict is over and cannot-ready has expired', function () {
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Gain 2 honor');

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.tomoe);

                this.player2.clickCard(this.tomoe);
                expect(this.tomoe.bowed).toBe(false);
            });
        });

        describe('Strange Mirror', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko', 'keeper-initiate'],
                        hand: ['strange-mirror']
                    },
                    player2: {
                        inPlay: ['doji-challenger', 'moto-youth'],
                        dynastyDiscard: ['moto-youth'],
                        hand: ['dispatch']
                    }
                });

                this.mirror = this.player1.findCardByName('strange-mirror');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.youth = this.player2.findCardByName('moto-youth', 'play area');
                this.youth2 = this.player2.findCardByName('moto-youth', 'dynasty discard pile');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.keeper = this.player1.findCardByName('keeper-initiate');

                this.player1.playAttachment(this.mirror, this.toshimoko);
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.challenger, this.youth]
                });

                this.player2.pass();
                this.player1.clickCard(this.toshimoko);
                expect(this.player1).toBeAbleToSelect(this.youth);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                this.player1.clickCard(this.youth);
                expect(this.player1).toBeAbleToSelect(this.youth2);
                this.player1.clickCard(this.youth2);
                expect(this.youth2.location).toBe('play area');
                expect(this.youth2.controller).toBe(this.player1.player);
                expect(this.getChatLogs(5)).toContain('player1 uses Kakita Toshimoko\'s gained ability from Strange Mirror to put Moto Youth into play in the conflict, removing it from the game when the conflict ends');

                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.youth2.location).toBe('removed from game');
                expect(this.getChatLogs(5)).toContain('Moto Youth is removed from the game due to the delayed effect of Kakita Toshimoko');
            });
        });

        describe('Into the Storm', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['admit-defeat', 'fine-katana']
                    },
                    player2: {
                        inPlay: ['incessant-moto'],
                        hand: ['way-of-the-scorpion', 'shiksha-scout', 'into-the-storm']
                    }
                });

                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.moto = this.player2.findCardByName('incessant-moto');
                this.defeat = this.player1.findCardByName('admit-defeat');
                this.katana = this.player1.findCardByName('fine-katana');
                this.scorp = this.player2.findCardByName('way-of-the-scorpion');
                this.scout = this.player2.findCardByName('shiksha-scout');
                this.storm = this.player2.findCardByName('into-the-storm');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.moto]
                });

                let fate1 = this.player1.fate;
                let fate2 = this.player2.fate;

                this.player2.clickCard(this.storm);

                expect(this.player2.fate).toBe(fate2);
                expect(this.getChatLogs(5)).toContain('player2 plays Into the Storm to increase the cost of events this conflict by 1');

                this.player1.clickCard(this.defeat);
                this.player1.clickCard(this.moto);

                expect(this.player1.fate).toBe(fate1 - 2);

                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');

                expect(this.player2.fate).toBe(fate2 - 2); // doesn't affect characters

                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.toshimoko);

                expect(this.player1.fate).toBe(fate1 - 2); // doesn't affect attachments

                this.player2.clickCard(this.scorp);
                this.player2.clickCard(this.toshimoko);

                expect(this.player2.fate).toBe(fate2 - 3);
                expect(this.getChatLogs(10)).toContain('The storm abates, events no longer cost 1 more');
            });

            it('gaining fate and expiry', function () {
                this.player1.pass();
                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('0');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.moto]
                });

                let fate1 = this.player1.fate;
                let fate2 = this.player2.fate;

                this.player2.clickCard(this.storm);

                expect(this.player2.fate).toBe(fate2 + 1);
                expect(this.getChatLogs(5)).toContain('player2 plays Into the Storm to increase the cost of events this conflict by 1 and gain 1 fate');

                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.toshimoko);

                expect(this.player1.fate).toBe(fate1);

                this.player2.clickCard(this.scorp);
                this.player2.clickCard(this.toshimoko);

                expect(this.player2.fate).toBe(fate2);
                expect(this.getChatLogs(10)).toContain('The storm abates, events no longer cost 1 more');

                this.player1.clickCard(this.defeat);
                this.player1.clickCard(this.moto);

                expect(this.player1.fate).toBe(fate1 - 1);
            });
        });
    });
});
