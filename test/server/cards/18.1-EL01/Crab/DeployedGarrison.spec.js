describe('Deployed Garrison', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['deployed-garrison', 'imperial-storehouse', 'hida-kisada'],
                    inPlay: ['brash-samurai', 'savvy-politician'],
                    hand: ['common-cause']
                }
            });

            this.storehouse = this.player1.moveCard('imperial-storehouse', 'province 1');
            this.garrison = this.player1.findCardByName('deployed-garrison');
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.brash = this.player1.findCardByName('brash-samurai');

            this.commonCause = this.player1.findCardByName('common-cause');
            this.savvy = this.player1.findCardByName('savvy-politician');
            this.savvy.bow();
        });

        it('should let you put it into play from discard during a conflict and remove from game when the conflict ends', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.garrison);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            this.player1.clickCard(this.storehouse);
            expect(this.garrison.location).toBe('play area');
            expect(this.garrison.fate).toBe(0);
            expect(this.getChatLogs(5)).toContain('player1 uses Deployed Garrison, sacrificing Imperial Storehouse to put Deployed Garrison into play in the conflict');

            this.brash.bow();
            this.garrison.bow();
            this.noMoreActions();
            expect(this.garrison.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Deployed Garrison is removed from the game due to its effect');
        });

        it('should let you put it into play from discard during a conflict and not remove from game if it leaves play', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.garrison);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            this.player1.clickCard(this.storehouse);
            expect(this.garrison.location).toBe('play area');
            expect(this.garrison.fate).toBe(0);
            expect(this.getChatLogs(5)).toContain('player1 uses Deployed Garrison, sacrificing Imperial Storehouse to put Deployed Garrison into play in the conflict');

            this.player2.pass();
            this.player1.clickCard(this.commonCause);
            this.player1.clickCard(this.savvy);
            this.player1.clickCard(this.garrison);
            expect(this.garrison.location).toBe('dynasty discard pile');
        });

        it('should not let you put it into play from a province', function() {
            this.player1.moveCard(this.garrison, 'province 2');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: []
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.garrison);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
