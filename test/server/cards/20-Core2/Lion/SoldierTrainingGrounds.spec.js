describe('Soldier Training Grounds', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['soldier-training-grounds']
                }
            });
            this.akodoWarCollege = this.player1.placeCardInProvince('soldier-training-grounds');
            this.akodoWarCollege.facedown = false;
        });

        it('puts an Ahigaru into play', function () {
            this.player1.clickCard(this.akodoWarCollege);
            expect(this.player1.player.cardsInPlay.first().name).toBe('Akodo Recruit');
            expect(this.getChatLogs(5)).toContain('player1 uses Soldier Training Grounds to recruit Akodo Recruit!');
        });
    });
});
