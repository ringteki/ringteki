describe('Mantis Raider', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['mantis-raider']
                }
            });

            this.mantisRaider = this.player1.findCardByName('mantis-raider');
            this.game.rings.air.fate = 1;
        });

        it('should not work outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.mantisRaider);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should be able to trigger in a conflict when there is a ring with fate and gain all fate from it', function() {
            let initialFate = this.player1.fate;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mantisRaider],
                defenders: [],
                type: 'military',
                ring: 'fire'
            });

            this.player2.pass();
            this.player1.clickCard(this.mantisRaider);
            expect(this.player1).toHavePrompt('Choose a ring to gain all fate from');

            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('water');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('earth');
            expect(this.player1).not.toBeAbleToSelectRing('void');

            this.player1.clickRing('air');
            expect(this.player1.fate).toBe(initialFate + 1);
            expect(this.game.rings.air.fate).toBe(0);
            expect(this.getChatLogs(3)).toContain('player1 uses Mantis Raider to take 1 fate from Air Ring');
        });
    });
});
