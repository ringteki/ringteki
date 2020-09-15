describe('Bayushi Kachiko 2', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-kachiko-2', 'kitsu-motso'],
                    conflictDiscard: ['forged-edict'],
                },
                player2: {
                    inPlay: ['master-tactician'],
                    hand: ['mirumoto-s-fury', 'backhanded-compliment'],
                    conflictDiscard: ['voice-of-honor', 'soul-beyond-reproach', 'tactical-ingenuity', 'ornate-fan', 'court-games']
                }
            });

            this.motso = this.player1.findCardByName('kitsu-motso');
            this.kachiko = this.player1.findCardByName('bayushi-kachiko-2');
            this.voice = this.player2.findCardByName('voice-of-honor');
            this.soul = this.player2.findCardByName('soul-beyond-reproach');
            this.tactical = this.player2.findCardByName('tactical-ingenuity');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.courtGames = this.player2.findCardByName('court-games');
            this.fury = this.player2.findCardByName('mirumoto-s-fury');
            this.backhanded = this.player2.findCardByName('backhanded-compliment');

            this.tacticianp2 = this.player2.findCardByName('master-tactician');
        });

        describe('Playing from opponent\'s conflict deck', function() {
            it('should let you play while participating in a pol conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kachiko, this.motso],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.soul);
                this.player1.clickCard(this.kachiko);
                expect(this.kachiko.isHonored).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not let opponent play while participating in a pol conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kachiko, this.motso],
                    defenders: []
                });
                this.player2.clickCard(this.soul);
                this.player2.clickCard(this.tacticianp2);
                expect(this.tacticianp2.isHonored).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        // describe('Max 3 cards', function() {
        //     it('should let you play three cards, but look at the fourth', function () {
        //         this.player1.clickCard(this.ambush);
        //         this.player1.clickCard(this.province);
        //         this.noMoreActions();
        //         this.initiateConflict({
        //             type: 'military',
        //             attackers: [this.tactician],
        //             defenders: []
        //         });
        //         expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
        //         expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);

        //         this.player2.pass();

        //         this.player1.clickCard(this.tactical);
        //         this.player1.clickCard(this.tactician);
        //         expect(this.tactician.attachments.toArray()).toContain(this.tactical);

        //         expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
        //         expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);

        //         this.player2.pass();

        //         this.player1.clickCard(this.soul);
        //         this.player1.clickCard(this.tactician);
        //         expect(this.tactician.isHonored).toBe(true);

        //         expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
        //         expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);

        //         this.player2.clickCard(this.fury);
        //         this.player2.clickCard(this.tactician);

        //         expect(this.player1).toHavePrompt('Triggered Abilities');
        //         expect(this.player1).toBeAbleToSelect(this.voice);
        //         this.player1.clickCard(this.voice);

        //         expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
        //         expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);

        //         expect(this.player1).toHavePrompt('Conflict Action Window');
        //         this.player1.clickCard(this.fan);
        //         expect(this.player1).toHavePrompt('Conflict Action Window');
        //     });
        // });

        // it('chat messages', function () {
        //     this.player1.clickCard(this.ambush);
        //     this.player1.clickCard(this.province);
        //     this.noMoreActions();
        //     this.initiateConflict({
        //         type: 'military',
        //         attackers: [this.tactician],
        //         defenders: []
        //     });
        //     this.player2.pass();

        //     this.player1.clickCard(this.tactical);
        //     this.player1.clickCard(this.tactician);
        //     expect(this.getChatLogs(3)).toContain('player1 plays a card from their conflict deck due to the ability of Master Tactician (2 uses remaining)');

        //     this.player2.pass();

        //     this.player1.clickCard(this.soul);
        //     this.player1.clickCard(this.tactician);
        //     expect(this.getChatLogs(3)).toContain('player1 plays a card from their conflict deck due to the ability of Master Tactician (1 use remaining)');

        //     this.player2.clickCard(this.fury);
        //     this.player2.clickCard(this.tactician);
        //     this.player1.clickCard(this.voice);
        //     expect(this.getChatLogs(3)).toContain('player1 plays a card from their conflict deck due to the ability of Master Tactician (0 uses remaining)');
        // });
    });
});