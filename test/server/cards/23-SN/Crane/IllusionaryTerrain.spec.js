describe('Illusionary Terrain', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-toshimoko', 'eager-scout'],
                    provinces: ['entrenched-position', 'abandoning-honor', 'manicured-garden', 'midnight-revels'],
                    hand: ['cloud-the-mind', 'fine-katana', 'ornate-fan'],
                    role: 'keeper-of-void'
                },
                player2: {
                    inPlay: ['brash-samurai'],
                    provinces: ['the-pursuit-of-justice', 'fertile-fields', 'avalanche-of-stone', 'elemental-fury'],
                    hand: ['illusionary-terrain'],
                    dynastyDiscard: ['doomed-shugenja', 'asahina-augur'],
                    role: 'keeper-of-void'
                }
            });

            this.position = this.player1.findCardByName('entrenched-position');
            this.manicuredGarden = this.player1.findCardByName('manicured-garden');
            this.abandoning = this.player1.findCardByName('abandoning-honor');
            this.revels = this.player1.findCardByName('midnight-revels');

            this.fury = this.player2.findCardByName('elemental-fury');
            this.fields = this.player2.findCardByName('fertile-fields');
            this.stone = this.player2.findCardByName('avalanche-of-stone');
            this.justice = this.player2.findCardByName('the-pursuit-of-justice');

            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.scout = this.player1.findCardByName('eager-scout');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.doomed = this.player2.findCardByName('doomed-shugenja');
            this.augur = this.player2.findCardByName('asahina-augur');

            this.terrain = this.player2.findCardByName('illusionary-terrain');

            this.position.facedown = false;
            this.manicuredGarden.facedown = false;
            this.abandoning.facedown = false;
            this.revels.facedown = false;
            this.fury.facedown = false;
            this.fields.facedown = true;
            this.stone.facedown = false;
            this.justice.facedown = false;

            this.abandoning.broken = true;

            this.game.checkGameState(true);
        });

        it('targeting - no affinity', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                province: this.fury
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);

            expect(this.player2).not.toBeAbleToSelect(this.position);
            expect(this.player2).not.toBeAbleToSelect(this.manicuredGarden);
            expect(this.player2).not.toBeAbleToSelect(this.abandoning);
            expect(this.player2).not.toBeAbleToSelect(this.revels);

            expect(this.player2).not.toBeAbleToSelect(this.fury);
            expect(this.player2).not.toBeAbleToSelect(this.fields);
            expect(this.player2).toBeAbleToSelect(this.stone);
            expect(this.player2).toBeAbleToSelect(this.justice);
        });

        it('targeting - affinity', function () {
            this.player2.moveCard(this.augur, 'play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                province: this.fury
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);

            expect(this.player2).toBeAbleToSelect(this.position);
            expect(this.player2).toBeAbleToSelect(this.manicuredGarden);
            expect(this.player2).toBeAbleToSelect(this.abandoning);
            expect(this.player2).toBeAbleToSelect(this.revels);

            expect(this.player2).not.toBeAbleToSelect(this.fury);
            expect(this.player2).not.toBeAbleToSelect(this.fields);
            expect(this.player2).toBeAbleToSelect(this.stone);
            expect(this.player2).toBeAbleToSelect(this.justice);
        });

        it('copy - passive effect', function () {
            this.player2.moveCard(this.augur, 'play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.position);

            expect(this.getChatLogs(10)).toContain('player2 plays Illusionary Terrain to transform the attacked province into a copy of Entrenched Position');
            expect(this.fury.name).toBe(this.position.name);
            expect(this.fury.getStrength()).toBe(10); // 5 base + 5 passive effect
            expect(this.player2).toHavePrompt('Choose defenders');
        });

        it('copy onto a facedown province', function () {
            this.fury.facedown = true;
            this.player2.moveCard(this.augur, 'play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.position);

            expect(this.getChatLogs(10)).toContain('player2 plays Illusionary Terrain to transform the attacked province into a copy of Entrenched Position');
            expect(this.fury.name).toBe(this.position.name);
            expect(this.fury.getStrength()).toBe(10); // 5 base + 5 passive effect
            expect(this.player2).toHavePrompt('Choose defenders');
        });

        it('copy - action ability', function () {
            this.player2.moveCard(this.augur, 'play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.manicuredGarden);

            expect(this.getChatLogs(10)).toContain('player2 plays Illusionary Terrain to transform the attacked province into a copy of Manicured Garden');
            this.player2.clickPrompt('Done') // defenders

            let fate = this.player2.fate;
            this.player2.clickCard(this.fury);
            expect(this.player2.fate).toBe(fate + 1);

            expect(this.getChatLogs(10)).toContain('player2 uses Manicured Garden\'s gained ability from Manicured Garden to gain 1 fate');
        });

        it('copy - reaction ability', function () {
            this.player2.moveCard(this.augur, 'play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.revels);

            expect(this.getChatLogs(10)).toContain('player2 plays Illusionary Terrain to transform the attacked province into a copy of Midnight Revels');
            expect(this.player2).toBeAbleToSelect(this.fury);
            this.player2.clickCard(this.fury);
            this.player2.clickCard(this.toshimoko);
            expect(this.toshimoko.bowed).toBe(true);
            expect(this.getChatLogs(10)).toContain('player2 uses Midnight Revels\'s gained ability from Midnight Revels to bow Kakita Toshimoko');
        });

        it('copy - on reveal', function () {
            this.fury.facedown = true;
            this.player2.moveCard(this.augur, 'play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.stone);

            expect(this.getChatLogs(10)).toContain('player2 plays Illusionary Terrain to transform the attacked province into a copy of Avalanche of Stone');
            expect(this.player2).toBeAbleToSelect(this.fury);
            this.player2.clickCard(this.fury);
            expect(this.augur.bowed).toBe(true);
            expect(this.getChatLogs(10)).toContain('player2 uses Avalanche of Stone\'s gained ability from Avalanche of Stone to bow Eager Scout, Brash Samurai and Asahina Augur');
        });

        it('copy - interrupt', function () {
            this.fury.facedown = true;
            this.player2.moveCard(this.augur, 'play area');
            this.scout.dishonor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.abandoning);
            expect(this.getChatLogs(10)).toContain('player2 plays Illusionary Terrain to transform the attacked province into a copy of Abandoning Honor');

            this.player2.clickPrompt('Done') // defenders;
            this.player2.pass();
            this.player1.pass();
            expect(this.player2).toBeAbleToSelect(this.fury);
            this.player2.clickCard(this.fury);
            this.player2.clickCard(this.scout);
            expect(this.scout.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(10)).toContain('player2 uses Abandoning Honor\'s gained ability from Abandoning Honor to discard Eager Scout');
        });

        it('discount 0', function () {
            let fate = this.player2.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.justice);

            expect(this.player2.fate).toBe(fate - 2);
        });

        it('discount 1', function () {
            this.player2.moveCard(this.augur, 'play area');
            let fate = this.player2.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.position);

            expect(this.player2.fate).toBe(fate - 1);
        });

        it('discount 2', function () {
            this.player2.moveCard(this.augur, 'play area');
            this.player2.moveCard(this.doomed, 'play area');
            let fate = this.player2.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko],
                type: 'military',
                province: this.fury
            });

            expect(this.fury.getStrength()).toBe(4); // 4 base
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.terrain);
            this.player2.clickCard(this.terrain);
            this.player2.clickCard(this.position);

            expect(this.player2.fate).toBe(fate);
        });

        // it('should let both players trigger actions', function () {
        //     this.player1.moveCard(this.countryside1, 'province 1');
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.toshimoko],
        //         defenders: [this.negotiator],
        //         type: 'military',
        //         province: this.manicuredGarden
        //     });
        //     let fate1 = this.player1.fate;
        //     let fate2 = this.player2.fate;

        //     this.player2.clickCard(this.manicuredGarden);
        //     expect(this.player1.fate).toBe(fate1);
        //     expect(this.player2.fate).toBe(fate2 + 1);

        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     this.player1.clickCard(this.manicuredGarden);
        //     expect(this.player2).toHavePrompt('Conflict Action Window');
        //     expect(this.player1.fate).toBe(fate1 + 1);
        //     expect(this.player2.fate).toBe(fate2 + 1);

        //     expect(this.getChatLogs(10)).toContain('player2 uses Manicured Garden to gain 1 fate');
        //     expect(this.getChatLogs(10)).toContain('player1 uses Manicured Garden to gain 1 fate');
        // });

        // it('should not let opponent trigger if it\'s my countryside', function () {
        //     this.player2.moveCard(this.countryside2, 'province 1');
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.toshimoko],
        //         defenders: [this.negotiator],
        //         type: 'military',
        //         province: this.manicuredGarden
        //     });
        //     let fate1 = this.player1.fate;
        //     let fate2 = this.player2.fate;

        //     this.player2.clickCard(this.manicuredGarden);
        //     expect(this.player1.fate).toBe(fate1);
        //     expect(this.player2.fate).toBe(fate2 + 1);

        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     this.player1.clickCard(this.manicuredGarden);
        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     expect(this.player1.fate).toBe(fate1);
        //     expect(this.player2.fate).toBe(fate2 + 1);

        //     expect(this.manicuredGarden.anyEffect('canBeTriggeredByOpponent')).toBe(false);
        //     expect(this.getChatLogs(10)).toContain('player2 uses Manicured Garden to gain 1 fate');
        //     expect(this.getChatLogs(10)).not.toContain('player1 uses Manicured Garden to gain 1 fate');
        // });

        // it('should work with interrupts', function () {
        //     this.player2.moveCard(this.countryside2, 'province 1');
        //     this.noMoreActions();
        //     this.player1.passConflict();
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.negotiator],
        //         defenders: [this.scout],
        //         type: 'political',
        //         province: this.abandoning
        //     });

        //     this.toshimoko.dishonor();
        //     this.negotiator.dishonor();

        //     expect(this.abandoning.anyEffect('canBeTriggeredByOpponent')).toBe(true);
        //     this.noMoreActions();

        //     expect(this.player1).toHavePrompt('Triggered Abilities');
        //     expect(this.player1).toBeAbleToSelect(this.abandoning);
        //     this.player1.clickCard(this.abandoning);
        //     expect(this.player1).toBeAbleToSelect(this.toshimoko);
        //     expect(this.player1).toBeAbleToSelect(this.negotiator);
        //     this.player1.clickCard(this.negotiator);
        //     expect(this.negotiator.location).toBe('dynasty discard pile');

        //     expect(this.player2).toHavePrompt('Triggered Abilities');
        //     expect(this.player2).toBeAbleToSelect(this.abandoning);
        //     this.player2.clickCard(this.abandoning);
        //     expect(this.player2).toBeAbleToSelect(this.toshimoko);
        //     this.player2.clickCard(this.toshimoko);
        //     expect(this.toshimoko.location).toBe('dynasty discard pile');
        // });

        // it('should not double up forced triggers', function () {
        //     this.player2.moveCard(this.countryside2, 'province 1');
        //     this.noMoreActions();
        //     this.player1.passConflict();
        //     this.noMoreActions();

        //     let fate = this.game.rings.water.fate;

        //     this.initiateConflict({
        //         attackers: [this.negotiator],
        //         defenders: [this.toshimoko],
        //         type: 'military',
        //         province: this.temple
        //     });

        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     expect(this.game.rings.water.fate).toBe(fate + 1);

        //     expect(this.temple.anyEffect('canBeTriggeredByOpponent')).toBe(true);
        //     expect(this.getChatLogs(10)).toContain('player1 uses Temple of Daikoku to place 1 fate on Water Ring');
        // });

        // it('should only apply to the attacked province', function () {
        //     this.player1.moveCard(this.countryside1, 'province 1');
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.toshimoko],
        //         type: 'military',
        //         province: this.revels
        //     });
        //     this.player1.pass();
        //     this.player2.clickCard(this.revels);
        //     this.player2.clickCard(this.toshimoko);
        //     expect(this.toshimoko.bowed).toBe(true);
        //     this.player1.pass();

        //     expect(this.player2).toHavePrompt('Choose Defenders');
        //     this.player2.clickCard(this.negotiator);
        //     this.player2.clickPrompt('Done');
        //     this.negotiator.bowed = true;
        //     expect(this.player2).toHavePrompt('Conflict Action Window');

        //     expect(this.justice.anyEffect('canBeTriggeredByOpponent')).toBe(false);

        //     expect(this.negotiator.bowed).toBe(true);
        //     this.player2.clickCard(this.justice);
        //     this.player2.clickCard(this.negotiator);
        //     expect(this.negotiator.bowed).toBe(false);
        //     this.player1.clickCard(this.justice);
        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        // });

        // it('Tsanuri - should not let opponent trigger', function () {
        //     this.player1.moveCard(this.countryside1, 'province 1');
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.tsanuri],
        //         defenders: [this.negotiator],
        //         type: 'military',
        //         province: this.manicuredGarden
        //     });
        //     let fate1 = this.player1.fate;
        //     let fate2 = this.player2.fate;

        //     this.player2.clickCard(this.manicuredGarden);
        //     expect(this.player2).toHavePrompt('Conflict Action Window');
        //     expect(this.player1.fate).toBe(fate1);
        //     expect(this.player2.fate).toBe(fate2);
        //     this.player2.pass();

        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     this.player1.clickCard(this.manicuredGarden);
        //     expect(this.player2).toHavePrompt('Conflict Action Window');
        //     expect(this.player1.fate).toBe(fate1 + 1);
        //     expect(this.player2.fate).toBe(fate2);

        //     expect(this.getChatLogs(10)).toContain('player1 uses Manicured Garden to gain 1 fate');
        // });

        // it('Tsanuri on defense - should not let opponent triggers', function () {
        //     this.player2.moveCard(this.countryside2, 'province 1');
        //     this.noMoreActions();
        //     this.player1.passConflict();
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.negotiator],
        //         defenders: [this.tsanuri],
        //         type: 'military',
        //         province: this.fields
        //     });

        //     let cards1 = this.player1.hand.length;
        //     let cards2 = this.player2.hand.length;

        //     this.player1.clickCard(this.fields);
        //     expect(this.player1.hand.length).toBe(cards1 + 1);
        //     expect(this.player2.hand.length).toBe(cards2);

        //     this.player2.clickCard(this.fields);
        //     expect(this.player1.hand.length).toBe(cards1 + 1);
        //     expect(this.player2.hand.length).toBe(cards2);
        //     expect(this.player2).toHavePrompt('Conflict Action Window');

        //     expect(this.fields.anyEffect('canBeTriggeredByOpponent')).toBe(true);
        // });

        // it('should respect triggering limits - my province', function () {
        //     this.player1.moveCard(this.countryside1, 'province 1');
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.toshimoko],
        //         defenders: [this.negotiator],
        //         type: 'military',
        //         province: this.manicuredGarden
        //     });
        //     let fate1 = this.player1.fate;
        //     let fate2 = this.player2.fate;

        //     this.player2.clickCard(this.negotiator);
        //     this.player1.clickCard(this.toshimoko);
        //     this.player1.clickPrompt('1');
        //     this.player2.clickPrompt('1');
        //     this.player2.clickPrompt('Yes');
        //     expect(this.player1.fate).toBe(fate1);
        //     expect(this.player2.fate).toBe(fate2 + 1);

        //     this.player1.clickCard(this.manicuredGarden);
        //     expect(this.player1.fate).toBe(fate1 + 1);
        //     expect(this.player2.fate).toBe(fate2 + 1);

        //     expect(this.player2).toHavePrompt('Conflict Action Window');
        //     this.player2.clickCard(this.manicuredGarden);
        //     expect(this.player1.fate).toBe(fate1 + 1);
        //     expect(this.player2.fate).toBe(fate2 + 1);
        //     expect(this.player2).toHavePrompt('Conflict Action Window');
        // });

        // it('should respect triggering limits - opponent\'s province', function () {
        //     this.player1.moveCard(this.countryside1, 'province 1');
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.toshimoko],
        //         defenders: [this.negotiator],
        //         type: 'military',
        //         province: this.manicuredGarden
        //     });
        //     let fate1 = this.player1.fate;
        //     let fate2 = this.player2.fate;

        //     this.player2.clickCard(this.negotiator);
        //     this.player1.clickCard(this.toshimoko);
        //     this.player1.clickPrompt('5');
        //     this.player2.clickPrompt('1');
        //     this.player1.clickPrompt('Yes');
        //     expect(this.player1.fate).toBe(fate1 + 1);
        //     expect(this.player2.fate).toBe(fate2);

        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     this.player1.clickCard(this.manicuredGarden);
        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     expect(this.player1.fate).toBe(fate1 + 1);
        //     expect(this.player2.fate).toBe(fate2);
        //     this.player1.pass();

        //     this.player2.clickCard(this.manicuredGarden);
        //     expect(this.player1.fate).toBe(fate1 + 1);
        //     expect(this.player2.fate).toBe(fate2 + 1);
        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        // });
    });
});
