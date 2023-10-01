describe('Breath of Suitengu', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['breath-of-suitengu', 'stride-the-waves'],
                    inPlay: ['adept-of-the-waves', 'solemn-scholar']
                },
                player2: {
                    inPlay: ['prodigy-of-the-waves'],
                    dynastyDiscard: ['favorable-ground']
                }
            });

            this.breathOfSuitengu = this.player1.findCardByName('breath-of-suitengu');
            this.strideTheWaves = this.player1.findCardByName('stride-the-waves');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.solemn = this.player1.findCardByName('solemn-scholar');
            this.adept.bow();
            this.solemn.bow();

            this.shamefulDisplayP1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.shamefulDisplayP2 = this.player2.findCardByName('shameful-display', 'province 1');
            this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');

            this.player1.playAttachment(this.strideTheWaves, this.solemn);
            this.player2.pass();
        });

        it('with affinity, it readies a character and flushes a province', function () {
            this.player1.clickCard(this.breathOfSuitengu);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.adept);
            expect(this.player1).toBeAbleToSelect(this.solemn);

            this.player1.clickCard(this.adept);
            expect(this.adept.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Breath of Suitengu to ready Adept of the Waves');
            expect(this.player1).toHavePrompt('Discard all cards from a province?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');

            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Choose a province');
            expect(this.player1).toBeAbleToSelect(this.shamefulDisplayP1);
            expect(this.player1).toBeAbleToSelect(this.shamefulDisplayP2);
            this.player1.clickCard(this.shamefulDisplayP2);

            expect(this.favorableGround.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 discards Favorable Ground');
        });

        it('without affinity, it readies a character and flushes a province', function () {
            this.player1.moveCard(this.adept, 'dynasty discard pile');

            this.player1.clickCard(this.breathOfSuitengu);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toBeAbleToSelect(this.adept);
            expect(this.player1).toBeAbleToSelect(this.solemn);

            this.player1.clickCard(this.solemn);
            expect(this.solemn.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Breath of Suitengu to ready Solemn Scholar');
            expect(this.player1).not.toHavePrompt('Discard all cards from a province?');
            expect(this.player1).not.toHavePromptButton('Yes');
            expect(this.player1).not.toHavePromptButton('No');
        });
    });
});
