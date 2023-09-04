describe('Strike of Flowing Water', function() {
    integration(function () {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    hand: ['strike-of-flowing-water', 'desolation'],
                    dynastyDiscard: ['awakened-tsukumogami']
                },
                player2: {
                    inPlay: ['kakita-toshimoko'],
                    hand: ['embrace-the-void', 'policy-debate']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.strike = this.player1.findCardByName('strike-of-flowing-water');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.pd = this.player2.findCardByName('policy-debate');
        });

        describe('duel effect', function() {
            it('should react appropriately', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                expect(this.player1).toHavePrompt('Honor Bid');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.strike);
            });

            it('should apply +X to the duel result where X is the difference between dials (opponent higher)', function() {
                let honor1 = this.player1.honor;
                let honor2 = this.player2.honor;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');

                this.player1.clickCard(this.strike);

                expect(this.player2.honor).toBe(honor2 - 2);
                expect(this.player1.honor).toBe(honor1 + 1);

                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(10)).toContain('player1 plays Strike of Flowing Water, losing 1 honor to get 2 bonus skill for duel resolution');
                expect(this.getChatLogs(10)).toContain('player1 gives Doji Challenger 2 bonus skill for this duel');
                expect(this.getChatLogs(10)).toContain('Kakita Toshimoko: 6 vs 6: Doji Challenger');
            });

            it('should apply +X to the duel result where X is the difference between dials (you higher)', function() {
                let honor1 = this.player1.honor;
                let honor2 = this.player2.honor;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');

                this.player1.clickCard(this.strike);

                expect(this.player2.honor).toBe(honor2 + 2);
                expect(this.player1.honor).toBe(honor1 - 3);

                expect(this.player1).toHavePrompt('Policy Debate');
                expect(this.getChatLogs(10)).toContain('player1 plays Strike of Flowing Water, losing 1 honor to get 2 bonus skill for duel resolution');
                expect(this.getChatLogs(10)).toContain('player1 gives Doji Challenger 2 bonus skill for this duel');
                expect(this.getChatLogs(10)).toContain('Kakita Toshimoko: 4 vs 8: Doji Challenger');
            });
        });

        describe('blanking', function() {
            it('should require a particiapting duelist', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.pass();

                this.player1.clickCard(this.strike);
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).toBeAbleToSelect(this.challenger);
                this.player1.clickCard(this.toshimoko);

                expect(this.getChatLogs(5)).toContain('player1 plays Strike of Flowing Water to treat Kakita Toshimoko as if its printed text box were blank until the end of the conflict');
            });

            it('should not work without a participating duelist', function() {
                let honor1 = this.player1.honor;
                let honor2 = this.player2.honor;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.whisperer],
                    defenders: [this.toshimoko]
                });

                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.strike);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
