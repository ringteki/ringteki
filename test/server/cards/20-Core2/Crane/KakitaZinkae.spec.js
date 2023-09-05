describe('Kakita Zinkae', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['kakita-zinkae', 'brash-samurai'],
                },
                player2: {
                    inPlay: ['kakita-toshimoko', 'doji-whisperer'],
                }
            });

            this.zinkae = this.player1.findCardByName('kakita-zinkae');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('if you win duel should move home everyone else', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.zinkae, this.brash],
                defenders: [this.toshimoko, this.whisperer]
            });

            this.player2.pass();
            this.player1.clickCard(this.zinkae);
            this.player1.clickCard(this.toshimoko);

            expect(this.player1).toHavePrompt('Honor Bid');
            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');

            expect(this.getChatLogs(10)).toContain('Duel Effect: send Brash Samurai and Doji Whisperer home');
            expect(this.zinkae.isParticipating()).toBe(true);
            expect(this.brash.isParticipating()).toBe(false);
            expect(this.toshimoko.isParticipating()).toBe(true);
            expect(this.whisperer.isParticipating()).toBe(false);
        });

        it('if you lose duel should move home you home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.zinkae, this.brash],
                defenders: [this.toshimoko, this.whisperer]
            });

            this.player2.pass();
            this.player1.clickCard(this.zinkae);
            this.player1.clickCard(this.toshimoko);

            expect(this.player1).toHavePrompt('Honor Bid');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.getChatLogs(10)).toContain('Duel Effect: send Kakita Zinkae home');
            expect(this.zinkae.isParticipating()).toBe(false);
            expect(this.brash.isParticipating()).toBe(true);
            expect(this.toshimoko.isParticipating()).toBe(true);
            expect(this.whisperer.isParticipating()).toBe(true);
        });
    });
});
