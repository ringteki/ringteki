describe('Adept of the Waves', function() {
    integration(function() {
        describe('Adept of the Waves\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'solemn-scholar'],
                        hand: ['common-cause'],
                        stronghold: ['twin-soul-temple']
                    },
                    player2: {
                        inPlay: ['kitsu-spiritcaller'],
                        hand: ['cloud-the-mind'],
                        provinces: ['entrenched-position']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.kitsuSpiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
                this.cloudTheMind = this.player2.findCardByName('cloud-the-mind');
                this.entrenchedPosition = this.player2.findCardByName('entrenched-position');
                this.cause = this.player1.findCardByName('common-cause');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.temple = this.player1.findCardByName('twin-soul-temple');
            });

            it('should be able to grant covert to any character', function() {
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).toBeAbleToSelect(this.kitsuSpiritcaller);
            });

            it('should grant covert during water conflicts', function() {
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.noMoreActions();
                this.player1.clickRing('water');
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.entrenchedPosition);
                expect(this.player1).toHavePrompt('Choose defenders to Covert');
            });

            it('should not grant covert during non-water conflicts', function() {
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.entrenchedPosition);
                expect(this.player1).not.toHavePrompt('Choose defenders to Covert');
            });

            it('should grant covert during water conflicts even if Adept gets blanked', function() {
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player2.playAttachment(this.cloudTheMind, this.adeptOfTheWaves);
                this.noMoreActions();
                this.player1.clickRing('water');
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.entrenchedPosition);
                expect(this.player1).toHavePrompt('Choose defenders to Covert');
            });

            it('should grant covert during non-water conflicts if element is changed and Adept leaves play', function() {
                this.scholar.bow();
                this.player1.clickCard(this.temple);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickPrompt('air');
                this.player2.pass();
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.scholar);
                this.player2.pass();
                this.player1.clickCard(this.cause);
                this.player1.clickCard(this.scholar);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickCard(this.scholar);
                this.player1.clickCard(this.entrenchedPosition);
                expect(this.player1).toHavePrompt('Choose defenders to Covert');
            });
        });
    });
});
