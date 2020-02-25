describe('Hallowed Ground', function() {
    integration(function() {
        describe('Hallowed Grounds\' fire ring ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['hallowed-ground']
                    },
                    player2: {
                        hand: ['steward-of-law']
                    }
                });
                this.player1.placeCardInProvince('hallowed-ground', 'province 1');
                this.steward = this.player2.findCardByName('steward-of-law');
                this.player1.pass();
            });

            it('it should not do anything if the opponent does not have the fire ring', function() {
                this.player2.clickCard(this.steward);
                expect(this.player2).toHavePrompt('Steward of Law');
                this.player2.clickPrompt('1');
                expect(this.steward.fate).toBe(1);
            });

            it('should stop the player if they have the fire ring', function() {
                this.player2.claimRing('fire');
                this.game.checkGameState(true);
                this.player2.clickCard(this.steward);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.steward.fate).toBe(0);
            });
        });
    });
});
