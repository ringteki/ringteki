describe('Tainted Tokens', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-whisperer'],
                    hand: ['favored-mount']
                },
                player2: {
                    inPlay: ['hantei-sotorii'],
                }
            });

            this.shameful = this.player2.findCardByName('shameful-display', 'province 1');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.mount = this.player1.findCardByName('favored-mount');

            this.sotorii = this.player2.findCardByName('hantei-sotorii');
        });

        it('should give tainted characters +2/+2', function() {
            let mil = this.brash.getMilitarySkill();
            let pol = this.brash.getPoliticalSkill();
            this.brash.taint();
            this.game.checkGameState(true);

            expect(this.brash.getMilitarySkill()).toBe(mil + 2);
            expect(this.brash.getPoliticalSkill()).toBe(pol + 2);
        });

        it('should give tainted provinces +2 strength', function() {
            let str = this.shameful.getStrength();
            this.shameful.taint();
            this.game.checkGameState(true);

            expect(this.shameful.getStrength()).toBe(str + 2);
        });
    });
});