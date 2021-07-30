describe('Utaku Tomoe', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['utaku-tomoe', 'utaku-infantry'],
                    stronghold: ['golden-plains-outpost']
                },
                player2: {
                    honor: 10,
                    inPlay: []
                }
            });

            this.tomoe = this.player1.findCardByName('utaku-tomoe');
            this.infantry = this.player1.findCardByName('utaku-infantry');
            this.gpo = this.player1.findCardByName('golden-plains-outpost');
        });

        it('should trigger on declaration', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tomoe]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tomoe);
            expect(this.player1.hand.length).toBe(0);
            this.player1.clickCard(this.tomoe);
            expect(this.player1.hand.length).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 uses Utaku Tomoe to draw 1 card');
        });

        it('should trigger on movement', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.infantry],
                defenders: [],
                type: 'military'
            });
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            this.player2.pass();
            this.player1.clickCard(this.gpo);
            this.player1.clickCard(this.tomoe);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tomoe);
            expect(this.player1.hand.length).toBe(0);
            this.player1.clickCard(this.tomoe);
            expect(this.player1.hand.length).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 uses Utaku Tomoe to draw 1 card');
        });
    });
});
