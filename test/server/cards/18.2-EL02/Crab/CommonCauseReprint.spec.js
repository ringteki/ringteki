describe('Common Cause Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['steadfast-witch-hunter', 'borderlands-defender'],
                    hand: ['uncommon-cause']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.commonCause = this.player1.findCardByName('uncommon-cause');
            this.steadfastWitchHunter = this.player1.findCardByName('steadfast-witch-hunter');
            this.defender = this.player1.findCardByName('borderlands-defender');

            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('should stand someone after you sacrifice a character', function() {
            this.steadfastWitchHunter.bowed = true;
            this.player1.clickCard(this.commonCause);
            this.player1.clickCard(this.steadfastWitchHunter);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            this.player1.clickCard(this.defender);
            expect(this.defender.location).toBe('dynasty discard pile');
            expect(this.steadfastWitchHunter.bowed).toBe(false);
            expect(this.steadfastWitchHunter.isHonored).toBe(false);
            expect(this.getChatLogs(1)).toContain('player1 plays Uncommon Cause, sacrificing Borderlands Defender to ready Steadfast Witch Hunter');
        });

        it('should be illegal when there are no legal targets', function() {
            this.player1.clickCard(this.commonCause);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should display a message if the only legal target is sacrificed', function() {
            this.steadfastWitchHunter.bowed = true;
            this.player1.clickCard(this.commonCause);
            expect(this.player1).toHavePrompt('Uncommon Cause');
            this.player1.clickPrompt('Pay Costs First');
            this.player1.clickCard(this.steadfastWitchHunter);
            expect(this.steadfastWitchHunter.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(1)).toContain('player1 attempted to use Uncommon Cause, but there are insufficient legal targets');
        });
    });
});
