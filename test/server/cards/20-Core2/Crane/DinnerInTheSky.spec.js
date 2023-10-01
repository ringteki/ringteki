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

        it('if no defenders, readies & moves a character you control to the conflict', function () {
            this.yokuni.bow();

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.dinnerInTheSky
            });

            expect(this.yokuni.bowed).toBe(true);
            expect(this.game.currentConflict.defenders).not.toContain(this.yokuni);

            this.player2.clickCard(this.dinnerInTheSky);
            expect(this.player2).not.toBeAbleToSelect(this.aggressiveMoto);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).toBeAbleToSelect(this.yokuni);
            expect(this.player2).not.toBeAbleToSelect(this.giverOfGifts);

            this.player2.clickCard(this.yokuni);
            expect(this.yokuni.bowed).toBe(false);
            expect(this.game.currentConflict.defenders).toContain(this.yokuni);
            expect(this.getChatLogs(3)).toContain('player2 uses Dinner in the Sky to ready Togashi Yokuni and move it into the conflict');
        });

        it('if defenders, should not trigger', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.aggressiveMoto, this.giverOfGifts],
                defenders: [this.initiate],
                province: this.dinnerInTheSky
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.dinnerInTheSky);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
