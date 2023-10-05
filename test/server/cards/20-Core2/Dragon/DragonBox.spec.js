describe('Dragon Box', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'dragon-box'
                },
                player2: {}
            });
            this.dragonBox = this.player1.findCardByName('dragon-box');

            this.game.rings.air.fate = 2;
            this.game.rings.earth.fate = 1;
            this.game.rings.fire.fate = 0;
            this.game.rings.void.fate = 1;
            this.game.rings.water.fate = 2;
        });

        it('puts fate on a ring', function () {
            this.player1.clickCard(this.dragonBox);
            this.player1.clickRing('fire');
            expect(this.game.rings.fire.fate).toBe(1);
            expect(this.getChatLogs(3)).toContain(
                'player1 uses Dragon Box, bowing Dragon Box to examine the mysteries of the Fire Ring in search for guidance, placing 1 fate on that ring'
            );
        });

        it('moves fate to a ring', function () {
            this.player1.clickCard(this.dragonBox);
            this.player1.clickRing('water');
            this.player1.clickRing('air');
            expect(this.game.rings.water.fate).toBe(1);
            expect(this.game.rings.air.fate).toBe(3);
            expect(this.getChatLogs(3)).toContain(
                'player1 uses Dragon Box, bowing Dragon Box to examine the mysteries of the Water Ring in search for guidance'
            );
            expect(this.getChatLogs(3)).toContain('player1 moves 1 fate from the Water Ring to the Air Ring');
        });
    });
});
