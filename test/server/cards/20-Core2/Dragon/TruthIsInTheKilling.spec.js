describe('Truth is in the Killing', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'daidoji-uji'],
                    hand: ['truth-is-in-the-killing']
                },
                player2: {
                    inPlay: ['kakita-toshimoko', 'shiba-tsukune', 'doji-diplomat'],
                    hand: ['embrace-the-void', 'policy-debate']
                }
            });

            this.uji = this.player1.findCardByName('daidoji-uji');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.truth = this.player1.findCardByName('truth-is-in-the-killing');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.tsukune = this.player2.findCardByName('shiba-tsukune');
            this.diplomat = this.player2.findCardByName('doji-diplomat');
            this.pd = this.player2.findCardByName('policy-debate');
        });

        describe('Duel Strike', function () {
            it('should react if you have a duelist and win and discard the loser', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger, this.yoshi],
                    defenders: [this.tsukune, this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.tsukune);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.truth);
                this.player1.clickCard(this.truth);
                expect(this.tsukune.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Policy Debate');

                expect(this.getChatLogs(10)).toContain(
                    'player1 plays Truth Is In the Killing to discard a loser of the duel'
                );
                expect(this.getChatLogs(10)).toContain('player1 discards Shiba Tsukune');
            });

            it('should react if you have a duelist and lose', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger, this.yoshi],
                    defenders: [this.tsukune, this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.tsukune);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.truth);
                this.player1.clickCard(this.truth);

                expect(this.getChatLogs(10)).toContain(
                    'player1 plays Truth Is In the Killing to discard a loser of the duel'
                );
                expect(this.getChatLogs(10)).toContain('player1 discards Doji Challenger');
            });

            it("should not react if you don't have a duelist", function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger, this.yoshi],
                    defenders: [this.tsukune, this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.yoshi);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Policy Debate');
            });
        });
    });
});
