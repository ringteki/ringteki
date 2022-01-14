describe('Jurojin\'s Curse Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay:['doji-challenger', 'kakita-yoshi', 'seeker-of-knowledge'],
                    hand: ['jurojin-s-swear']
                },
                player2: {
                    inPlay: ['isawa-kaede']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.seeker = this.player1.findCardByName('seeker-of-knowledge');
            this.isawaKaede = this.player2.findCardByName('isawa-kaede');
            this.challenger.fate = 1;
            this.yoshi.fate = 2;
            this.jurojinsCurse = this.player1.playAttachment('jurojin-s-swear', this.seeker);
        });

        it('should not trigger if it\'s parent is bowed at the end of the fate phase', function() {
            this.seeker.bow();
            this.advancePhases('fate');
            expect(this.player1).toHavePrompt('Fate Phase');
            expect(this.getChatLogs(5)).not.toContain('player1 uses Jurōjin\'s Swear to discard all characters without fate and remove 1 fate from each character with fate');
        });

        it('should remove fate and discard characters', function() {
            this.advancePhases('fate');
            expect(this.getChatLogs(5)).toContain('player1 uses Jurōjin\'s Swear to discard all characters without fate and remove 1 fate from each character with fate');
            expect(this.seeker.location).toBe('conflict discard pile');
            expect(this.isawaKaede.location).toBe('dynasty discard pile');
            expect(this.yoshi.fate).toBe(1);
            expect(this.challenger.fate).toBe(0);

            expect(this.player1).toHavePrompt('Fate Phase');
            this.player1.clickPrompt('Done');

            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.yoshi.fate).toBe(0);
        });
    });
});
