describe('Confirmed Suspicions', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['prodigy-of-the-waves', 'kaito-kosori', 'keeper-initiate']
                },
                player2: {
                    hand: ['confirmed-suspicions'],
                    inPlay: ['adept-of-the-waves', 'solemn-scholar']
                }
            });

            this.keeper = this.player1.findCardByName('keeper-initiate');
            this.prodigy = this.player1.findCardByName('prodigy-of-the-waves');
            this.kosoriTainted = this.player1.findCardByName('kaito-kosori');
            this.kosoriTainted.taint();

            this.suspicions = this.player2.findCardByName('confirmed-suspicions');
            this.adept = this.player2.findCardByName('adept-of-the-waves');
            this.solemn = this.player2.findCardByName('solemn-scholar');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.prodigy, this.kosoriTainted],
                defenders: [this.adept],
                type: 'political'
            });
        });

        it('taints a participating character', function () {
            this.player2.clickCard(this.suspicions);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.prodigy);
            expect(this.player2).not.toBeAbleToSelect(this.kosoriTainted);
            expect(this.player2).toBeAbleToSelect(this.adept);
            expect(this.player2).not.toBeAbleToSelect(this.solemn);
            expect(this.player2).not.toBeAbleToSelect(this.keeper);

            this.player2.clickCard(this.prodigy);
            expect(this.prodigy.isTainted).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 plays Confirmed Suspicions to taint Prodigy of the Waves');
        });

        it('with affinity, it can bow that character', function () {
            this.player2.clickCard(this.suspicions);
            this.player2.clickCard(this.prodigy);
            expect(this.player2).toHavePrompt('Bow that character?');
            expect(this.player2).toHavePromptButton('Yes');
            expect(this.player2).toHavePromptButton('No');

            this.player2.clickPrompt('Yes');
            expect(this.prodigy.bowed).toBe(true);
        });
    });
});
