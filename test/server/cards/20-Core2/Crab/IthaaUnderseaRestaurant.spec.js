xdescribe('Ithaa Undersea Restaurant', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['giver-of-gifts']
                },
                player2: {
                    inPlay: ['hida-guardian'],
                    provinces: ['ithaa-undersea-restaurant']
                }
            });

            this.restaurant = this.player2.findCardByName('ithaa-undersea-restaurant', 'province 1');
        });

        it('contributes to glory counts', function () {
            this.restaurant.facedown = false;
            this.flow.finishConflictPhase();
            expect(this.getChatLogs(3)).toContain('player2 wins the glory count 3 vs 2');
        });

        it('does not contribute to glory counts while facedown', function () {
            this.restaurant.facedown = true;
            this.flow.finishConflictPhase();
            expect(this.getChatLogs(3)).toContain('player1 wins the glory count 2 vs 1');
        });
    });
});
