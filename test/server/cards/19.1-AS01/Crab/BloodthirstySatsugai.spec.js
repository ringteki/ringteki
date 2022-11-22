describe('Bloodthirsty Satsugai', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat', 'student-of-anatomies'],
                    hand: ['assassination', 'cloud-the-mind'],
                    dynastyDiscard: ['bloodthirsty-satsugai']
                }
            });

            this.student = this.player1.findCardByName('student-of-anatomies');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.satsugai = this.player1.findCardByName('bloodthirsty-satsugai');
            this.assassination = this.player1.findCardByName('assassination');
            this.cloud = this.player1.findCardByName('cloud-the-mind');
        });

        it('should sacrifice someone to be put into play from discard pile', function () {
            this.player1.clickCard(this.satsugai);
            this.player1.clickCard(this.diplomat);
            expect(this.satsugai.location).toBe('play area');
            expect(this.satsugai.isTainted).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Bloodthirsty Satsugai, sacrificing Doji Diplomat to put Bloodthirsty Satsugai into play');
        });

        it('should sacrifice someone to be put into play from province', function () {
            this.player1.moveCard(this.satsugai, 'province 1');
            this.game.checkGameState(true);
            this.player1.clickCard(this.satsugai);
            this.player1.clickCard(this.diplomat);
            expect(this.satsugai.location).toBe('play area');
            expect(this.satsugai.isTainted).toBe(true);
        });

        it('should remove from game when it leaves play', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.satsugai);
            this.player1.clickCard(this.diplomat);
            expect(this.satsugai.location).toBe('play area');
            expect(this.satsugai.isParticipating()).toBe(false);
            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.satsugai);
            expect(this.satsugai.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Bloodthirsty Satsugai is removed from the game due to leaving play');
        });

        it('should remove from game even if blanked', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.satsugai);
            this.player1.clickCard(this.diplomat);
            expect(this.satsugai.location).toBe('play area');
            expect(this.satsugai.isParticipating()).toBe(false);
            this.player2.pass();
            this.player1.clickCard(this.student);
            this.player1.clickCard(this.satsugai);
            this.player1.clickCard(this.student);
            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.satsugai);
            expect(this.satsugai.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Bloodthirsty Satsugai is removed from the game due to leaving play');
        });
    });
});
