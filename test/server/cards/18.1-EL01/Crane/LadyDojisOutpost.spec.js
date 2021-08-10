describe('Lady Dojis Outpost', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'doji-kuwanan', 'doji-whisperer'],
                    hand: ['resourcefulness'],
                    stronghold: ['lady-doji-s-outpost']
                },
                player2: {
                    inPlay: ['savvy-politician']
                }
            });

            this.outpost = this.player1.findCardByName('lady-doji-s-outpost');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.resourcefulness = this.player1.findCardByName('resourcefulness');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.savvy = this.player2.findCardByName('savvy-politician');
        });

        it('should give non-dishonored honored Courtiers you control +1 glory in political conflicts', function() {
            expect(this.challenger.getGlory()).toBe(2);
            expect(this.yoshi.getGlory()).toBe(3);
            expect(this.savvy.getGlory()).toBe(1);
            expect(this.whisperer.getGlory()).toBe(1);

            this.challenger.honor();
            this.yoshi.honor();
            this.savvy.honor();

            this.game.checkGameState(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
                type: 'political'
            });

            expect(this.challenger.getGlory()).toBe(2);
            expect(this.yoshi.getGlory()).toBe(4);
            expect(this.whisperer.getGlory()).toBe(2);
            expect(this.savvy.getGlory()).toBe(1);

            this.yoshi.dishonor();
            this.yoshi.dishonor();
            this.game.checkGameState(true);
            expect(this.yoshi.getGlory()).toBe(3);
        });

        it('should not give non-dishonored honored Courtiers you control +1 glory in military conflicts', function() {
            expect(this.challenger.getGlory()).toBe(2);
            expect(this.yoshi.getGlory()).toBe(3);
            expect(this.savvy.getGlory()).toBe(1);
            expect(this.whisperer.getGlory()).toBe(1);

            this.challenger.honor();
            this.yoshi.honor();
            this.savvy.honor();

            this.game.checkGameState(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
                type: 'military'
            });

            expect(this.challenger.getGlory()).toBe(2);
            expect(this.yoshi.getGlory()).toBe(3);
            expect(this.whisperer.getGlory()).toBe(1);
            expect(this.savvy.getGlory()).toBe(1);

            this.yoshi.dishonor();
            this.yoshi.dishonor();
            this.game.checkGameState(true);
            expect(this.yoshi.getGlory()).toBe(3);
        });
    });
});
