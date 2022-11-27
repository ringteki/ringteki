describe('Mantis Raider', function () {
    integration(function () {
        describe('action ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mantis-raider']
                    }
                });

                this.mantisRaider = this.player1.findCardByName('mantis-raider');

                this.game.rings.earth.fate = 2;
                this.game.rings.fire.fate = 1;
            });

            it('should not trigger outside a conflict', function () {
                this.player1.clickCard(this.mantisRaider);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should allow you to select rings with fate when triggered', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mantisRaider],
                    defenders: [],
                    ring: 'air',
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.mantisRaider);

                expect(this.player1).toHavePrompt('Choose a ring');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('air');
                expect(this.player1).not.toBeAbleToSelectRing('water');
            });

            it('should take all the fate of the ring when triggered', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mantisRaider],
                    defenders: [],
                    ring: 'air',
                    type: 'military'
                });

                const initialFate = this.player1.fate;
                this.player2.pass();
                this.player1.clickCard(this.mantisRaider);
                this.player1.clickRing('earth');
                expect(this.player1.fate).toBe(initialFate + 2); //2 ring fate on earth
            });
        });
    });
});