describe('Shrug Off Despair', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-whisperer']
                },
                player2: {
                    provinces: ['shrug-off-despair', 'manicured-garden']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');

            this.shrugOffDespair = this.player2.findCardByName('shrug-off-despair', 'province 1');
            this.manicuredGarden = this.player2.findCardByName('manicured-garden', 'province 2');
            this.shrugOffDespair.facedown = false;
            this.manicuredGarden.facedown = false;

            this.game.checkGameState();
        });

        it('should move the conflict to itself when at another province', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
                type: 'military',
                province: this.manicuredGarden
            });

            this.player2.clickCard(this.shrugOffDespair);
            expect(this.game.currentConflict.conflictProvince).toBe(this.shrugOffDespair);
        });
    });
});
