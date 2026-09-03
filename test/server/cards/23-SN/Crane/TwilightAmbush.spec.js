describe('Twilight Ambush', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-shadows', 'solemn-scholar'],
                    hand: ['twilight-ambush']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'doji-challenger'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai']
                }
            });

            this.adept = this.player1.findCardByName('adept-of-shadows');
            this.solemnScholar = this.player1.findCardByName('solemn-scholar');
            this.ambush = this.player1.findCardByName('twilight-ambush');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.kuwanan.fate = 5;
            this.challenger.fate = 1;
        });

        it('sacrifice a dishonored character to injure', function () {
            this.solemnScholar.dishonor();
            this.kuwanan.dishonor();

            let fate = this.kuwanan.fate;

            this.player1.clickCard(this.ambush);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).not.toBeAbleToSelect(this.adept);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.solemnScholar);

            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.kuwanan);

            expect(this.kuwanan.fate).toBe(fate - 1);
            expect(this.getChatLogs(5)).toContain('player1 plays Twilight Ambush, sacrificing Solemn Scholar to injure Doji Kuwanan');
            expect(this.getChatLogs(5)).not.toContain('Doji Kuwanan is injured again because Solemn Scholar is a Shinobi');
        });

        it('sacrifice a dishonored Shinobi to injure twice', function () {
            this.adept.dishonor();
            this.kuwanan.dishonor();

            let fate = this.kuwanan.fate;

            this.player1.clickCard(this.ambush);
            this.player1.clickCard(this.adept);
            this.player1.clickCard(this.kuwanan);

            expect(this.kuwanan.fate).toBe(fate - 2);
            expect(this.getChatLogs(5)).toContain('player1 plays Twilight Ambush, sacrificing Adept of Shadows to injure Doji Kuwanan');
            expect(this.getChatLogs(5)).toContain('Doji Kuwanan is injured again because Adept of Shadows is a Shinobi');
        });

        it('remove fate and discard', function () {
            this.adept.dishonor();
            this.challenger.dishonor();

            this.player1.clickCard(this.ambush);
            this.player1.clickCard(this.adept);
            this.player1.clickCard(this.challenger);

            expect(this.challenger.fate).toBe(0);
            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Twilight Ambush, sacrificing Adept of Shadows to injure Doji Challenger');
            expect(this.getChatLogs(5)).toContain('Doji Challenger is injured again because Adept of Shadows is a Shinobi');
        });

        it('shinobi but first injure discards', function () {
            this.adept.dishonor();
            this.challenger.dishonor();
            this.challenger.fate = 0;

            this.player1.clickCard(this.ambush);
            this.player1.clickCard(this.adept);
            this.player1.clickCard(this.challenger);

            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Twilight Ambush, sacrificing Adept of Shadows to injure Doji Challenger');
        });
    });
});
