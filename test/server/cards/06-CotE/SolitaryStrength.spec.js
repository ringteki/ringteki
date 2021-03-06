describe('Solitary Strength', function() {
    integration(function() {
        describe('Solitary Strength\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune','serene-warrior'],
                        hand: ['solitary-strength'],
                        dynastyDeck: ['favorable-ground'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        honor: 10
                    }
                });
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.solitaryStrength = this.player1.findCardByName('solitary-strength');
                this.warrior = this.player1.findCardByName('serene-warrior');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.scout = this.player2.findCardByName('eager-scout');
            });

            it('should work if you attach it out of a conflict', function() {
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should correctly give 1 honor after winning a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shiba-tsukune'],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.solitaryStrength);
                this.player1.clickCard(this.solitaryStrength);
                expect(this.player1.honor).toBe(11);
            });

            it('should be discarded if character is not participating alone', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shiba-tsukune'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.warrior);
                expect(this.solitaryStrength.location).toBe('conflict discard pile');
            });

            it('should be immediately discarded after being played if attached character is not participating alone', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shiba-tsukune'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.warrior);
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                expect(this.solitaryStrength.location).toBe('conflict discard pile');
            });

            it('attach to opponent - should immediately discard if you control a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shiba-tsukune'],
                    defenders: ['eager-scout']
                });
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.scout);
                expect(this.solitaryStrength.location).toBe('conflict discard pile');
            });
        });
    });
});
