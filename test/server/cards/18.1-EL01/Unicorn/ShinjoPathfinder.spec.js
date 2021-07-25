describe('Shinjo Pathfinder', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['shinjo-pathfinder']
                },
                player2: {
                    honor: 10,
                    inPlay: ['eloquent-advocate', 'kakita-yoshi']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.advocate = this.player2.findCardByName('eloquent-advocate');

            this.pathfinder = this.player1.findCardByName('shinjo-pathfinder');
            this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.p2 = this.player2.findCardByName('shameful-display', 'province 2');

            this.p1.facedown = false;
        });

        it('should have covert attacking a facedown province', function() {
            this.noMoreActions();
            this.player1.clickRing('air');
            this.player1.clickCard(this.p2);
            this.player1.clickCard(this.pathfinder);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Choose covert target for Shinjo Pathfinder');
        });

        it('should not have covert attacking a facedown province', function() {
            this.noMoreActions();
            this.player1.clickRing('air');
            this.player1.clickCard(this.p1);
            this.player1.clickCard(this.pathfinder);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player2).toHavePrompt('Choose defenders');
        });
    });
});
