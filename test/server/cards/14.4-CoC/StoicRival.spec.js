describe('Stoic Rival', function() {
    integration(function() {
        describe('Stoic Rival\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['stoic-rival'],
                        hand: ['vine-tattoo','ornate-fan']
                    },
                    player2: {
                        inPlay: ['shiba-tsukune', 'otomo-courtier'],
						hand:['ornate-fan','ornate-fan','ornate-fan']
                    }
                });
				this.initiateConflict({
                    attackers: ['stoic-rival'],
                    defenders: ['shiba-tsukune','otomo-courtier']
                });
                this.noMoreActions();
                this.otomoCourtier = this.player2.findCardByName('otomo-courtier');
                this.shibaTsukune = this.player2.findCardByName('shiba-tsukune');
                this.player2.playAttachment('ornate-fan','shiba-tsukune');
				this.player1.playAttachment('vine-tattoo','stoic-rival');
            });


            it('should only allow bowing cards with fewer attachment mil skill', function() {
                this.stoicRival = this.player1.clickCard('stoic-rival');
                expect(this.player1).toHavePrompt('Stoic Rival');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                expect(this.player1).not.toBeAbleToSelect(this.shibaTsukune);
            });

            it('should allow allow bowing cards with an attachment but still fewer', function() {
                this.player1.playAttachment('ornate-fan', 'stoic-rival');
                this.player2.pass();
                this.stoicRival = this.player1.clickCard('stoic-rival');
                expect(this.player1).toHavePrompt('Stoic Rival');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
            });

            it('should dishonor the target', function() {
                this.stoicRival= this.player1.clickCard('stoic-rival');
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.isDishonored).toBe(true);
                expect(this.seppunGuardsman.inConflict).toBe(true);
            });
        });
    });
});
