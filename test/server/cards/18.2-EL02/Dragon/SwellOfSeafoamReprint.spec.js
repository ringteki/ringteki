describe('Swell of Seafoam Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate', 'doji-challenger', 'togashi-mitsu'],
                    hand: ['see-the-foam-be-the-foam', 'hurricane-punch', 'fine-katana']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'togashi-kazue'],
                    hand: ['hurricane-punch']
                }
            });

            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.hurricane = this.player1.findCardByName('hurricane-punch');
            this.katana = this.player1.findCardByName('fine-katana');
            this.swell = this.player1.findCardByName('see-the-foam-be-the-foam');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.kazue = this.player2.findCardByName('togashi-kazue');
            this.hurricane2 = this.player2.findCardByName('hurricane-punch');
        });

        it('should allow selecting a participating monk with 1 or more status tokens', function() {
            this.initiate.taint();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan, this.kazue],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.swell);
            expect(this.player1).toBeAbleToSelect(this.initiate);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
        });
        
        it('should discard all status tokens', function() {
            this.initiate.dishonor();
            this.initiate.taint();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            expect(this.initiate.isTainted).toBe(true);
            expect(this.initiate.isDishonored).toBe(true);
            this.player1.clickCard(this.swell);
            this.player1.clickCard(this.initiate);
            expect(this.getChatLogs(5)).toContain('player1 plays See the Foam, Be the Foam to discard all status tokens from Togashi Initiate');
            expect(this.initiate.isTainted).toBe(false);
            expect(this.initiate.isDishonored).toBe(false);
            expect(this.initiate.isHonored).toBe(false);
        });

        it('should not prevent bowing at the end of the conflict without an additional kiho', function() {
            this.initiate.honor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            expect(this.initiate.isHonored).toBe(true);
            this.player1.clickCard(this.swell);
            this.player1.clickCard(this.initiate);
            expect(this.initiate.isHonored).toBe(false);

            this.noMoreActions();
            expect(this.initiate.bowed).toBe(true);
            expect(this.kuwanan.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should prevent bowing at the end of the conflict', function() {
            this.initiate.honor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.hurricane);
            this.player1.clickCard(this.initiate);
            this.player2.pass();
            expect(this.initiate.isHonored).toBe(true);
            this.player1.clickCard(this.swell);
            this.player1.clickCard(this.initiate);
            expect(this.initiate.isHonored).toBe(false);

            expect(this.getChatLogs(3)).toContain('player1 plays See the Foam, Be the Foam to discard all status tokens from Togashi Initiate and prevent them from bowing at the end of the conflict');
            this.noMoreActions();
            expect(this.initiate.bowed).toBe(false);
            expect(this.kuwanan.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not prevent bowing if only opponent has played a kiho', function() {
            this.initiate.honor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.kuwanan, this.kazue],
                type: 'military'
            });

            this.player2.clickCard(this.hurricane2);
            this.player2.clickCard(this.kazue);
            this.player1.clickCard(this.swell);
            this.player1.clickCard(this.initiate);
            this.noMoreActions();
            expect(this.initiate.bowed).toBe(true);
            expect(this.kuwanan.bowed).toBe(true);
        });

        it('should not discard status tokens if a non-kiho has been played', function() {
            this.initiate.honor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.initiate);
            this.player2.pass();
            this.player1.clickCard(this.swell);
            this.player1.clickCard(this.initiate);
            expect(this.initiate.isHonored).toBe(false);
            this.noMoreActions();
            expect(this.initiate.bowed).toBe(true);
            expect(this.kuwanan.bowed).toBe(true);
        });
    });
});
