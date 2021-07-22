describe('Deployed Garrison', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['deployed-garrison', 'imperial-storehouse', 'hida-kisada']
                }
            });

            this.storehouse = this.player1.moveCard('imperial-storehouse', 'province 1');
            this.garrison = this.player1.moveCard('deployed-garrison', 'province 2');
            this.kisada = this.player1.moveCard('hida-kisada', 'province 3');
        });

        it('should let you play it, reducing its fate cost to play', function() {
            let fate = this.player1.fate;

            this.player1.clickCard(this.garrison);
            expect(this.player1).toHavePromptButton('Sacrifice a holding to play this character');
            this.player1.clickPrompt('Sacrifice a holding to play this character');
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            expect(this.player1).not.toBeAbleToSelect(this.kisada);
            this.player1.clickCard(this.storehouse);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');

            this.player1.clickPrompt('2');
            expect(this.garrison.location).toBe('play area');
            expect(this.garrison.fate).toBe(2);
            expect(this.player1.fate).toBe(fate - 2);
            expect(this.getChatLogs(5)).toContain('player1 uses Deployed Garrison, sacrificing Imperial Storehouse to play Deployed Garrison');
            expect(this.getChatLogs(5)).toContain('player1 plays Deployed Garrison with 2 additional fate');
        });
    });
});
