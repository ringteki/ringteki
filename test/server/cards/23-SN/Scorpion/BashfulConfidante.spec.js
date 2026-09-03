describe('Bashful Confidante', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bashful-confidante', 'bashful-confidante', 'heir-of-the-serpent']
                },
                player2: {
                    inPlay: ['asahina-diviner', 'doji-kuwanan', 'kakita-yoshi']
                }
            });

            this.bashful = this.player1.filterCardsByName('bashful-confidante')[0];
            this.bashful2 = this.player1.filterCardsByName('bashful-confidante')[1];
            this.serpent = this.player1.findCardByName('heir-of-the-serpent');

            this.diviner = this.player2.findCardByName('asahina-diviner');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('happy path', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.bashful, this.serpent],
                defenders: [this.diviner, this.kuwanan]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.bashful);

            this.player1.clickCard(this.bashful);
            expect(this.player1).not.toBeAbleToSelect(this.serpent);
            expect(this.player1).toBeAbleToSelect(this.diviner);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kuwanan);

            expect(this.getChatLogs(5)).toContain('player1 uses Bashful Confidante to force player2 to pay 1 honor to player1 in order to trigger Doji Kuwanan\'s abilities');

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.clickCard(this.kuwanan);
            this.player2.clickCard(this.bashful);
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);

            expect(this.getChatLogs(5)).toContain('player2 gives player1 1 honor to trigger Doji Kuwanan\'s ability');
        });

        it('doesn\'t impact non targeted characters', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.bashful, this.serpent],
                defenders: [this.diviner, this.kuwanan]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.bashful);

            this.player1.clickCard(this.bashful);
            this.player1.clickCard(this.kuwanan);

            expect(this.getChatLogs(5)).toContain('player1 uses Bashful Confidante to force player2 to pay 1 honor to player1 in order to trigger Doji Kuwanan\'s abilities');

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.clickCard(this.diviner);
            this.player2.clickCard(this.kuwanan);
            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor2);
        });

        it('stacks', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.bashful, this.bashful2],
                defenders: [this.diviner, this.kuwanan]
            });

            this.player1.clickCard(this.bashful);
            this.player1.clickCard(this.kuwanan);
            this.player1.clickCard(this.bashful2);
            this.player1.clickCard(this.kuwanan);

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.clickCard(this.kuwanan);
            this.player2.clickCard(this.bashful);
            expect(this.player1.honor).toBe(honor + 2);
            expect(this.player2.honor).toBe(honor2 - 2);
        });
    });
});
