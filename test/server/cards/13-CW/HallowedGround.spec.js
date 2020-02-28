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

        describe('Hallowed Grounds\' air ring ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden'],
                        dynastyDiscard: ['hallowed-ground']
                    },
                    player2: {
                        honor: 11
                    }
                });
                this.player1.placeCardInProvince('hallowed-ground', 'province 1');
                this.maiden = this.player1.findCardByName('shrine-maiden');
                this.startingHonor = this.player2.honor;
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.maiden],
                    defenders: []
                });
            });

            it('it should not do anything if the opponent does not have the air ring', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.player2.honor).toBe(this.startingHonor - 1);
            });

            it('it should cause one more honor lost if they have the air ring', function() {
                this.player2.claimRing('air');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.player2.honor).toBe(this.startingHonor - 2);
            });
        });
    });
});
