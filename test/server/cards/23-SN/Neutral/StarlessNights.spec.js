describe('Starless Nights', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    hand: ['starless-nights']
                },
                player2: {
                }
            });
            this.writtenInTheStars = this.player1.findCardByName('starless-nights');
            this.player1.claimRing('air');
            this.game.rings.earth.fate = 1;
            this.game.rings.void.fate = 2;
        });

        it('should place 1 fate on each unclaimed ring if chosen', function () {
            this.player1.clickCard(this.writtenInTheStars);
            expect(this.game.rings.air.fate).toBe(0);
            expect(this.game.rings.fire.fate).toBe(1);
            expect(this.game.rings.earth.fate).toBe(2);
            expect(this.game.rings.void.fate).toBe(3);
            expect(this.game.rings.water.fate).toBe(1);
            expect(this.getChatLogs(1)).toContain('player1 plays Starless Nights to place 1 fate on Earth Ring, Fire Ring, Void Ring and Water Ring');
        });
    });
});
