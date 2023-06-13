describe('Angry Sohei', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['angry-sohei'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['miya-mystic']
                }
            });
            this.angrySohei = this.player1.findCardByName('angry-sohei');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.miyaMystic = this.player2.findCardByName('miya-mystic');
            this.miyaMystic.fate = 2;
            this.noMoreActions();
        });

        it('should trigger when the player resolves the void effect', function () {
            this.initiateConflict({
                type: 'military',
                ring: 'earth',
                attackers: [this.angrySohei],
                defenders: [],
                jumpTo: 'afterConflict'
            });
            expect(this.player1).toHavePrompt('Any interrupts?');
            expect(this.player1).toBeAbleToSelect(this.angrySohei);

            this.player1.clickCard(this.angrySohei);
            expect(this.player1).toHavePrompt('Select card to discard');

            this.player1.clickCard(this.fineKatana);
            expect(this.player1).toHavePrompt('Choose a ring effect to resolve');
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).toBeAbleToSelectRing('void');
            expect(this.player1).not.toBeAbleToSelectRing('earth');
            expect(this.player1).not.toBeAbleToSelectRing('water');

            this.player1.clickRing('fire');
            this.player1.clickCard(this.angrySohei);
            this.player1.clickPrompt('Honor Angry Sohei');
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Angry Sohei, discarding Fine Katana to change which ring effect they will resolve'
            );
            expect(this.getChatLogs(5)).toContain('player1 chooses to resolve Fire Ring\'s effect');
        });
    });
});
