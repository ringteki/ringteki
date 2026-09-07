describe('Usogawa Chidori', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['usogawa-chidori', 'callow-delegate']
                },
                player2: {
                    inPlay: ['shrine-maiden', 'henshin-disciple']
                }
            });

            this.chidori = this.player1.findCardByName('usogawa-chidori');
            this.callowDelegate = this.player1.findCardByName('callow-delegate');

            this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
            this.henshinDisciple = this.player2.findCardByName('henshin-disciple');
        });

        it('should blank an opponents non-participating character during conflict.', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.chidori, this.callowDelegate],
                defenders: [this.henshinDisciple]
            });

            let fate = this.player1.fate;
            let fate2 = this.player2.fate;

            this.player2.pass();
            this.player1.clickCard(this.chidori);
            expect(this.player1).not.toBeAbleToSelect(this.chidori);
            expect(this.player1).not.toBeAbleToSelect(this.callowDelegate);
            expect(this.player1).not.toBeAbleToSelect(this.henshinDisciple);
            expect(this.player1).toBeAbleToSelect(this.shrineMaiden);
            this.player1.clickCard(this.shrineMaiden);

            expect(this.getChatLogs(10)).toContain('player1 uses Usogawa Chidori, giving 1 fate to player2 to treat Shrine Maiden as if it had no printed abilities until the end of the phase');
            expect(this.shrineMaiden.isBlank()).toBe(true);
            expect(this.player1.fate).toBe(fate - 1);
            expect(this.player2.fate).toBe(fate2 + 1);
        });

        it('should work outside of a conflict conflict.', function () {
            let fate = this.player1.fate;
            let fate2 = this.player2.fate;

            this.player1.clickCard(this.chidori);
            expect(this.player1).not.toBeAbleToSelect(this.chidori);
            expect(this.player1).not.toBeAbleToSelect(this.callowDelegate);
            expect(this.player1).toBeAbleToSelect(this.henshinDisciple);
            expect(this.player1).toBeAbleToSelect(this.shrineMaiden);
            this.player1.clickCard(this.henshinDisciple);

            expect(this.getChatLogs(10)).toContain('player1 uses Usogawa Chidori, giving 1 fate to player2 to treat Henshin Disciple as if it had no printed abilities until the end of the phase');
            expect(this.henshinDisciple.isBlank()).toBe(true);
            expect(this.player1.fate).toBe(fate - 1);
            expect(this.player2.fate).toBe(fate2 + 1);
        });
    });
});
