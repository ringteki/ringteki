describe('Shinjo Gunso', function() {
    integration(function() {
        describe('Shinjo Gunso\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['shinjo-gunso', 'imperial-storehouse', 'favorable-ground', 'hida-kisada', 'borderlands-defender', 'hida-guardian', 'favorable-dealbroker'],
                        dynastyDeckSize: 4
                    }
                });

                this.gunso = this.player1.moveCard('shinjo-gunso', 'province 1');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.borderlands = this.player1.findCardByName('borderlands-defender');
                this.dealbroker = this.player1.findCardByName('favorable-dealbroker');
                this.player1.moveCard(this.borderlands, 'dynasty deck');
                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');
                this.player1.moveCard(this.hidaGuardian, 'dynasty deck');
            });

            it('should allow you to put a character into play from the top 5 cards', function() {
                this.player1.clickCard(this.gunso);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.gunso);
                expect(this.player1).toHaveDisabledPromptButton('Imperial Storehouse');
                expect(this.player1).toHaveDisabledPromptButton('Favorable Ground');
                expect(this.player1).toHaveDisabledPromptButton('Hida Kisada');
                expect(this.player1).toHaveDisabledPromptButton('Borderlands Defender');
                expect(this.player1).toHavePromptButton('Hida Guardian');

                this.player1.clickPrompt('Hida Guardian');

                expect(this.hidaGuardian.location).toBe('play area');
                expect(this.storehouse.location).toBe('dynasty discard pile');
                expect(this.favorableGround.location).toBe('dynasty discard pile');
                expect(this.borderlands.location).toBe('dynasty discard pile');
                expect(this.kisada.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player1 uses Shinjo Gunsō to search the top 5 cards of their dynasty deck for a character that costs 2 or less and put it into play');
                expect(this.getChatLogs(5)).toContain('player1 puts Hida Guardian into play and discards Hida Kisada, Favorable Ground, Imperial Storehouse and Borderlands Defender');
            });
        });
    });
});
