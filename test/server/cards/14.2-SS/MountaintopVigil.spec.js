describe('Mountaintop Vigil', function() {
    integration(function() {
        describe('Mountaintop Vigil\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune'],
                        hand: ['seeker-of-knowledge', 'fine-katana', 'charge']
                    },
                    player2: {
                        provinces: ['pilgrimage', 'toshi-ranbo', 'manicured-garden'],
                        inPlay: ['garanto-guardian'],
                        hand: ['mountaintop-vigil']
                    }
                });

                this.guardian = this.player2.findCardByName('garanto-guardian');
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.vigil = this.player2.findCardByName('mountaintop-vigil');
                this.noMoreActions();
            });

            it('should stop the ring effect from the conflict', function() {
                this.initiateConflict({
                    province: 'manicured-garden',
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.tsukune],
                    defenders: [this.guardian]
                });
                this.player2.clickCard(this.vigil);
                this.player1.pass();
                this.player2.pass();
                this.player1.clickCard(this.tsukune);
                this.player1.clickPrompt('Honor Shiba Tsukune');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.game.rings.fire.isConsideredClaimed(this.player1)).toBe(true);
                expect(this.tsukune.isHonored).toBe(false);
            });
        });
    });
});
