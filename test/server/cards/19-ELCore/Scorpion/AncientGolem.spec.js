describe('Ancient Golem', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-archer', 'isawa-tadaka']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'ancient-golem'],
                    hand: ['assassination']
                }
            });

            this.shinjoArcher = this.player1.findCardByName('shinjo-archer');
            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.ancientGolem = this.player2.findCardByName('ancient-golem');
            this.assassination = this.player2.findCardByName('assassination');
        });

        it('should be able to trigger for the opponent when it leaves play', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjoArcher],
                defenders: [this.solemnScholar],
                type: 'military'
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.ancientGolem);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ancientGolem);

            let initialHandSize = this.player1.hand.length;

            this.player1.clickCard(this.ancientGolem);
            expect(this.player1).toHavePrompt('Select character to dishonor');
            expect(this.player1).toBeAbleToSelect(this.shinjoArcher);
            expect(this.player1).toBeAbleToSelect(this.isawaTadaka);
            expect(this.player1).not.toBeAbleToSelect(this.ancientGolem);
            expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);

            this.player1.clickCard(this.shinjoArcher);
            expect(this.shinjoArcher.isDishonored).toBe(true);
            expect(this.player1.hand.length).toBe(initialHandSize+1);
            expect(this.getChatLogs(3)).toContain('player1 uses Ancient Golem, dishonoring Shinjo Archer to draw 1 card');
        });

        it('should be able to trigger for both players when it leaves play', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjoArcher],
                defenders: [this.solemnScholar],
                type: 'military'
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.ancientGolem);

            this.player1.clickCard(this.ancientGolem);
            this.player1.clickCard(this.shinjoArcher);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.ancientGolem);

            let initialHandSize = this.player2.hand.length;

            this.player2.clickCard(this.ancientGolem);
            expect(this.player2).toHavePrompt('Select character to dishonor');
            expect(this.player2).not.toBeAbleToSelect(this.shinjoArcher);
            expect(this.player2).not.toBeAbleToSelect(this.isawaTadaka);
            expect(this.player2).toBeAbleToSelect(this.ancientGolem);
            expect(this.player2).toBeAbleToSelect(this.solemnScholar);

            this.player2.clickCard(this.ancientGolem);
            expect(this.shinjoArcher.isDishonored).toBe(true);
            expect(this.player2.hand.length).toBe(initialHandSize+1);
            expect(this.getChatLogs(5)).toContain('player2 uses Ancient Golem, dishonoring Ancient Golem to draw 1 card');
            expect(this.ancientGolem.location).toBe('dynasty discard pile');
        });

        it('should not be able to declare as an attacker ', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.ancientGolem, this.solemnScholar],
                defenders: []
            });
            expect(this.game.currentConflict.attackers).toContain(this.solemnScholar);
            expect(this.game.currentConflict.attackers).not.toContain(this.ancientGolem);
        });
    });
});
