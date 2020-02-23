describe('Ramparts of Stone', function() {
    integration(function() {
        describe('Ramparts of stone\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'aggressive-moto', 'iuchi-wayfinder'],
                        hand: ['assassination', 'finger-of-jade', 'court-games', 'banzai']
                    },
                    player2: {
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['steward-of-law', 'mirumoto-s-fury', 'ramparts-of-stone']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['shinjo-outrider', 'aggressive-moto'],
                    defenders: ['doji-whisperer']
                });
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.moto = this.player1.findCardByName('aggressive-moto');
                this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.ramparts = this.player2.findCardByName('ramparts-of-stone');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.challenger = this.player2.findCardByName('doji-challenger');
            });

            it('should prompt the attacker to discard or bow character', function() {
                this.player2.clickCard(this.ramparts);
                expect(this.player1).toHavePrompt('Ramparts of Stone');
                expect(this.player1.currentButtons).toContain('Bow all participating character');
                expect(this.player1.currentButtons).toContain('Discard three cards from hand');

            });
        });
    });
});
