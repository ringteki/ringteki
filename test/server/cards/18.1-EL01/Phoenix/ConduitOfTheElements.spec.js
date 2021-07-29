describe('One With the Sea', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['conduit-of-the-elements']
                },
                player2: {
                    inPlay: []
                }
            });

            this.conduit = this.player1.findCardByName('conduit-of-the-elements');
            this.player1.claimRing('fire');
            this.player2.claimRing('water');
        });

        it('should prompt you to select a ring you have claimed', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.conduit],
                defenders: [],
                ring: 'air'
            });
            this.player2.pass();
            this.player1.clickCard(this.conduit);
            expect(this.player1).not.toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('earth');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('water');
            expect(this.player1).not.toBeAbleToSelectRing('void');
        });

        it('should swap the ring', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.conduit],
                defenders: [],
                ring: 'air'
            });
            this.player2.pass();
            expect(this.game.currentConflict.ring.element).toBe('air');
            this.player1.clickCard(this.conduit);
            this.player1.clickRing('fire');
            expect(this.game.currentConflict.ring.element).toBe('fire');
            expect(this.getChatLogs(5)).toContain('player1 uses Conduit of the Elements to switch the contested ring with the Fire Ring');
        });
    });
});
