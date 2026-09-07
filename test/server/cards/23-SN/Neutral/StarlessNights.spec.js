describe('Starless Nights', function () {
    integration(function () {
        describe('during the dynasty phase', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        hand: ['starless-nights']
                    },
                    player2: {
                    }
                });
                this.starlessNights = this.player1.findCardByName('starless-nights');
                this.player1.claimRing('air');
                this.game.rings.earth.fate = 1;
                this.game.rings.void.fate = 2;
            });

            it('cannot be played', function () {
                this.player1.clickCard(this.starlessNights);

                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.game.rings.water.fate).toBe(0);
                expect(this.game.rings.earth.fate).toBe(1);
                expect(this.game.rings.void.fate).toBe(2);
            });
        });

        describe('when the conflict phase begins', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        hand: ['starless-nights']
                    },
                    player2: {
                    }
                });
                this.starlessNights = this.player1.findCardByName('starless-nights');
                this.player1.claimRing('air');
                this.game.rings.earth.fate = 1;
                this.game.rings.void.fate = 2;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should place 1 fate on each unclaimed ring', function () {
                this.noMoreActions();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.starlessNights);
                this.player1.clickCard(this.starlessNights);

                expect(this.game.rings.air.fate).toBe(0);
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.game.rings.earth.fate).toBe(2);
                expect(this.game.rings.void.fate).toBe(3);
                expect(this.game.rings.water.fate).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 plays Starless Nights to place 1 fate on Earth Ring, Fire Ring, Void Ring and Water Ring');
            });
        });
    });
});
