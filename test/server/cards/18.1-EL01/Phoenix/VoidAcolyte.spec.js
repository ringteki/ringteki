describe('All and Nothing', function() {
    integration(function() {
        describe('All and Nothing\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-kaede', 'seeker-of-knowledge', 'void-acolyte'],
                        hand: ['taryu-jiai']
                    },
                    player2: {
                        inPlay: ['miya-mystic']
                    }
                });
                this.acolyte = this.player1.findCardByName('void-acolyte');
                this.miyaMystic = this.player2.findCardByName('miya-mystic');
                this.miyaMystic.fate = 2;
                this.noMoreActions();
            });

            it('should trigger when the player resolves the void effect', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'void',
                    attackers: ['seeker-of-knowledge'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('void');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.acolyte);
                this.player1.clickCard(this.acolyte);
                expect(this.acolyte.fate).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 uses Void Acolyte to place 1 fate on Void Acolyte');
            });

            it('should not trigger when the player resolves another ring effect', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'void',
                    attackers: ['seeker-of-knowledge'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should trigger when Kaede resolves the void effect on a non-void ring', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    attackers: ['isawa-kaede'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickPrompt('Resolve All Elements');
                this.player1.clickRing('void');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.acolyte);
                this.player1.clickCard(this.acolyte);
                expect(this.acolyte.fate).toBe(1);
            });

            it('should trigger when the player resolves the void effect using Taryu Jiai', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    attackers: ['seeker-of-knowledge'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('taryu-jiai');
                expect(this.player1).toHavePrompt('Choose a friendly shugenja');
                this.player1.clickCard('isawa-kaede');
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Choose a ring effect to resolve');
                this.player1.clickRing('void');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.acolyte);
                this.player1.clickCard(this.acolyte);
                expect(this.acolyte.fate).toBe(1);
            });
        });
    });
});
