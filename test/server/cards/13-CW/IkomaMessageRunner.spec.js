describe('Ikoma Message Runner', function() {
    integration(function() {
        describe('Ikoma Message Runner\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['ikoma-prodigy', 'akodo-toturi', 'akodo-kaede']
                    },
                    player2: {
                        inPlay: ['ikoma-message-runner'],
                        dynastyDiscard: ['matsu-berserker', 'matsu-tsuko', 'kitsu-motso']
                    }
                });
                this.ikomaProdigy = this.player1.placeCardInProvince('ikoma-prodigy', 'province 1');
                this.toturi = this.player1.placeCardInProvince('akodo-toturi', 'province 2');
                this.kaede = this.player1.placeCardInProvince('akodo-kaede', 'province 3');

                this.ikomaMessageRunner = this.player2.findCardByName('ikoma-message-runner');
                this.berserker = this.player2.placeCardInProvince('matsu-berserker', 'province 1');
                this.tsuko = this.player2.placeCardInProvince('matsu-tsuko', 'province 2');
                this.motso = this.player2.placeCardInProvince('kitsu-motso', 'province 3');

                this.ikomaProdigy.facedown = true;
                this.toturi.facedown = true;
                this.kaede.facedown = false;

                this.berserker.facedown = true;
                this.tsuko.facedown = true;
                this.motso.facedown = false;

                this.player1.pass();
            });

            it('should reveal facedown cards', function() {
                this.player2.clickCard(this.ikomaMessageRunner);
                expect(this.player2).toHavePrompt('Choose a facedown card in your provinces');
                this.player2.clickCard(this.tsuko);

                expect(this.toturi.facedown).toBe(true);
                expect(this.tsuko.facedown).toBe(true);

                expect(this.player2).toHavePrompt('Choose a facedown card in opponents provinces');
                this.player2.clickCard(this.toturi);

                expect(this.toturi.facedown).toBe(false);
                expect(this.tsuko.facedown).toBe(false);
                expect(this.ikomaProdigy.facedown).toBe(true);
                expect(this.berserker.facedown).toBe(true);

                expect(this.getChatLog(5)).toContain('Player2 uses Ikoma Message Runner to reveal');
            });
        });
    });
});
