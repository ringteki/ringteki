describe('Manipulative Scout', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['manipulative-scout', 'adept-of-the-waves', 'solemn-scholar']
                },
                player2: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai']
                }
            });

            this.sd1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.scout = this.player1.findCardByName('manipulative-scout');
            this.adeptOfTheWaves1 = this.player1.findCardByName('adept-of-the-waves', 'province 1');
            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves', 'play area');
            this.solemnScholar = this.player1.findCardByName('solemn-scholar');

            this.player1.moveCard(this.adeptOfTheWaves, 'province 1');
            this.player2.moveCard(this.solemnScholar, 'province 1');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');

            this.adeptOfTheWaves1.facedown = true;
            this.adeptOfTheWaves.facedown = true;
            this.solemnScholar.facedown = true;
        });

        it('turn faceup', function () {
            this.player1.clickCard(this.scout);
            expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
            expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves1);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.solemnScholar);
            expect(this.getChatLogs(5)).toContain('player1 uses Manipulative Scout to reveal the facedown card in province 1');
        });

        it('turn facedown', function () {
            this.solemnScholar.facedown = false;
            this.player1.clickCard(this.scout);
            expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
            expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves1);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.solemnScholar);
            expect(this.getChatLogs(5)).toContain('player1 uses Manipulative Scout to turn Solemn Scholar facedown');
        });
    });
});
