describe('Surging Wave', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate', 'doji-challenger', 'togashi-mitsu'],
                    hand: ['surging-wave', 'hurricane-punch', 'fine-katana']
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
            this.swell = this.player1.findCardByName('surging-wave');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.kazue = this.player2.findCardByName('togashi-kazue');
            this.hurricane2 = this.player2.findCardByName('hurricane-punch');
        });

        it('should allow selecting a participating monk with 1 or more status tokens - no kiho played', function() {
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

        it('should not work when no participating monks have a status token - no kiho played', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan, this.kazue],
                type: 'military'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.swell);
            expect(this.player1).toHavePrompt('Conflict Action Window');
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
            expect(this.getChatLogs(5)).toContain('player1 plays Surging Wave to discard all status tokens from Togashi Initiate');
            expect(this.initiate.isTainted).toBe(false);
            expect(this.initiate.isDishonored).toBe(false);
            expect(this.initiate.isHonored).toBe(false);
        });

        it('should not prompt to prevent bowing without an additional kiho and not prevent bowing', function() {
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
            expect(this.player2).toHavePrompt('Conflict Action Window');

            this.noMoreActions();
            expect(this.initiate.bowed).toBe(true);
            expect(this.kuwanan.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not prompt if you have not fate to prevent bowing without an additional kiho and not prevent bowing', function() {
            this.initiate.honor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.fate = 0;
            expect(this.initiate.isHonored).toBe(true);
            this.player1.clickCard(this.swell);
            this.player1.clickCard(this.initiate);
            expect(this.initiate.isHonored).toBe(false);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            this.noMoreActions();
            expect(this.initiate.bowed).toBe(true);
            expect(this.kuwanan.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should prevent bowing at the end of the conflict if choice is selected', function() {
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
            let fate = this.player1.fate;
            expect(this.player1).toHavePrompt('Spend 1 fate to prevent ' + this.initiate.name + ' from bowing at the end of the conflict?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('Yes');
            expect(this.getChatLogs(5)).toContain('player1 plays Surging Wave to discard all status tokens from Togashi Initiate');
            expect(this.getChatLogs(5)).toContain('player1 chooses to spend a fate to prevent Togashi Initiate from bowing during conflict resolution');
            expect(this.player1.fate).toBe(fate - 1);
            this.noMoreActions();
            expect(this.initiate.bowed).toBe(false);
            expect(this.kuwanan.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not prevent bowing at the end of the conflict if choice is not selected', function() {
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
            let fate = this.player1.fate;
            expect(this.player1).toHavePrompt('Spend 1 fate to prevent ' + this.initiate.name + ' from bowing at the end of the conflict?');
            this.player1.clickPrompt('No');
            expect(this.getChatLogs(5)).toContain('player1 plays Surging Wave to discard all status tokens from Togashi Initiate');
            expect(this.getChatLogs(5)).toContain('player1 chooses not to spend a fate to prevent Togashi Initiate from bowing during conflict resolution');
            expect(this.player1.fate).toBe(fate);
            this.noMoreActions();
            expect(this.initiate.bowed).toBe(true);
            expect(this.kuwanan.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should force spending fate if no status tokens', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            let fate = this.player1.fate;
            this.player1.clickCard(this.hurricane);
            this.player1.clickCard(this.initiate);
            this.player2.pass();
            this.player1.clickCard(this.swell);
            this.player1.clickCard(this.initiate);
            expect(this.player1).not.toHavePrompt('Spend 1 fate to prevent ' + this.initiate.name + ' from bowing at the end of the conflict?');
            expect(this.getChatLogs(5)).toContain('player1 plays Surging Wave to discard all status tokens from Togashi Initiate');
            expect(this.getChatLogs(5)).toContain('player1 chooses to spend a fate to prevent Togashi Initiate from bowing during conflict resolution');
            expect(this.player1.fate).toBe(fate - 1);
            this.noMoreActions();
            expect(this.initiate.bowed).toBe(false);
            expect(this.kuwanan.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
