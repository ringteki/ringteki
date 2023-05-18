describe('Travertine Deposits', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-horde'],
                    provinces: ['pilgrimage']
                },
                player2: {
                    provinces: ['travertine-deposits', 'toshi-ranbo']
                }
            });
            this.horde = this.player1.findCardByName('moto-horde');
            this.pilgrimage = this.player1.findCardByName('pilgrimage');

            this.travertineDeposits = this.player2.findCardByName('travertine-deposits');
            this.toshiRanbo = this.player2.findCardByName('toshi-ranbo');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.travertineDeposits,
                attackers: [this.horde],
                defenders: []
            });
        });

        it('blanks and reveal a province', function () {
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');

            this.player2.clickCard(this.travertineDeposits);
            expect(this.player2).toHavePrompt('Choose a province');
            expect(this.player2).toBeAbleToSelect(this.pilgrimage);
            expect(this.player2).toBeAbleToSelect(this.toshiRanbo);

            this.player2.clickCard(this.pilgrimage);

            expect(this.pilgrimage.isDishonored).toBe(true);
            expect(this.pilgrimage.facedown).toBe(false);

            expect(this.getChatLogs(5)).toContain(
                'player2 uses Travertine Deposits to place a dishonored status token on province 1, blanking it'
            );
            expect(this.getChatLogs(5)).toContain('player2 reveals Pilgrimage due to Travertine Deposits');
            expect(this.getChatLogs(5)).toContain('player1 has broken Travertine Deposits!');
        });
    });
});
