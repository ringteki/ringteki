describe('Lucky Coin', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan', 'doji-challenger'],
                    hand: ['lucky-coin']
                },
                player2: {
                    inPlay: ['young-harrier'],
                    hand: ['noble-sacrifice']
                }
            });
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.coin = this.player1.findCardByName('lucky-coin');

            this.harrier = this.player2.findCardByName('young-harrier');
            this.sac = this.player2.findCardByName('noble-sacrifice');

            this.kuwanan.dishonor();
            this.harrier.honor();

            this.player1.playAttachment(this.coin, this.kuwanan);
        });

        it('should have no effect if not during a conflict', function() {
            expect(this.kuwanan.getMilitarySkill()).toBe(2);
            expect(this.kuwanan.getPoliticalSkill()).toBe(1);
        });

        it('should stop dishonor status modifying both skills', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            expect(this.kuwanan.getMilitarySkill()).toBe(5);
            expect(this.kuwanan.getPoliticalSkill()).toBe(4);
        });

        it('should stop dishonor status losing honor on leaving play', function() {
            let honor = this.player1.honor;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.clickCard(this.sac);
            this.player2.clickCard(this.kuwanan);
            this.player2.clickCard(this.harrier);

            expect(this.kuwanan.location).toBe('dynasty discard pile');
            expect(this.player1.honor).toBe(honor);
        });
    });
});
