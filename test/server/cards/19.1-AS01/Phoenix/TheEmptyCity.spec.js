describe('The Empty City', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    provinces: ['the-empty-city', 'manicured-garden'],
                    dynastyDiscard: ['bayushi-liar', 'isawa-tadaka']
                }
            });

            this.theEmptyCity = this.player1.findCardByName('the-empty-city', 'province 1');
            this.manaicuredGarden = this.player1.findCardByName('manicured-garden', 'province 2');
            this.bayushiLiar = this.player1.placeCardInProvince('bayushi-liar', 'province 1');
            this.tadaka = this.player1.placeCardInProvince('isawa-tadaka', 'province 2');

            this.player1.claimRing('earth');
            this.player2.claimRing('water');
        });

        it('should react to a character being played from The Empty City', function() {
            this.player1.clickCard(this.bayushiLiar);
            this.player1.clickPrompt('1');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.theEmptyCity);
        });

        it('should not react to a character being played from another province', function() {
            this.player1.clickCard(this.tadaka);
            this.player1.clickPrompt('1');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.theEmptyCity);
        });

        it('should let the player choose an unclaimed ring', function() {
            this.player1.clickCard(this.bayushiLiar);
            this.player1.clickPrompt('1');
            this.player1.clickCard(this.theEmptyCity);
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('void');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('earth');
            expect(this.player1).not.toBeAbleToSelectRing('water');
        });

        it('should claim the ring without claiming fate', function() {
            this.game.rings.air.fate = 1;
            let initialFate = this.player1.fate;

            this.player1.clickCard(this.bayushiLiar);
            this.player1.clickPrompt('1');
            this.player1.clickCard(this.theEmptyCity);
            this.player1.clickRing('air');

            expect(this.game.rings.air.fate).toBe(1);
            expect(this.player1.fate).toBe(initialFate - 2); // -2 from liar without gaining 1 from the ring
            expect(this.getChatLogs(3)).toContain('player1 uses The Empty City to claim Air Ring');
        });
    });
});
