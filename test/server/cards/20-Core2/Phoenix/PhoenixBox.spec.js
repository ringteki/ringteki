describe('Phoenix Box', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'phoenix-box',
                    inPlay: ['fushicho'],
                    hand: ['court-games']
                },
                player2: {}
            });
            this.phoenixBox = this.player1.findCardByName('phoenix-box');
            this.fushicho = this.player1.findCardByName('fushicho');
            this.courtGames = this.player1.findCardByName('court-games');
        });

        it('resolves an additional ring', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.fushicho],
                defenders: [],
                ring: 'air'
            });

            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 honor');
            expect(this.getChatLogs(3)).toContain('player1 resolves the air ring, gaining 2 honor');
            expect(this.player1).toHavePrompt('Any reactions?');

            this.player1.clickCard(this.phoenixBox);
            expect(this.player1).toHavePrompt('Choose a ring');

            this.player1.clickRing('fire');
            expect(this.player1).toHavePrompt('Select card to discard');

            this.player1.clickCard(this.courtGames);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Phoenix Box, bowing Phoenix Box and discarding Court Games to resolve Fire Ring effect'
            );
            expect(this.player1).toHavePrompt('Choose character to honor or dishonor');

            this.player1.clickCard(this.fushicho);
            this.player1.clickPrompt('Honor Fushichō');
            expect(this.fushicho.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 resolves the fire ring, honoring Fushichō');
        });
    });
});
