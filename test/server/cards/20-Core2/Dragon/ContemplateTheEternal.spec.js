describe('Contemplate the Eternal', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate', 'doomed-shugenja'],
                    hand: ['contemplate-the-eternal']
                },
            });
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.contemplate = this.player1.findCardByName('contemplate-the-eternal');
            this.player1.claimRing('air');
            this.player1.claimRing('earth');
            this.player1.claimRing('void');

        });

        it('puts fate on a character', function() {
            this.player1.clickCard(this.contemplate);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.initiate);
            expect(this.player1).not.toBeAbleToSelect(this.doomed);

            this.player1.clickCard(this.initiate);
            expect(this.player1).toHavePrompt('Choose a ring to return');
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('earth');
            expect(this.player1).toBeAbleToSelectRing('void');


            this.player1.clickRing('air');
            this.player1.clickRing('earth');
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Done');
            expect(this.initiate.fate).toBe(2);
            expect(this.getChatLogs(3)).toContain("player1 plays Contemplate the Eternal, returning the Air Ring and Earth Ring to place 2 fate on Togashi Initiate");
        });
    });
});

