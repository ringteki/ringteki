describe('Swordguy', function () {
    integration(function () {
        describe('Ignore skill', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 20,
                        inPlay: ['doji-challenger', 'doji-whisperer', 'kakita-yoshi'],
                        hand: ['a-fate-worse-than-death', 'desolation'],
                        dynastyDiscard: ['awakened-tsukumogami', 'promising-kohai']
                    },
                    player2: {
                        inPlay: ['swordguy', 'kakita-toshimoko'],
                        hand: ['embrace-the-void', 'policy-debate']
                    }
                });

                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.student = this.player1.findCardByName('promising-kohai');
                this.swordguy = this.player2.findCardByName('swordguy');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.pd = this.player2.findCardByName('policy-debate');
            });

            it('should only use printed skill and win ties', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yoshi],
                    defenders: [this.swordguy]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.swordguy);
                this.player2.clickCard(this.yoshi);

                expect(this.player1).toHavePrompt('Honor Bid');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player2).toHavePrompt('Policy Debate');
                expect(this.getChatLogs(10)).toContain('Swordguy: 1 vs 1: Kakita Yoshi');
            });

            it('should not matter if not in the duel', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yoshi],
                    defenders: [this.swordguy, this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.yoshi);

                expect(this.player1).toHavePrompt('Honor Bid');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Policy Debate');
                expect(this.getChatLogs(10)).toContain('Kakita Toshimoko: 4 vs 7: Kakita Yoshi');
            });
        });
    });
});
