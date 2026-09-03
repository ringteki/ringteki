describe('Usogawa Toko', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['usogawa-toko', 'adept-of-shadows']
                },
                player2: {
                    inPlay: ['akodo-toturi'],
                    provinces: ['kuroi-mori']
                }
            });
            this.toko = this.player1.findCardByName('usogawa-toko');
            this.shadows = this.player1.findCardByName('adept-of-shadows');
            this.toturi = this.player2.findCardByName('akodo-toturi');
        });

        it('should not work if he is not participating', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.shadows],
                defenders: [this.toturi]
            });

            this.player2.pass();
            this.player1.clickCard(this.toko);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('happy path', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.toko],
                defenders: [this.toturi]
            });

            this.player2.pass();
            this.player1.clickCard(this.toko);
            expect(this.player1).toBeAbleToSelect(this.toko);
            expect(this.player1).toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.shadows);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.glory).toBe(0);

            expect(this.getChatLogs(10)).toContain('player1 uses Usogawa Toko to give Akodo Toturi -3 glory until the end of the conflict');

            this.noMoreActions();
            this.player2.clickPrompt('Pass');
            expect(this.toturi.glory).toBe(3);
        });
    });
});
