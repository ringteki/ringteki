describe('Common Cause Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['steadfast-witch-hunter', 'vanguard-warrior', 'hida-kisada', 'eager-scout'],
                    hand: ['uncommon-cause']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.commonCause = this.player1.findCardByName('uncommon-cause');
            this.steadfastWitchHunter = this.player1.findCardByName('steadfast-witch-hunter');
            this.warrior = this.player1.findCardByName('vanguard-warrior');
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.scout = this.player1.findCardByName('eager-scout');
        });

        it('should stand someone after you sacrifice a character', function() {
            this.steadfastWitchHunter.bowed = true;
            this.kisada.bowed = true;
            this.challenger.bowed = true;
            this.player1.clickCard(this.commonCause);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).not.toBeAbleToSelect(this.scout);
            expect(this.player1).toBeAbleToSelect(this.warrior);
            expect(this.player1).toBeAbleToSelect(this.kisada);
            expect(this.player1).toBeAbleToSelect(this.steadfastWitchHunter);
            this.player1.clickCard(this.warrior);
            expect(this.player1).toHavePrompt('Choose a character to ready');
            expect(this.player1).not.toBeAbleToSelect(this.kisada);
            expect(this.player1).toBeAbleToSelect(this.steadfastWitchHunter);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.steadfastWitchHunter);

            expect(this.warrior.location).toBe('dynasty discard pile');
            expect(this.steadfastWitchHunter.bowed).toBe(false);
            expect(this.steadfastWitchHunter.isHonored).toBe(false);
            expect(this.getChatLogs(1)).toContain('player1 plays Uncommon Cause, sacrificing Vanguard Warrior to ready Steadfast Witch Hunter');
        });
    });
});
