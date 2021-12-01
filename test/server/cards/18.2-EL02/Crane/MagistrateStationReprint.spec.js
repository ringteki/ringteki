describe('Magistrate Station Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer','doji-hotaru', 'asahina-artisan', 'lion-s-pride-brawler'],
                    provinces: ['magistrate-outpost'],
                    hand: ['mirumoto-s-fury', 'admit-defeat']
                },
                player2: {
                    inPlay: ['eager-scout'],
                    hand: ['mirumoto-s-fury']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.artisan = this.player1.findCardByName('asahina-artisan');
            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.defeat = this.player1.findCardByName('admit-defeat');
            this.station = this.player1.findCardByName('magistrate-outpost');
            this.brawler = this.player1.findCardByName('lion-s-pride-brawler');
            this.station.facedown = false;

            this.scout = this.player2.findCardByName('eager-scout');
            this.fury = this.player1.findCardByName('mirumoto-s-fury');
            this.fury2 = this.player2.findCardByName('mirumoto-s-fury');
        });

        it('should work in a conflict and stop an honored character you control from bowing', function() {
            this.hotaru.honor();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru],
                defenders: [this.scout]
            });
            this.player2.clickCard(this.fury2);
            this.player2.clickCard(this.hotaru);
            expect(this.hotaru.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.station);
            this.player1.clickCard(this.station);
            expect(this.hotaru.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 uses Magistrate Outpost to prevent Doji Hotaru from bowing');
        });

        it('should work in a conflict and stop an honored character you control from bowing if you bow it yourself', function() {
            this.hotaru.honor();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru],
                defenders: [this.scout]
            });
            this.player2.pass();
            this.player1.clickCard(this.fury);
            this.player1.clickCard(this.hotaru);
            expect(this.hotaru.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.station);
            this.player1.clickCard(this.station);
            expect(this.hotaru.bowed).toBe(false);
        });

        it('should not prevent a non-honored character from bowing', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru],
                defenders: [this.scout]
            });
            this.player2.pass();
            this.player1.clickCard(this.fury);
            this.player1.clickCard(this.hotaru);
            expect(this.hotaru.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should not work on costs', function() {
            this.hotaru.honor();
            this.artisan.honor();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru, this.artisan],
                defenders: [this.scout]
            });
            this.player2.pass();
            this.player1.clickCard(this.artisan);
            this.player1.clickCard(this.hotaru);
            expect(this.artisan.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should not work on non-participating characters', function() {
            this.artisan.honor();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru, this.brawler],
                defenders: [this.scout]
            });
            this.player2.pass();
            this.player1.clickCard(this.brawler);
            this.player1.clickCard(this.artisan);
            expect(this.artisan.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should not work on non-participating characters', function() {
            this.artisan.honor();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru, this.brawler],
                defenders: [this.scout]
            });
            this.player2.pass();
            this.player1.clickCard(this.brawler);
            this.player1.clickCard(this.artisan);
            expect(this.artisan.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should not work on opponents characters', function() {
            this.scout.honor();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru],
                defenders: [this.scout]
            });
            this.player2.pass();
            this.player1.clickCard(this.defeat);
            this.player1.clickCard(this.scout);
            expect(this.scout.bowed).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should work on conflict resolution', function() {
            this.hotaru.honor();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.hotaru, this.brawler],
                defenders: [this.scout]
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toBeAbleToSelect(this.station);
            this.player1.clickCard(this.station);
            expect(this.hotaru.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
