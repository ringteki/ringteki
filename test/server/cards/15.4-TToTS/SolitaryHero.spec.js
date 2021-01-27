describe('Solitary Hero', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['solitary-hero', 'doji-challenger']
                },
                player2: {
                    inPlay: ['kakita-toshimoko', 'kakita-kaezin', 'doji-whisperer', 'brash-samurai']
                }
            });

            this.hero = this.player1.findCardByName('solitary-hero');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.kaezin = this.player2.findCardByName('kakita-kaezin');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.brash = this.player2.findCardByName('brash-samurai');

            this.hero.fate = 2;
            this.challenger.fate = 2;
            this.toshimoko.fate = 2;
            this.kaezin.fate = 1;
            this.whisperer.fate = 1;
            this.brash.fate = 3;
        });

        it('should not work when not during a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not work when not participating alone', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hero, this.challenger],
                defenders: [this.toshimoko, this.whisperer, this.kaezin]
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should remove a fate from every participating character with equal or lower mil skill', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hero],
                defenders: [this.toshimoko, this.whisperer, this.kaezin]
            });

            let f1 = this.hero.fate;
            let f2 = this.challenger.fate;
            let f3 = this.toshimoko.fate;
            let f4 = this.whisperer.fate;
            let f5 = this.kaezin.fate;
            let f6 = this.brash.fate;

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.hero);
            expect(this.hero.fate).toBe(f1);
            expect(this.challenger.fate).toBe(f2);
            expect(this.toshimoko.fate).toBe(f3);
            expect(this.whisperer.fate).toBe(f4 - 1);
            expect(this.kaezin.fate).toBe(f5 - 1);
            expect(this.brash.fate).toBe(f6);

            expect(this.getChatLogs(5)).toContain('player1 uses Solitary Hero to remove 1 fate from Doji Whisperer and Kakita Kaezin');
        });
    });
});
