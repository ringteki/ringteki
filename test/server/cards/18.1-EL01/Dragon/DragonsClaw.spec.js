describe('Mirumoto\'s Peak', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-kuwanan'],
                },
                player2: {
                    inPlay: ['kakita-yoshi'],
                    hand: ['dragon-s-claw', 'dragon-s-fang']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');

            this.claw = this.player2.findCardByName('dragon-s-claw');
            this.fang = this.player2.findCardByName('dragon-s-fang');
            
            this.player1.pass();
            this.player2.playAttachment(this.claw, this.yoshi);
        });

        it('should do nothing if Dragons Fang isn\'t also attached', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.kuwanan],
                defenders: [this.yoshi]
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.claw);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            this.player2.playAttachment(this.fang, this.yoshi);
            this.player1.pass();
            this.player2.clickCard(this.claw);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);

            this.player2.clickCard(this.challenger);
            expect(this.challenger.bowed).toBe(true);
            expect(this.challenger.isParticipating()).toBe(false);

            expect(this.getChatLogs(5)).toContain('player2 uses Dragon\'s Claw, bowing Dragon\'s Claw to bow Doji Challenger and send Doji Challenger home');
        });
    });
});
