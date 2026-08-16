describe('Collapsible Tunnels', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'doji-diplomat']
                },
                player2: {
                    inPlay: ['borderlands-defender', 'doji-whisperer'],
                    dynastyDeck: ['collapsible-tunnels']
                }
            });
            this.tunnels = this.player2.placeCardInProvince('collapsible-tunnels', 'province 1');
            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.sd2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('give +2 strength', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker, this.diplomat],
                defenders: [this.borderlandsDefender, this.whisperer],
                province: this.sd1
            });
            let strength = this.sd1.getStrength();
            this.player2.clickCard(this.tunnels);

            expect(this.player2).toHavePromptButton('Add Province Strength');
            expect(this.player2).toHavePromptButton('Bow a character');
            this.player2.clickPrompt('Add Province Strength');

            expect(this.sd1.getStrength()).toBe(strength + 2);
            expect(this.getChatLogs(5)).toContain('player2 uses Collapsible Tunnels to increase the strength of an attacked province by 2');
            expect(this.getChatLogs(5)).toContain('player2 increases the strength of Shameful Display');
        });

        it('bow a character', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker, this.diplomat],
                defenders: [this.borderlandsDefender, this.whisperer],
                province: this.sd1
            });
            let strength = this.sd1.getStrength();
            this.player2.clickCard(this.tunnels);

            expect(this.player2).toHavePromptButton('Add Province Strength');
            expect(this.player2).toHavePromptButton('Bow a character');
            this.player2.clickPrompt('Bow a character');
            expect(this.player2).not.toBeAbleToSelect(this.berserker);
            expect(this.player2).toBeAbleToSelect(this.diplomat);
            expect(this.player2).not.toBeAbleToSelect(this.borderlandsDefender);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);

            this.player2.clickCard(this.diplomat);
            expect(this.sd1.getStrength()).toBe(strength);
            expect(this.diplomat.bowed).toBe(true);
            expect(this.tunnels.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player2 uses Collapsible Tunnels, sacrificing Collapsible Tunnels to bow Doji Diplomat');
        });
    });
});
