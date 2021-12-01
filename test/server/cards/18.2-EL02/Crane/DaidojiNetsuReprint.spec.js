describe('Daidoji Netsu Reprint', function() {
    integration(function() {
        describe('Daidoji Netsu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['daidoji-not-su', 'doji-hotaru-2', 'steadfast-witch-hunter', 'doji-whisperer'],
                        hand: ['way-of-the-crane', 'way-of-the-scorpion', 'noble-sacrifice', 'way-of-the-crab', 'seal-of-the-crab', 'charge', 'forebearer-s-echoes', 'feral-ningyo', 'adept-of-shadows'],
                        dynastyDiscard: ['funeral-pyre', 'doji-kuwanan', 'fushicho', 'isawa-ujina']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja', 'steadfast-witch-hunter'],
                        hand: ['isawa-tadaka-2', 'assassination']
                    }
                });

                this.netsu = this.player1.findCardByName('daidoji-not-su');
                this.hotaru = this.player1.findCardByName('doji-hotaru-2');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.pyre = this.player1.findCardByName('funeral-pyre');
                this.p1WitchHunter = this.player1.findCardByName('steadfast-witch-hunter');

                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
                this.nobleSacrifice = this.player1.findCardByName('noble-sacrifice');
                this.assassination = this.player2.findCardByName('assassination');
                this.wayOfTheCrab = this.player1.findCardByName('way-of-the-crab');
                this.sealOfTheCrab = this.player1.findCardByName('seal-of-the-crab');
                this.charge = this.player1.findCardByName('charge');
                this.echoes = this.player1.findCardByName('forebearer-s-echoes');
                this.ningyo = this.player1.findCardByName('feral-ningyo');
                this.shadows = this.player1.findCardByName('adept-of-shadows');
                this.fushicho = this.player1.findCardByName('fushicho');
                this.ujina = this.player1.findCardByName('isawa-ujina');

                this.doomed = this.player2.findCardByName('doomed-shugenja');
                this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
                this.p2WitchHunter = this.player2.findCardByName('steadfast-witch-hunter');

                this.player1.playAttachment(this.sealOfTheCrab, this.netsu);
                this.player1.placeCardInProvince(this.pyre, 'province 1');
                this.player1.placeCardInProvince(this.kuwanan, 'province 2');
                this.pyre.facedown = false;
                this.kuwanan.facedown = false;
                this.p2WitchHunter.bowed = true;
                this.p1WitchHunter.bowed = true;
            });

            it('should stop other charactrs you control from being discarded by opponent', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: []
                });
                this.player2.clickCard(this.assassination);
                expect(this.player2).toBeAbleToSelect(this.netsu);
                expect(this.player2).toBeAbleToSelect(this.doomed);
                expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            });

            it('should not prevent you from discarding your own characters', function() {
                this.hotaru.honor();
                this.whisperer.dishonor();
                this.netsu.honor();
                this.doomed.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                this.player1.clickCard(this.nobleSacrifice);
                this.player1.clickPrompt('Pay costs first');
                expect(this.player1).toBeAbleToSelect(this.netsu);
                expect(this.player1).toBeAbleToSelect(this.hotaru);
                this.player1.clickCard(this.hotaru);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.doomed);
            });

            it('should not stop Hotaru and Kuwanan from killing each other', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                this.player1.clickCard(this.charge);
                this.player1.clickCard(this.kuwanan);
                expect(this.kuwanan.location).toBe('dynasty discard pile');
                expect(this.hotaru.location).toBe('dynasty discard pile');
            });

            it('should allow disguised to be used', function() {
                this.player2.clickCard(this.tadaka);
                expect(this.player2).toHavePromptButton('Play this character with Disguise');
                expect(this.player2).toHavePromptButton('Play this character');
            });

            it('should not stop costs', function() {
                this.player2.clickCard(this.p2WitchHunter);
                expect(this.player2).toHavePrompt('Steadfast Witch Hunter');
            });
        });
    });
});
