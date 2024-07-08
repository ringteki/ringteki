describe('Temple of the Fivefold Path', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'temple-of-the-fivefold-path'
                },
                player2: {}
            });
            this.t5p = this.player1.findCardByName('temple-of-the-fivefold-path');

            this.game.rings.air.fate = 2;
            this.game.rings.earth.fate = 1;
            this.game.rings.fire.fate = 0;
            this.game.rings.void.fate = 1;
            this.game.rings.water.fate = 2;
        });

        it('puts fate on a ring', function () {
            this.player1.clickCard(this.t5p);
            expect(this.player1).toHavePrompt('Temple of the Fivefold Path');
            expect(this.player1).toHavePromptButton('Place fate on a ring without fate');
            expect(this.player1).toHavePromptButton('Move 1 fate from one ring to another');

            this.player1.clickPrompt('Place fate on a ring without fate');
            expect(this.player1).not.toBeAbleToSelectRing('void');
            expect(this.player1).not.toBeAbleToSelectRing('water');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('earth');

            this.player1.clickRing('fire');
            expect(this.game.rings.fire.fate).toBe(1);
            expect(this.getChatLogs(3)).toContain(
                'player1 uses Temple of the Fivefold Path, bowing Temple of the Fivefold Path to place 1 fate on Fire Ring'
            );
        });

        it('moves fate between rings', function () {
            this.player1.clickCard(this.t5p);
            expect(this.player1).toHavePrompt('Temple of the Fivefold Path');
            expect(this.player1).toHavePromptButton('Place fate on a ring without fate');
            expect(this.player1).toHavePromptButton('Move 1 fate from one ring to another');

            this.player1.clickPrompt('Move 1 fate from one ring to another');
            expect(this.player1).toHavePrompt('Choose a ring to lose fate');
            expect(this.player1).toBeAbleToSelectRing('void');
            expect(this.player1).toBeAbleToSelectRing('water');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('earth');

            this.player1.clickRing('air');
            expect(this.player1).toHavePrompt('Choose a ring to gain fate');
            expect(this.player1).toBeAbleToSelectRing('void');
            expect(this.player1).toBeAbleToSelectRing('water');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('earth');

            this.player1.clickRing('water');
            expect(this.game.rings.air.fate).toBe(1);
            expect(this.game.rings.water.fate).toBe(3);
            expect(this.getChatLogs(3)).toContain(
                'player1 uses Temple of the Fivefold Path, bowing Temple of the Fivefold Path to move 1 fate from Air Ring to Water Ring'
            );
        });
    });
});