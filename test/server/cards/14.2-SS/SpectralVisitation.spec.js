describe('Spectral Visitation', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    dynastyDiscard: ['bayushi-shoju']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'daidoji-uji'],
                    dynastyDiscard: ['kakita-yoshi', 'kakita-toshimoko', 'daidoji-kageyu', 'moto-chagatai'],
                    provinces: ['spectral-visitation', 'manicured-garden']
                }
            });

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.shoju = this.player1.findCardByName('bayushi-shoju');

            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            this.spectralVisitation = this.player2.findCardByName('spectral-visitation');
            this.manicured = this.player2.findCardByName('manicured-garden');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.kageyu = this.player2.findCardByName('daidoji-kageyu');
            this.chagatai = this.player2.findCardByName('moto-chagatai');
        });

        it('should trigger when it is revealed', function() {
            this.noMoreActions();
            expect(this.spectralVisitation.facedown).toBe(true);

            this.initiateConflict({
                attackers: [this.berserker],
                province: this.spectralVisitation,
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.spectralVisitation);
        });

        it('should not trigger if your deck doesn\'t have enough cards', function() {
            this.noMoreActions();
            expect(this.spectralVisitation.facedown).toBe(true);

            this.player2.reduceDeckToNumber('dynasty deck', 3);

            this.initiateConflict({
                attackers: [this.berserker],
                province: this.spectralVisitation,
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.spectralVisitation);
        });

        it('should discard the top 4 cards of your dynasty deck to activate', function() {
            this.noMoreActions();
            expect(this.spectralVisitation.facedown).toBe(true);

            this.initiateConflict({
                attackers: [this.berserker],
                province: this.spectralVisitation,
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.spectralVisitation);
        });
    });
});
