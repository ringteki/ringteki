describe('Raving Lunatic', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['raving-lunatic', 'doji-challenger'],
                },
                player2: {
                    inPlay: ['raving-lunatic'],
                }
            });
            this.lunatic = this.player1.findCardByName('raving-lunatic');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.lunatic2 = this.player2.findCardByName('raving-lunatic');
            this.challenger.fate = 4;
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 2;
        });

        it('happy path', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.lunatic2],
            });

            expect(this.lunatic.getMilitarySkill()).toBe(this.lunatic2.getMilitarySkill() + 2);
            expect(this.lunatic.getPoliticalSkill()).toBe(this.lunatic2.getPoliticalSkill());

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.lunatic2);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.lunatic);
            expect(this.player2).not.toBeAbleToSelect(this.lunatic2);

            this.player2.clickCard(this.challenger);

            expect(this.lunatic2.location).toBe('dynasty discard pile');
            expect(this.challenger.fate).toBe(3);

            expect(this.getChatLogs(5)).toContain('player2 uses Raving Lunatic to injure Doji Challenger and Raving Lunatic');
        });
    });
});
