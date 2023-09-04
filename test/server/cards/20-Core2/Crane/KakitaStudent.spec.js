describe('Kakita Student', function() {
    integration(function() {
        describe('Duel Challenge', function () {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 20,
                        inPlay: ['doji-challenger', 'kakita-student', 'doji-whisperer'],
                        hand: ['a-fate-worse-than-death', 'desolation'],
                        dynastyDiscard: ['awakened-tsukumogami']
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['embrace-the-void', 'policy-debate']
                    }
                });

                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.student = this.player1.findCardByName('kakita-student');
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.pd = this.player2.findCardByName('policy-debate');
            });

            it('should react appropriately', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger, this.whisperer],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.student);
            });

            it('should apply +2 to the duel result', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);
                this.player1.clickCard(this.student);

                expect(this.player1).toHavePrompt('Honor Bid');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Policy Debate');
                expect(this.getChatLogs(10)).toContain('player1 uses Kakita Student to help win a duel');
                expect(this.getChatLogs(10)).toContain('player1 gives Doji Challenger 2 bonus skill for this duel');
                expect(this.getChatLogs(10)).toContain('Kakita Toshimoko: 4 vs 6: Doji Challenger');
            });

            it('should not react if your duelist costs 1', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger, this.whisperer],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.whisperer);

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Honor Bid');
            });

        });
    });
});
