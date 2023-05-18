describe('Salar the Uyuni', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'worldly-shiotome', 'utaku-tetsuko']
                },
                player2: {
                    inPlay: ['togashi-initiate', 'togashi-yokuni'],
                    provinces: ['salar-de-uyuni']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.wordlyShiotome = this.player1.findCardByName('worldly-shiotome');
            this.tetsuko = this.player1.findCardByName('utaku-tetsuko');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');

            this.salarDeUyuni = this.player2.findCardByName('salar-de-uyuni', 'province 1');
        });

        it('dishonors a participating character', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni],
                province: this.salarDeUyuni
            });

            this.player2.clickCard(this.salarDeUyuni);
            expect(this.player2).toBeAbleToSelect(this.aggressiveMoto);
            expect(this.player2).toBeAbleToSelect(this.yokuni);
            expect(this.player2).not.toBeAbleToSelect(this.wordlyShiotome);
            expect(this.player2).not.toBeAbleToSelect(this.initiate);
            expect(this.player2).not.toBeAbleToSelect(this.tetsuko);

            this.player2.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.isDishonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player2 uses Salar de Uyuni to dishonor Aggressive Moto');
        });
    });
});
