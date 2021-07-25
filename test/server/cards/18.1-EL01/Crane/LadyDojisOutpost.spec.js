describe('Lady Dojis Outpost', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'doji-kuwanan'],
                    hand: ['resourcefulness'],
                    stronghold: ['lady-doji-s-outpost']
                },
                player2: {
                    inPlay: ['savvy-politician']
                }
            });

            this.outpost = this.player1.findCardByName('lady-doji-s-outpost');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.resourcefulness = this.player1.findCardByName('resourcefulness');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.savvy = this.player2.findCardByName('savvy-politician');
        });

        it('should react when a character you control is honored', function() {
            this.player1.clickCard(this.resourcefulness);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.kuwanan);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.outpost);
            this.player1.clickCard(this.outpost);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
            expect(this.player1).toBeAbleToSelect(this.savvy);

            this.player1.clickCard(this.yoshi);
            expect(this.challenger.isHonored).toBe(true);
            expect(this.yoshi.isHonored).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Lady Dōji\'s Outpost to honor Kakita Yoshi');
        });

        it('should not react when a character you don\'t control is honored', function() {
            this.player1.clickCard(this.resourcefulness);
            this.player1.clickCard(this.savvy);
            this.player1.clickCard(this.kuwanan);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.savvy.isHonored).toBe(true);
        });

        it('should give honored Courtiers you control +1 glory', function() {
            expect(this.challenger.getGlory()).toBe(2);
            expect(this.yoshi.getGlory()).toBe(3);
            expect(this.savvy.getGlory()).toBe(1);

            this.challenger.honor();
            this.yoshi.honor();
            this.savvy.honor();

            this.game.checkGameState(true);

            expect(this.challenger.getGlory()).toBe(2);
            expect(this.yoshi.getGlory()).toBe(4);
            expect(this.savvy.getGlory()).toBe(1);

            this.yoshi.dishonor();
            this.yoshi.dishonor();
            this.game.checkGameState(true);
            expect(this.yoshi.getGlory()).toBe(3);
        });
    });
});
