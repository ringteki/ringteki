describe('Bayushi Gichin', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-gichin', 'heir-of-the-serpent'],
                    hand: ['fiery-madness'],
                    conflictDiscard: ['stolen-breath']
                },
                player2: {
                    inPlay: ['doji-challenger', 'akodo-toturi', 'kitsuki-yaruma']
                }
            });

            this.serpent = this.player1.findCardByName('heir-of-the-serpent');
            this.gichin = this.player1.findCardByName('bayushi-gichin');
            this.madness = this.player1.findCardByName('fiery-madness');
            this.breath = this.player1.findCardByName('stolen-breath');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.yaruma = this.player2.findCardByName('kitsuki-yaruma');
        });

        it('duel win', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.toturi]
            });

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.challenger);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.gichin);

            this.player1.clickCard(this.gichin);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.challenger);

            expect(this.player1).toBeAbleToSelect(this.madness);
            expect(this.player1).toBeAbleToSelect(this.breath);

            this.player1.clickCard(this.madness);
            expect(this.madness.parent).toBe(this.challenger);

            expect(this.getChatLogs(5)).toContain('player1 poisons Doji Challenger');
            expect(this.getChatLogs(5)).toContain('player1 attaches Fiery Madness');

            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);

            expect(this.getChatLogs(5)).toContain('Duel Effect: take 1 honor from player2');
        });

        it('duel win, no eligible poisons', function () {
            this.player1.moveCard(this.madness, 'removed from game');
            this.player1.moveCard(this.breath, 'removed from game');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.toturi]
            });

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.challenger);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);

            expect(this.getChatLogs(5)).toContain('Duel Effect: take 1 honor from player2');
        });

        it('duel loss', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.toturi]
            });

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.toturi);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.toturi);
            this.player1.clickCard(this.madness);
            expect(this.madness.parent).toBe(this.toturi);

            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor2);

            expect(this.getChatLogs(5)).toContain('The duel has no effect');
        });

        it('no eligible poisons for opponent', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gichin],
                defenders: [this.challenger, this.yaruma]
            });

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.gichin);
            this.player1.clickCard(this.yaruma);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);

            expect(this.getChatLogs(5)).toContain('Duel Effect: take 1 honor from player2');
        });

        it('testing disguise', function () {
            this.player1.moveCard(this.gichin, 'province 1');
            this.gichin.facedown = false;
            this.game.checkGameState(true);

            this.player1.clickCard(this.gichin);
            expect(this.player1).toBeAbleToSelect(this.serpent);
            this.player1.clickCard(this.serpent);

            expect(this.getChatLogs(5)).toContain('player1 plays Bayushi Gichin using Disguised, choosing to replace Heir of the Serpent');
        });
    });
});
