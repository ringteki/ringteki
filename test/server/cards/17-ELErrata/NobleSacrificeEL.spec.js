describe('Noble Sacrifice EL', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai'],
                    hand: ['noble-sacrifice-el']
                },
                player2: {
                    inPlay: ['hantei-sotorii', 'kaiu-envoy', 'shrewd-yasuki'],
                    hand: ['way-of-the-crab']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.sac = this.player1.findCardByName('noble-sacrifice-el');

            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.envoy = this.player2.findCardByName('kaiu-envoy');
            this.yasuki = this.player2.findCardByName('shrewd-yasuki');
            this.crab = this.player2.findCardByName('way-of-the-crab');
        });

        it('Testing Errata', function() {
            this.whisperer.honor();
            this.brash.honor();
            this.sotorii.dishonor();
            this.yasuki.dishonor();

            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.sac);
            expect(this.player1).toHavePrompt('Action Window');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.sotorii],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.sac);
            expect(this.player1).toBeAbleToSelect(this.sotorii);
            expect(this.player1).not.toBeAbleToSelect(this.envoy);
            expect(this.player1).not.toBeAbleToSelect(this.yasuki);
            this.player1.clickCard(this.sotorii);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            this.player1.clickCard(this.whisperer);

            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.sotorii.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Noble Sacrifice (EL), sacrificing Doji Whisperer to discard Hantei Sotorii');
        });
    });
});
