describe('Dead Eyes Sensei', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'dead-eyes-sensei',
                        'one-of-the-forgotten',
                        'gallant-quartermaster',
                        'shrewd-yasuki',
                        'butcher-of-the-fallen'
                    ]
                }
            });

            this.deadEyesSensei = this.player1.findCardByName('dead-eyes-sensei');
            this.forgottenFateless = this.player1.findCardByName('one-of-the-forgotten');
            this.gallantFateless = this.player1.findCardByName('gallant-quartermaster');
            this.shrewdFated = this.player1.findCardByName('shrewd-yasuki');
            this.shrewdFated.fate = 1;
            this.butcherFated = this.player1.findCardByName('butcher-of-the-fallen');
            this.butcherFated.fate = 1;

            this.forgottenFateless.bow();
            this.gallantFateless.bow();
            this.shrewdFated.bow();
            this.butcherFated.bow();
        });

        it('only works on characters with fate', function () {
            this.player1.clickCard(this.deadEyesSensei);
            expect(this.player1).toHavePrompt('Select character to discard a fate from');
            expect(this.player1).not.toBeAbleToSelect(this.deadEyesSensei);
            expect(this.player1).not.toBeAbleToSelect(this.forgottenFateless);
            expect(this.player1).not.toBeAbleToSelect(this.gallantFateless);
            expect(this.player1).toBeAbleToSelect(this.shrewdFated);
            expect(this.player1).toBeAbleToSelect(this.butcherFated);
        });

        it('readies a character', function () {
            this.player1.clickCard(this.deadEyesSensei);
            this.player1.clickCard(this.butcherFated);

            expect(this.butcherFated.fate).toBe(0);
            expect(this.butcherFated.bowed).toBe(false);
            expect(this.butcherFated.hasTrait('berserker')).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Dead Eyes Sensei, removing 1 fate from Butcher of the Fallen to ready Butcher of the Fallen and give them Berserker'
            );
        });

        it('makes the character berserker', function () {
            this.player1.clickCard(this.deadEyesSensei);
            this.player1.clickCard(this.shrewdFated);

            expect(this.shrewdFated.fate).toBe(0);
            expect(this.shrewdFated.bowed).toBe(false);
            expect(this.shrewdFated.hasTrait('berserker')).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Dead Eyes Sensei, removing 1 fate from Shrewd Yasuki to ready Shrewd Yasuki and give them Berserker'
            );
        });
    });
});
