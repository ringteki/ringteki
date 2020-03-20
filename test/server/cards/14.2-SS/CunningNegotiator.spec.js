describe('Cunning Negotiator', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['cunning-negotiator']
                },
                player2: {
                    inPlay: ['cunning-negotiator'],
                    provinces: ['midnight-revels', 'restoration-of-balance', 'manicured-garden', 'meditations-on-the-tao']
                }
            });

            this.cunning = this.player1.findCardByName('cunning-negotiator');
            this.cunning2 = this.player2.findCardByName('cunning-negotiator');
            this.revels = this.player2.findCardByName('midnight-revels', 'province 1');
            this.restoration = this.player2.findCardByName('restoration-of-balance', 'province 2');
            this.manicuredGarden = this.player2.findCardByName('manicured-garden', 'province 3');
            this.meditations = this.player2.findCardByName('meditations-on-the-tao', 'province 4');

            this.revels.facedown = false;
            this.restoration.facedown = false;
            this.manicuredGarden.facedown = false;
            this.meditations.facedown = false;

            this.cunning.fate = 5;
            this.cunning2.fate = 5;

            this.game.checkGameState(true);
        });

        it('should initiate a duel - opponent picks their duelist', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.cunning],
                defenders: [this.cunning2],
                type: 'political',
                province: this.manicuredGarden
            });
            this.player2.clickCard(this.cunning2);
            expect(this.player1).toHavePrompt('Choose a character');
            this.player1.clickCard(this.cunning);
        });

        it('should do nothing on a tie', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.cunning],
                defenders: [this.cunning2],
                type: 'political',
                province: this.manicuredGarden
            });
            this.player2.clickCard(this.cunning2);
            this.player1.clickCard(this.cunning);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(10)).toContain('The duel ends in a draw');
            expect(this.getChatLogs(10)).toContain('The duel has no effect');
        });

        it('should trigger the province ability for the winner', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.cunning],
                defenders: [this.cunning2],
                type: 'political',
                province: this.manicuredGarden
            });
            this.player2.clickCard(this.cunning2);
            this.player1.clickCard(this.cunning);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(10)).toContain('Duel Effect: resolve the action ability of the attacked province');
            expect(this.getChatLogs(10)).toContain('player2 resolves Manicured Garden to gain 1 fate');
        });

        it('should prevent using the province if you use the duel first', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.cunning],
                defenders: [this.cunning2],
                type: 'political',
                province: this.manicuredGarden
            });
            this.player2.clickCard(this.cunning2);
            this.player1.clickCard(this.cunning);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('2');
            this.player1.pass();
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.manicuredGarden);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        // it('should disregard trigger conditions - reactions', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.trader],
        //         type: 'military',
        //         province: this.revels
        //     });

        //     expect(this.player2).toHavePrompt('Triggered Abilities');
        //     this.player2.clickPrompt('Pass');
        //     this.player2.clickPrompt('Done');
        //     this.player2.pass();

        //     const playerFatePreTrader = this.player1.fate;
        //     this.player1.clickCard(this.trader);
        //     expect(this.player1).toHavePrompt('Midnight Revels');
        //     expect(this.player1).toBeAbleToSelect(this.trader);
        //     expect(this.player1).toBeAbleToSelect(this.trader2);

        //     this.player1.clickCard(this.trader2);

        //     expect(this.player1.fate).toBe(playerFatePreTrader - 1);
        //     expect(this.getChatLogs(10)).toContain('player1 uses Countryside Trader, spending 1 fate to resolve the province ability of Midnight Revels');
        //     expect(this.trader2.bowed).toBe(true);
        // });

        // it('should disregard trigger conditions - interrupt', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.trader],
        //         defenders: [],
        //         type: 'military',
        //         province: this.restoration
        //     });

        //     this.player2.pass();

        //     const playerFatePreTrader = this.player1.fate;
        //     this.player1.clickCard(this.trader);
        //     expect(this.player2).toHavePrompt('Restoration of Balance');

        //     this.player2.clickCard(this.katana);
        //     expect(this.katana.location).toBe('conflict discard pile');

        //     expect(this.player1.fate).toBe(playerFatePreTrader - 1);
        //     expect(this.getChatLogs(5)).toContain('player1 uses Countryside Trader, spending 1 fate to resolve the province ability of Restoration of Balance');
        //     expect(this.getChatLogs(5)).toContain('player2 discards Fine Katana');
        // });

        // it('should disregard trigger conditions - action', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.trader],
        //         defenders: [],
        //         type: 'military',
        //         province: this.manicuredGarden
        //     });

        //     this.player2.pass();

        //     const playerFatePreTrader = this.player1.fate;
        //     this.player1.clickCard(this.trader);

        //     expect(this.player1.fate).toBe(playerFatePreTrader); // manicured fate
        //     expect(this.getChatLogs(5)).toContain('player1 uses Countryside Trader, spending 1 fate to resolve the province ability of Manicured Garden');
        //     expect(this.getChatLogs(5)).toContain('player1 resolves Manicured Garden to gain 1 fate');
        // });

        // it('should regard card text - mentions attacking characters', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.trader],
        //         defenders: [this.trader2],
        //         type: 'military',
        //         province: this.meditations
        //     });

        //     this.player2.pass();

        //     const playerFatePreTrader = this.player1.fate;
        //     this.player1.clickCard(this.trader);
        //     expect(this.player1).toHavePrompt('Meditations on the Tao');
        //     expect(this.player1).toBeAbleToSelect(this.trader); // attacker
        //     expect(this.player1).not.toBeAbleToSelect(this.trader2); // defender

        //     expect(this.player1.fate).toBe(playerFatePreTrader - 1);
        //     expect(this.getChatLogs(5)).toContain('player1 uses Countryside Trader, spending 1 fate to resolve the province ability of Meditations on the Tao');
        // });

        // it('should regard card text - mentions defending characters', function() {
        //     this.noMoreActions();
        //     this.player1.passConflict();
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.trader2],
        //         defenders: [this.trader],
        //         type: 'military',
        //         province: this.kensonNoGakka
        //     });

        //     this.player1.pass();

        //     const playerFatePreTrader = this.player2.fate;
        //     this.player2.clickCard(this.trader2);

        //     expect(this.trader2.isHonored).toBe(false); // attacker
        //     expect(this.trader.isHonored).toBe(true); // defender

        //     expect(this.player2.fate).toBe(playerFatePreTrader - 1);
        //     expect(this.getChatLogs(5)).toContain('player2 uses Countryside Trader, spending 1 fate to resolve the province ability of Kenson no Gakka');
        // });

        // it('should regard card text - mentions attacking player', function() {
        //     this.noMoreActions();
        //     this.player1.passConflict();
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.trader2],
        //         defenders: [this.trader],
        //         type: 'military',
        //         province: this.upholding
        //     });

        //     this.player1.pass();

        //     const playerFatePreTrader = this.player2.fate;
        //     this.player2.clickCard(this.trader2);

        //     expect(this.player2).toHavePrompt('Upholding Authority');

        //     expect(this.player2.fate).toBe(playerFatePreTrader - 1);
        //     expect(this.getChatLogs(5)).toContain('player2 uses Countryside Trader, spending 1 fate to resolve the province ability of Upholding Authority');
        //     expect(this.getChatLogs(5)).toContain('player2 reveals their hand: Court Games, Fine Katana, For Shame!, Ornate Fan and Way of the Crane');
        // });

        // it('should regard costs', function() {
        //     this.noMoreActions();
        //     this.player1.passConflict();
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.trader2],
        //         defenders: [this.trader],
        //         type: 'military',
        //         province: this.brothersGiftDojo
        //     });

        //     this.player1.pass();

        //     const playerFatePreTrader = this.player2.fate;
        //     const playerHonorPreTrader = this.player2.honor;
        //     this.player2.clickCard(this.trader2);

        //     expect(this.player2).toHavePrompt('Choose a character');
        //     expect(this.player2).toBeAbleToSelect(this.trader2);
        //     this.player2.clickCard(this.trader2);

        //     expect(this.player2.fate).toBe(playerFatePreTrader - 1);
        //     expect(this.player2.honor).toBe(playerHonorPreTrader - 1); // dojo cost
        //     expect(this.trader2.isAttacking()).toBe(false);

        //     expect(this.getChatLogs(5)).toContain('player2 uses Countryside Trader, spending 1 fate to resolve the province ability of Brother’s Gift Dōjō');
        // });
    });
});
