describe('Shinsei\'s Last Hope', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['kakita-yoshi', 'kakita-toshimoko'],
                    provinces: ['shinsei-s-last-hope', 'manicured-garden']
                }
            });

            this.lastHope = this.player1.findCardByName('shinsei-s-last-hope', 'province 1');
            this.manicured = this.player1.findCardByName('manicured-garden', 'province 2');
            this.yoshi = this.player1.placeCardInProvince('kakita-yoshi', 'province 1');
            this.toshimoko = this.player1.placeCardInProvince('kakita-toshimoko', 'province 2');
        });

        it('should reduce the character cost by 2 and enter dishonored', function() {
            this.preYoshiFate = this.player1.fate;

            expect(this.lastHope.facedown).toBe(false);

            this.player1.clickCard(this.yoshi);
            this.player1.clickPrompt('0');

            expect(this.player1.fate).toBe(this.preYoshiFate - (this.yoshi.printedCost - 2));
            expect(this.yoshi.isDishonored).toBe(true);
        });

        it('should not influence other provinces', function() {
            this.preToshimokoFate = this.player1.fate;

            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('0');

            expect(this.player1.fate).toBe(this.preToshimokoFate - this.toshimoko.printedCost);
            expect(this.toshimoko.isDishonored).toBe(false);
        });
    });
});
