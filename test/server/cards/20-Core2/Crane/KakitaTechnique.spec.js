describe('Kakita Technique', function() {
    integration(function() {
        describe('Duel Focus', function () {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 20,
                        inPlay: ['doji-kuwanan', 'doji-whisperer'],
                        hand: ['a-fate-worse-than-death', 'kakita-technique'],
                        dynastyDiscard: ['awakened-tsukumogami']
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['embrace-the-void', 'policy-debate']
                    }
                });

                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.technique = this.player1.findCardByName('kakita-technique')
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.pd = this.player2.findCardByName('policy-debate');
            });

            it('should react appropriately', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuwanan, this.whisperer],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.kuwanan);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.technique);
            });

            it('should apply +glory to the duel result and prompt opponent to do the same', function() {
                let honor = this.player1.honor;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuwanan],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.kuwanan);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.player1.clickCard(this.technique);

                expect(this.player2).toHavePrompt('Let opponent gain 2 honor to resolve Kakita Technique?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');

                this.player2.clickPrompt('Yes');

                expect(this.getChatLogs(10)).toContain('player2 chooses to resolve Kakita Technique. player1 will gain 2 honor');
                expect(this.getChatLogs(10)).toContain('player1 plays Kakita Technique to focus, adding glory to their duel total');
                expect(this.getChatLogs(10)).toContain('player1 gives Doji Kuwanan 3 bonus skill for this duel');
                expect(this.getChatLogs(10)).toContain('player2 gives Kakita Toshimoko 2 bonus skill for this duel');
                expect(this.getChatLogs(10)).toContain('Kakita Toshimoko: 6 vs 8: Doji Kuwanan');

                expect(this.player1).toHavePrompt('Policy Debate');
                expect(this.player1.honor).toBe(honor + 2);
            });

            it('choosing no', function() {
                let honor = this.player1.honor;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuwanan],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.kuwanan);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.player1.clickCard(this.technique);

                expect(this.player2).toHavePrompt('Let opponent gain 2 honor to resolve Kakita Technique?');
                this.player2.clickPrompt('No');

                expect(this.getChatLogs(10)).toContain('player2 chooses not to resolve Kakita Technique');
                expect(this.getChatLogs(10)).toContain('player1 plays Kakita Technique to focus, adding glory to their duel total');
                expect(this.getChatLogs(10)).toContain('player1 gives Doji Kuwanan 3 bonus skill for this duel');
                expect(this.getChatLogs(10)).toContain('Kakita Toshimoko: 4 vs 8: Doji Kuwanan');

                expect(this.player1).toHavePrompt('Policy Debate');
                expect(this.player1.honor).toBe(honor);
            });
        });

        describe('Non duel effect', function () {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 20,
                        inPlay: ['doji-kuwanan', 'doji-whisperer'],
                        hand: ['a-fate-worse-than-death', 'kakita-technique'],
                        dynastyDiscard: ['awakened-tsukumogami']
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['embrace-the-void', 'policy-debate']
                    }
                });

                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.technique = this.player1.findCardByName('kakita-technique')
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.pd = this.player2.findCardByName('policy-debate');
            });

            it('should give +2/+2 if you dont outnumber the opponent', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuwanan],
                    defenders: [this.toshimoko]
                });
                this.player2.pass();

                this.player1.clickCard(this.technique);
                this.player1.clickCard(this.kuwanan);

                expect(this.getChatLogs(5)).toContain('player1 plays Kakita Technique to give Doji Kuwanan +2military and +2political');
            });

            it('should not give +2/+2 if you outnumber the opponent', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuwanan, this.whisperer],
                    defenders: [this.toshimoko]
                });
                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.technique);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
