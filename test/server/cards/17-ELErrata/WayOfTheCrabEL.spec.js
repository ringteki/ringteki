describe('Way of the Crab EL', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai'],
                    hand: ['noble-sacrifice']
                },
                player2: {
                    inPlay: ['hantei-sotorii', 'kaiu-envoy', 'shrewd-yasuki'],
                    hand: ['way-of-the-crab-el']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.sac = this.player1.findCardByName('noble-sacrifice');

            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.envoy = this.player2.findCardByName('kaiu-envoy');
            this.yasuki = this.player2.findCardByName('shrewd-yasuki');
            this.crab = this.player2.findCardByName('way-of-the-crab-el');
        });

        it('Testing Errata', function() {
            this.whisperer.honor();
            this.brash.honor();
            this.sotorii.dishonor();
            this.yasuki.dishonor();

            this.player1.pass();
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.crab);
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.pass();

            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.sotorii, this.yasuki],
                type: 'military'
            });

            this.player2.clickCard(this.crab);
            expect(this.player2).not.toBeAbleToSelect(this.sotorii);
            expect(this.player2).not.toBeAbleToSelect(this.envoy);
            expect(this.player2).toBeAbleToSelect(this.yasuki);
            this.player2.clickCard(this.yasuki);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.brash);
            this.player1.clickCard(this.whisperer);

            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.yasuki.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player2 plays Way of the Crab (EL), sacrificing Shrewd Yasuki to force player1 to sacrifice a character');
            expect(this.getChatLogs(5)).toContain('player1 sacrifices Doji Whisperer to Way of the Crab (EL)');
        });
    });
});
