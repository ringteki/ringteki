describe('Obsidian Caves', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka', 'solemn-scholar']
                },
                player2: {
                    provinces: ['obsidian-caves'],
                    inPlay: ['yasuki-taka']
                }
            });

            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.solemnScholar = this.player1.findCardByName('solemn-scholar');

            this.obsidianCaves = this.player2.findCardByName('obsidian-caves', 'province 1');
            this.yasukiTaka = this.player2.findCardByName('yasuki-taka');
        });

        it('should allow the opponent to chose their participating character to send home and send it home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                defenders: [],
                province: this.obsidianCaves,
                type: 'military'
            });

            this.player2.clickCard(this.obsidianCaves);
            expect(this.player1).toHavePrompt('Choose a character to send home');
            expect(this.player1).toBeAbleToSelect(this.isawaTadaka);
            expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);

            this.player1.clickCard(this.isawaTadaka);
            expect(this.isawaTadaka.inConflict).toBe(false);
            expect(this.getChatLogs(3)).toContain('player2 uses Obsidian Caves to send Isawa Tadaka home');
        });

        it('should allow the opponent to chose one of their participating character to send home and send it home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka, this.solemnScholar],
                defenders: [this.yasukiTaka],
                province: this.obsidianCaves,
                type: 'military'
            });

            this.player2.clickCard(this.obsidianCaves);
            expect(this.player1).toHavePrompt('Choose a character to send home');
            expect(this.player1).toBeAbleToSelect(this.isawaTadaka);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).not.toBeAbleToSelect(this.yasukiTaka);

            this.player1.clickCard(this.solemnScholar);
            expect(this.solemnScholar.inConflict).toBe(false);
            expect(this.getChatLogs(3)).toContain('player2 uses Obsidian Caves to send Solemn Scholar home');
        });
    });
});
