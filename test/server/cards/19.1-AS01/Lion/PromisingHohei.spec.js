describe('Promising Hohei', function () {
    integration(function () {
        describe('Promising Hohei enter play ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['relentless-gloryseeker', 'ikoma-message-runner'],
                        hand: ['promising-hohei', 'ayubune-pilot', 'fine-katana']
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        hand: ['ayubune-pilot']
                    }
                });

                this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
                this.messageRunner = this.player1.findCardByName('ikoma-message-runner');
                this.promisingHohei = this.player1.findCardByName('promising-hohei');
                this.ayubunePilot1 = this.player1.findCardByName('ayubune-pilot');
                this.fineKatana = this.player1.findCardByName('fine-katana');

                this.solemnScholar = this.player2.findCardByName('solemn-scholar');
                this.ayubunePilot2 = this.player2.findCardByName('ayubune-pilot');
            });

            it('should not trigger if there is no follower attachment', function () {
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.relentlessGloryseeker);

                this.player2.pass();

                this.player1.clickCard(this.promisingHohei);
                this.player1.clickCard(this.relentlessGloryseeker);

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should prompt to return a follower you control back to hand', function () {
                this.player1.clickCard(this.ayubunePilot1);
                this.player1.clickCard(this.relentlessGloryseeker);

                this.player2.clickCard(this.ayubunePilot2);
                this.player2.clickCard(this.solemnScholar);

                this.player1.clickCard(this.promisingHohei);
                this.player1.clickCard(this.relentlessGloryseeker);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.promisingHohei);

                this.player1.clickCard(this.promisingHohei);
                expect(this.player1).toBeAbleToSelect(this.ayubunePilot1);
                expect(this.player1).not.toBeAbleToSelect(this.ayubunePilot2);

                this.player1.clickCard(this.ayubunePilot1);
                expect(this.ayubunePilot1.location).toBe('hand');
            });
        });
    });
});
