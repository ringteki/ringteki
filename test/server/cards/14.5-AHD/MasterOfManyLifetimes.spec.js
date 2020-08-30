describe('Master Of Many Lifetimes', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-many-lifetimes', 'matsu-berserker', 'ancient-master', 'togashi-hoshi', 'callow-delegate'],
                    hand: ['fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: ['keeper-initiate'],
                    hand: ['assassination']
                }
            });

            this.moml = this.player1.findCardByName('master-of-many-lifetimes');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.callowDelegate = this.player1.findCardByName('callow-delegate');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.hoshi = this.player1.findCardByName('togashi-hoshi');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ornateFan = this.player1.findCardByName('ornate-fan');
            this.shameful = this.player1.findCardByName('shameful-display', 'province 1');

            this.keeper = this.player2.findCardByName('keeper-initiate');
            this.assassination = this.player2.findCardByName('assassination');
        });

        it('should trigger when a character you control would leave play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: []
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.moml);
        });

        it('should not trigger when a character you don\'t control would leave play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.keeper]
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.keeper);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should return all attachments to hand and the character to the chosen province', function() {
            this.player1.playAttachment(this.fineKatana, this.berserker);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: []
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.moml);
            this.player1.clickCard(this.moml);
            this.player1.clickCard(this.shameful);

            expect(this.berserker.location).toBe(this.shameful.location);
            expect(this.fineKatana.location).toBe('hand');
            expect(this.player1).toHavePrompt('conflict action window');
        });

        it('should still trigger leave play effects', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.callowDelegate],
                defenders: []
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.callowDelegate);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.moml);
            expect(this.player1).not.toBeAbleToSelect(this.callowDelegate);
            this.player1.clickCard(this.moml);
            this.player1.clickCard(this.shameful);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.callowDelegate);
            this.player1.clickCard(this.callowDelegate);
            this.player1.clickCard(this.ancientMaster);

            expect(this.ancientMaster.isHonored).toBe(true);
            expect(this.callowDelegate.location).toBe(this.shameful.location);
            expect(this.player1).toHavePrompt('conflict action window');
        });

        // Ruling: Conflict characters can't enter provinces
        it('should discard a conflict character and return all attachments to hand', function() {
            this.player1.playAttachment(this.fineKatana, this.ancientMaster);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ancientMaster],
                defenders: []
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.ancientMaster);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.moml);
            this.player1.clickCard(this.moml);
            this.player1.clickCard(this.shameful);

            expect(this.ancientMaster.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('Ancient Master is discarded instead since it can\'t enter a province legally!');
            expect(this.fineKatana.location).toBe('hand');
            expect(this.player1).toHavePrompt('conflict action window');
        });

        // Ruling: Conflict cards in general can't enter provinces
        it('should discard a conflict card and return all attachments to hand', function() {
            this.player1.clickCard(this.ornateFan);
            this.player1.clickCard(this.ancientMaster);
            this.player2.pass();

            this.player1.clickCard(this.hoshi);
            expect(this.player1).toBeAbleToSelect(this.ornateFan);
            this.player1.clickCard(this.ornateFan);
            this.player2.pass();

            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.ornateFan);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ornateFan],
                defenders: []
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.ornateFan);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.moml);
            this.player1.clickCard(this.moml);
            this.player1.clickCard(this.shameful);

            expect(this.ornateFan.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('Ornate Fan is discarded instead since it can\'t enter a province legally!');
            expect(this.fineKatana.location).toBe('hand');
            expect(this.player1).toHavePrompt('conflict action window');
        });
    });
});
