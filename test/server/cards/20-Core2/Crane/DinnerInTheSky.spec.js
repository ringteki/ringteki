describe('Dinner in the Sky', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'giver-of-gifts']
                },
                player2: {
                    inPlay: ['togashi-initiate', 'togashi-yokuni'],
                    provinces: ['dinner-in-the-sky']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.giverOfGifts = this.player1.findCardByName('giver-of-gifts');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');

            this.dinnerInTheSky = this.player2.findCardByName('dinner-in-the-sky', 'province 1');
        });

        it('bows a character with low political during a political conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.aggressiveMoto, this.giverOfGifts],
                defenders: [this.yokuni, this.initiate],
                province: this.dinnerInTheSky
            });

            this.player2.clickCard(this.dinnerInTheSky);
            expect(this.player2).toBeAbleToSelect(this.aggressiveMoto);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).not.toBeAbleToSelect(this.yokuni);
            expect(this.player2).not.toBeAbleToSelect(this.giverOfGifts);

            this.player2.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player2 uses Dinner in the Sky to bow Aggressive Moto');
        });

        it('bows a character with low political during a military conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.aggressiveMoto, this.giverOfGifts],
                defenders: [this.yokuni, this.initiate],
                province: this.dinnerInTheSky
            });

            this.player2.clickCard(this.dinnerInTheSky);
            expect(this.player2).toBeAbleToSelect(this.aggressiveMoto);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).not.toBeAbleToSelect(this.yokuni);
            expect(this.player2).not.toBeAbleToSelect(this.giverOfGifts);

            this.player2.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player2 uses Dinner in the Sky to bow Aggressive Moto');
        });
    });
});
