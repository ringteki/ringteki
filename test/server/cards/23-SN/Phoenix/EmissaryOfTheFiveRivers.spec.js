describe('Emissary Of The Five Rivers', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['daidoji-uji', 'guardian-kami', 'doji-challenger'],
                    dynastyDiscard: ['emissary-of-the-five-rivers'],
                    hand: ['let-go', 'charge']
                },
                player2: {
                    inPlay: ['aranat']
                }
            });

            this.uji = this.player1.findCardByName('daidoji-uji');
            this.guardianKami = this.player1.findCardByName('guardian-kami');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.letgo = this.player1.findCardByName('let-go');
            this.charge = this.player1.findCardByName('charge');
            this.river = this.player1.findCardByName('emissary-of-the-five-rivers');

            this.aranat = this.player2.findCardByName('aranat');

            this.guardianKami.bow();
            this.challenger.bow();
            this.player1.moveCard(this.river, 'province 1');
            this.river.facedown = false;
            this.uji.honor();
            this.game.checkGameState(true);
        });

        it('when played should react and honor', function () {
            this.player1.clickCard(this.river);
            this.player1.clickPrompt('0');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.river);

            this.player1.clickCard(this.river);
            expect(this.player1).toBeAbleToSelect(this.river);
            expect(this.player1).toBeAbleToSelect(this.guardianKami);
            expect(this.player1).toBeAbleToSelect(this.aranat);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.guardianKami);
            expect(this.guardianKami.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Emissary of the Five Rivers to honor Guardian Kami');
        });

        it('when put into play should react', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.uji],
                defenders: [],
            });
            this.player2.pass();
            this.player1.clickCard(this.charge);
            this.player1.clickCard(this.river);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.river);
            this.player1.clickCard(this.river);
            this.player1.clickCard(this.aranat);

            expect(this.aranat.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Emissary of the Five Rivers to honor Aranat');
        });

        it('discard a card to ready', function () {
            this.player1.clickCard(this.river);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.river);
            this.player1.clickCard(this.guardianKami);

            this.player2.pass();

            this.player1.clickCard(this.river);
            expect(this.player1).not.toBeAbleToSelect(this.river);
            expect(this.player1).toBeAbleToSelect(this.guardianKami);
            expect(this.player1).not.toBeAbleToSelect(this.aranat);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.guardianKami);

            expect(this.player1).toHavePrompt('Select card to discard');
            expect(this.player1).toBeAbleToSelect(this.letgo);
            expect(this.player1).toBeAbleToSelect(this.charge);
            this.player1.clickCard(this.charge);

            expect(this.guardianKami.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Emissary of the Five Rivers, discarding Charge! to ready Guardian Kami');
        });
    });
});
