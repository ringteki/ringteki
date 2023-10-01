describe('Crab Box', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',

                player1: {
                    inPlay: ['brash-samurai'],
                    hand: ['a-perfect-cut']
                },
                player2: {
                    inPlay: ['tattooed-wanderer'],
                    hand: ['banzai'],
                    stronghold: ['crab-box']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.aPerfectCut = this.player1.findCardByName('a-perfect-cut');

            this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
            this.banzai = this.player2.findCardByName('banzai');

            this.crabBox = this.player2.findCardByName('crab-box');
        });

        it('cancels the action from the attacker', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: [this.tattooedWanderer]
            });

            this.player2.pass();
            this.player1.clickCard(this.brashSamurai);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.crabBox);

            this.player2.clickCard(this.crabBox);
            expect(this.brashSamurai.isHonored).toBe(false);
            expect(this.getChatLogs(3)).toContain("player2 uses Crab Box, bowing Crab Box and spending 1 fate to cancel the effects of Brash Samurai's ability");
        });

        it('does not cancel the action from the attacker if no defenders', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.brashSamurai);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.crabBox);
            expect(this.brashSamurai.isHonored).toBe(true);
        });
    });
});