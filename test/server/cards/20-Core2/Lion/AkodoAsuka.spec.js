describe('Akodo Asuka', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-asuka', 'adept-of-the-waves', 'solemn-scholar'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['shinjo-outrider', 'shinjo-scout']
                }
            });
            this.akodoAsuka = this.player1.findCardByName('akodo-asuka');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.katana = this.player1.findCardByName('fine-katana');
            this.scholar = this.player1.findCardByName('solemn-scholar');

            this.outrider = this.player2.findCardByName('shinjo-outrider');
            this.scout = this.player2.findCardByName('shinjo-scout');
        });

        it('should trigger after she wins a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.adept],
                defenders: [this.outrider]
            });
            this.noMoreActions();
            expect(this.player1).toBeAbleToSelect(this.akodoAsuka);
        });

        it('should allow you to honor another pariticipating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.adept],
                defenders: [this.outrider]
            });
            this.noMoreActions();
            this.player1.clickCard(this.akodoAsuka);
            expect(this.player1).toBeAbleToSelect(this.adept);
        });

        it('should honor the chosen character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.adept],
                defenders: [this.outrider]
            });
            this.noMoreActions();
            this.player1.clickCard(this.akodoAsuka);
            this.player1.clickCard(this.adept);
            expect(this.adept.isHonored).toBe(true);
        });

        it('should not let her honor herself', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.adept],
                defenders: [this.outrider]
            });
            this.noMoreActions();
            this.player1.clickCard(this.akodoAsuka);
            expect(this.player1).not.toBeAbleToSelect(this.akodoAsuka);
        });

        it('should not let you honor characters at home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.adept],
                defenders: [this.outrider]
            });
            this.noMoreActions();
            this.player1.clickCard(this.akodoAsuka);
            expect(this.player1).not.toBeAbleToSelect(this.scholar);
        });

        it('should let you honor your opponent characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.adept],
                defenders: [this.outrider]
            });
            this.noMoreActions();
            this.player1.clickCard(this.akodoAsuka);
            expect(this.player1).toBeAbleToSelect(this.outrider);
        });
    });
});