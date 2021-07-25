describe('Child of the Plains', function() {
    integration(function() {
        describe('Child of the Plains\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['scout-s-steed']
                    },
                    player2: {
                        inPlay: ['wandering-ronin'],
                        hand: ['talisman-of-the-sun']
                    }
                });

                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.steed = this.player1.findCardByName('scout-s-steed');

                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.talismanOfTheSun = this.player2.findCardByName('talisman-of-the-sun');

                this.player1.playAttachment(this.steed, this.toshimoko);

                this.shamefulDisplay1 = this.player2.provinces['province 1'].provinceCard;
                this.shamefulDisplay2 = this.player2.provinces['province 2'].provinceCard;
            });

            it('should give cavalry and trigger after attacking', function() {
                this.noMoreActions();
                expect(this.toshimoko.hasTrait('cavalry')).toBe(true);
                this.initiateConflict({
                    attackers: [this.toshimoko]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.steed);
            });

            it('should sac itself to give the attacking player the first action opportunity', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.toshimoko]
                });
                this.player1.clickCard(this.steed);
                expect(this.steed.location).toBe('conflict discard pile');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.getChatLogs(5)).toContain('player1 uses Scout\'s Steed, sacrificing Scout\'s Steed to get the first action in this conflict');
            });
        });
    });
});
