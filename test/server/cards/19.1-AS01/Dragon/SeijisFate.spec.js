describe('Seijis Fate', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['chrysanthemum-steward'],
                    hand: ['a-new-name', 'seiji-s-fate']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.steward = this.player1.findCardByName('chrysanthemum-steward');
            this.ann = this.player1.findCardByName('a-new-name');
            this.seiji = this.player1.findCardByName('seiji-s-fate');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('should remove traits and add creature', function () {
            expect(this.steward.hasTrait('imperial')).toBe(true);
            expect(this.steward.hasTrait('courtier')).toBe(true);
            expect(this.steward.hasTrait('creature')).toBe(false);

            this.player1.playAttachment(this.seiji, this.steward);

            expect(this.steward.hasTrait('imperial')).toBe(true);
            expect(this.steward.hasTrait('courtier')).toBe(false);
            expect(this.steward.hasTrait('creature')).toBe(true);
        });

        it('should blank', function () {
            this.player1.playAttachment(this.seiji, this.steward);
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.steward);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should remove gained traits', function () {
            this.player1.playAttachment(this.ann, this.challenger);
            expect(this.challenger.hasTrait('bushi')).toBe(true);
            expect(this.challenger.hasTrait('duelist')).toBe(true);
            expect(this.challenger.hasTrait('courtier')).toBe(true);
            expect(this.challenger.hasTrait('creature')).toBe(false);

            this.player2.pass();
            this.player1.playAttachment(this.seiji, this.challenger);

            expect(this.challenger.hasTrait('bushi')).toBe(true);
            expect(this.challenger.hasTrait('duelist')).toBe(true);
            expect(this.challenger.hasTrait('courtier')).toBe(false);
            expect(this.challenger.hasTrait('creature')).toBe(true);
        });
    });
});
