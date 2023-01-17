describe('Ancient Golem', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['solemn-scholar', 'doji-challenger']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['illusionary-decoy', 'isawa-tadaka-2']
                }
            });

            this.decoy = this.player2.findCardByName('illusionary-decoy');
            this.isawaTadaka = this.player2.findCardByName('isawa-tadaka-2');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.solemnScholar = this.player1.findCardByName('solemn-scholar');
            this.challenger1 = this.player1.findCardByName('doji-challenger');
        });

        it('should not be able to trigger action from hand', function() {
            this.player1.pass();
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.decoy);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should trigger and enter play from hand when defenders are declared', function() {
            this.player1.pass();
            this.player2.clickCard(this.isawaTadaka);
            this.player2.clickPrompt('0');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.solemnScholar],
                defenders: [this.challenger],
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.decoy);
            this.player2.clickCard(this.decoy);

            expect(this.decoy.location).toBe('play area');
            expect(this.decoy.isParticipating()).toBe(false);
            expect(this.getChatLogs(3)).toContain('player2 uses Illusionary Decoy to put Illusionary Decoy into play');
        });

        it('should instantly discard if you don\'t have a shugenja', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.solemnScholar],
                defenders: [this.challenger],
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.decoy);
            this.player2.clickCard(this.decoy);

            expect(this.decoy.location).toBe('conflict discard pile');
            expect(this.decoy.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 uses Illusionary Decoy to put Illusionary Decoy into play');
            expect(this.getChatLogs(5)).toContain('Illusionary Decoy is discarded from play as player2 does not control a shugenja');

            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should return to hand with right conditions', function() {
            this.player1.pass();
            this.player2.clickCard(this.isawaTadaka);
            this.player2.clickPrompt('0');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger1],
                defenders: [this.challenger],
                type: 'military',
                ring: 'earth'
            });
            this.player2.clickCard(this.decoy);
            expect(this.decoy.location).toBe('play area');

            this.player2.pass();
            this.player1.clickCard(this.challenger1);
            this.player1.clickCard(this.decoy);

            expect(this.decoy.isParticipating()).toBe(true);
            this.player2.clickCard(this.decoy);
            expect(this.decoy.location).toBe('hand');
            expect(this.getChatLogs(3)).toContain('player2 uses Illusionary Decoy to return Illusionary Decoy to their hand');
        });

        it('should not return to hand with wrong conditions', function() {
            this.player1.pass();
            this.player2.clickCard(this.isawaTadaka);
            this.player2.clickPrompt('0');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger1],
                defenders: [this.challenger],
                type: 'military',
                ring: 'air'
            });
            this.player2.clickCard(this.decoy);
            expect(this.decoy.location).toBe('play area');

            this.player2.pass();
            this.player1.clickCard(this.challenger1);
            this.player1.clickCard(this.decoy);

            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.decoy.isParticipating()).toBe(true);
            this.player2.clickCard(this.decoy);
            expect(this.decoy.location).toBe('play area');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
