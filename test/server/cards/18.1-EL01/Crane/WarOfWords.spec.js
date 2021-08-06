describe('War of Words', function() {
    integration(function() {
        describe('Base Case (no dash, no element dependant, no Tadakatsu)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-asami'],
                        hand: ['doji-fumiki', 'war-of-words']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger']
                    }
                });

                this.asami = this.player1.findCardByName('kakita-asami');
                this.fumiki = this.player1.findCardByName('doji-fumiki');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.war = this.player1.findCardByName('war-of-words');
            });

            it('should have you count your political skill', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asami],
                    defenders: [this.dojiWhisperer, this.challenger],
                    type: 'military',
                    ring: 'air'
                });
                this.player2.pass();

                expect(this.game.currentConflict.attackerSkill).toBe(1);
                expect(this.game.currentConflict.defenderSkill).toBe(3);

                this.player1.clickCard(this.war);

                expect(this.game.currentConflict.attackerSkill).toBe(3);
                expect(this.game.currentConflict.defenderSkill).toBe(3);

                this.player2.pass();
                this.player1.clickCard(this.fumiki);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.fumiki.location).toBe('play area');

                expect(this.game.currentConflict.attackerSkill).toBe(6);
                expect(this.game.currentConflict.defenderSkill).toBe(3);

                expect(this.getChatLogs(10)).toContain('player1 plays War of Words to count their political skill towards conflict resolution');
            });
        });
    });
});
