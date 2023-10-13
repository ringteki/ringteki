describe('Far Vision Path', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto']
                },
                player2: {
                    hand: ['i-can-swim', 'way-of-the-scorpion'],
                    provinces: ['far-vision-path']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');

            this.iCanSwim = this.player2.findCardByName('i-can-swim');
            this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');

            this.farVisinPath = this.player2.findCardByName('far-vision-path', 'province 1');
        });

        it('cycles a card from hand', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.farVisinPath
            });

            this.player2.clickCard(this.farVisinPath);
            expect(this.player2).toBeAbleToSelect(this.iCanSwim);
            expect(this.player2).toBeAbleToSelect(this.wayOfTheScorpion);

            this.player2.clickCard(this.iCanSwim);
            expect(this.iCanSwim.location).toBe('conflict discard pile');
            expect(this.player2.hand.length).toBe(2);
            expect(this.getChatLogs(3)).toContain('player2 uses Far Vision Path, discarding I Can Swim to draw 1 card');
        });
    });
});
