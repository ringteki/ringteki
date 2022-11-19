describe('Vigilant Guardian', function () {
    integration(function () {
        describe('Vigilant Guardian\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law'],
                        dynastyDiscard: ['iuchi-soulweaver', 'iuchi-soulweaver']
                    },
                    player2: {
                        inPlay: ['vigilant-guardian'],
                        hand: ['rout']
                    }
                });

                this.steward = this.player1.findCardByName('steward-of-law');
                this.soulweaver1 =
                    this.player1.filterCardsByName('iuchi-soulweaver')[0];
                this.soulweaver2 =
                    this.player1.filterCardsByName('iuchi-soulweaver')[1];

                this.vigilantGuardian =
                    this.player2.findCardByName('vigilant-guardian');
                this.rout = this.player2.findCardByName('rout');
                this.noMoreActions();
            });

            it('bows when defending vs an attacker', function () {
                this.initiateConflict({
                    attackers: [this.steward],
                    defenders: [this.vigilantGuardian]
                });
                this.noMoreActions();
                expect(this.vigilantGuardian.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('bows when defending vs an attack with characters that participate from home', function () {
                this.player1.putIntoPlay(this.soulweaver1);
                this.player1.putIntoPlay(this.soulweaver2);
                this.initiateConflict({
                    attackers: [this.steward],
                    defenders: [this.vigilantGuardian]
                });
                this.player2.clickCard(this.rout);
                this.player2.clickCard(this.steward);
                this.noMoreActions();
                expect(this.vigilantGuardian.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('does not bow when defending vs no attackers', function () {
                this.initiateConflict({
                    attackers: [this.steward],
                    defenders: [this.vigilantGuardian]
                });
                this.player2.clickCard(this.rout);
                this.player2.clickCard(this.steward);
                this.noMoreActions();
                expect(this.vigilantGuardian.bowed).toBe(false);
                expect(this.getChatLogs(5)).toContain('player2 attempts to initiate Banzai!, but Hida Kisada cancels it');
                expect(this.player1).toHavePrompt('Action Window');

            });
        });
    });
});
