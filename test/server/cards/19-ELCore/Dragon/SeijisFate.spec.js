describe('Seijis Fate', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-yokuni'],
                    hand: ['a-new-name', 'seiji-s-fate']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.yokuni = this.player1.findCardByName('togashi-yokuni');
            this.ann = this.player1.findCardByName('a-new-name');
            this.seiji = this.player1.findCardByName('seiji-s-fate');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('should remove traits and add creature', function () {
            expect(this.yokuni.hasTrait('champion')).toBe(true);
            expect(this.yokuni.hasTrait('bushi')).toBe(true);
            expect(this.yokuni.hasTrait('shugenja')).toBe(true);
            expect(this.yokuni.hasTrait('creature')).toBe(false);

            this.player1.playAttachment(this.seiji, this.yokuni);

            expect(this.yokuni.hasTrait('champion')).toBe(false);
            expect(this.yokuni.hasTrait('bushi')).toBe(false);
            expect(this.yokuni.hasTrait('shugenja')).toBe(false);
            expect(this.yokuni.hasTrait('creature')).toBe(true);
        });

        it('should blank', function () {
            this.player1.playAttachment(this.seiji, this.yokuni);
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.yokuni);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not remove gained traits', function () {
            this.player1.playAttachment(this.ann, this.yokuni);
            expect(this.yokuni.hasTrait('champion')).toBe(true);
            expect(this.yokuni.hasTrait('bushi')).toBe(true);
            expect(this.yokuni.hasTrait('shugenja')).toBe(true);
            expect(this.yokuni.hasTrait('creature')).toBe(false);

            this.player2.pass();
            this.player1.playAttachment(this.seiji, this.yokuni);

            expect(this.yokuni.hasTrait('champion')).toBe(false);
            expect(this.yokuni.hasTrait('bushi')).toBe(true);
            expect(this.yokuni.hasTrait('courtier')).toBe(true);
            expect(this.yokuni.hasTrait('shugenja')).toBe(false);
            expect(this.yokuni.hasTrait('creature')).toBe(true);
        });
    });
});
