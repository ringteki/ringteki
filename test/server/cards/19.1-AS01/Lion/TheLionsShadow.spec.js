describe('The Lions Shadow', function () {
    integration(function () {
        describe('The Lions Shadow play restriction', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['relentless-gloryseeker', 'ikoma-message-runner'],
                        hand: ['the-lion-s-shadow'],
                        conflictDeck: ['way-of-the-lion', 'for-shame']
                    }
                });

                this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
                this.messageRunner = this.player1.findCardByName('ikoma-message-runner');
                this.lionsShadow = this.player1.findCardByName('the-lion-s-shadow');
                this.relentlessGloryseeker.bow();
            });

            it('should only be able to be played on a courtier', function () {
                this.player1.clickCard(this.lionsShadow);
                expect(this.player1).not.toBeAbleToSelect(this.relentlessGloryseeker);
                expect(this.player1).toBeAbleToSelect(this.messageRunner);

                this.player1.clickCard(this.messageRunner);
                expect(this.getChatLogs(5)).toContain('player1 plays The Lion\'s Shadow, attaching it to Ikoma Message Runner');
            });
        });

        describe('The Lions Shadow dishonor token interaction', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['relentless-gloryseeker', 'ikoma-message-runner'],
                        hand: ['the-lion-s-shadow']
                    }
                });

                this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
                this.messageRunner = this.player1.findCardByName('ikoma-message-runner');
                this.lionsShadow = this.player1.findCardByName('the-lion-s-shadow');
                this.messageRunner.dishonor();
                this.game.checkGameState(true);
            });

            it('should make it so glory isn\'t affecting when dishonored', function () {
                expect(this.messageRunner.getPoliticalSkill()).toBe(0);

                this.player1.clickCard(this.lionsShadow);
                this.player1.clickCard(this.messageRunner);

                expect(this.messageRunner.getPoliticalSkill()).toBe(1);
            });
        });

        describe('The Lions Shadow fate phase ancestral keyword', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['relentless-gloryseeker', 'ikoma-message-runner'],
                        hand: ['the-lion-s-shadow']
                    }
                });

                this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
                this.messageRunner = this.player1.findCardByName('ikoma-message-runner');
                this.lionsShadow = this.player1.findCardByName('the-lion-s-shadow');
                this.messageRunner.dishonor();
                this.game.checkGameState(true);
            });

            it('should gain ancestral in the fate phase', function () {
                this.player1.clickCard(this.lionsShadow);
                this.player1.clickCard(this.messageRunner);

                expect(this.lionsShadow.hasKeyword('ancestral')).toBe(false);

                this.flow.finishConflictPhase();
                expect(this.lionsShadow.hasKeyword('ancestral')).toBe(true);
            });
        });

        describe('The Lions Shadow gained action ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['relentless-gloryseeker', 'ikoma-message-runner'],
                        hand: ['the-lion-s-shadow']
                    }
                });

                this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
                this.messageRunner = this.player1.findCardByName('ikoma-message-runner');
                this.lionsShadow = this.player1.findCardByName('the-lion-s-shadow');
            });

            it('should not prompt when dishonored', function () {
                this.messageRunner.dishonor();
                this.player1.clickCard(this.lionsShadow);
                this.player1.clickCard(this.messageRunner);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.messageRunner],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.messageRunner);
                expect(this.player1).not.toHavePrompt('Choose an ability:');
                expect(this.player1).not.toHavePromptButton('Look at 2 conflict cards and draw 1');
            });

            it('should prompt to activate the ability to see two cards and draw 1', function () {
                this.player1.clickCard(this.lionsShadow);
                this.player1.clickCard(this.messageRunner);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.messageRunner],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.messageRunner);
                expect(this.player1).toHavePrompt('Choose an ability:');
                expect(this.player1).toHavePromptButton('Look at 2 conflict cards and draw 1');
                this.player1.clickPrompt('Look at 2 conflict cards and draw 1');

                expect(this.player1).toHavePrompt('Select a card');
                this.player1.clickPrompt('Supernatural Storm (2)');
                expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Message Runner\'s gained ability from The Lion\'s Shadow, dishonoring Ikoma Message Runner to look at the top two cards of their deck');
                expect(this.getChatLogs(5)).toContain('player1 takes 1 card');
                expect(this.getChatLogs(5)).not.toContain('player1 is shuffling their deck');
            });
        });
    });
});
