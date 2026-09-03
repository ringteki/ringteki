describe('Empress Favorite', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'doji-diplomat', 'empress-favorite']
                },
                player2: {
                    inPlay: ['borderlands-defender', 'empress-favorite']
                }
            });
            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.sd2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.favorite = this.player2.findCardByName('empress-favorite');
            this.favorite1 = this.player1.findCardByName('empress-favorite');
        });

        it('take 1 honor when defending', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.favorite1],
                defenders: [this.favorite],
                province: this.sd1,
                type: 'political'
            });
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.clickCard(this.favorite);
            expect(this.player1.honor).toBe(honor - 1);
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Empress\' Favorite to take 1 honor from player1');

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.favorite1);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('doesnt work during mil', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.favorite1],
                defenders: [this.favorite],
                province: this.sd1,
                type: 'military'
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.favorite);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('doesnt work if mil first then pol', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.borderlandsDefender],
                province: this.sd1,
                type: 'military'
            });
            this.noMoreActions();

            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.favorite1],
                defenders: [this.favorite],
                province: this.sd1,
                type: 'political',
                ring: 'earth'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.favorite);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(5)).not.toContain('player2 uses Empress\' Favorite to take 1 honor from player1');
        });
    });
});
