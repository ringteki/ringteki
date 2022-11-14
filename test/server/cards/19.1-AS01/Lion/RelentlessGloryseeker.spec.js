describe('Relentless Gloryseeker', function () {
    integration(function () {
        describe('Relentless Gloryseeker Action Ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['relentless-gloryseeker', 'ikoma-message-runner']
                    }
                });

                this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
                this.messageRunner = this.player1.findCardByName('ikoma-message-runner');
                this.relentlessGloryseeker.bow();
            });

            it('should not trigger if there is no ring claimed', function () {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.relentlessGloryseeker);
                expect(this.relentlessGloryseeker.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger after you win a political conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.messageRunner],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();

                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.relentlessGloryseeker);
                expect(this.relentlessGloryseeker.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should trigger after you win a military conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.messageRunner],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();

                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.relentlessGloryseeker);
                expect(this.relentlessGloryseeker.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });
    });
});
