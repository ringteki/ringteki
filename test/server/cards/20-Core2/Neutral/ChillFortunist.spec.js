describe('Chill Fortunist', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic']
                },
                player2: {
                    inPlay: ['chill-fortunist'],
                    hand: ['fine-katana']
                }
            });
            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.chillFortunist = this.player2.findCardByName('chill-fortunist');
            this.fineKatana = this.player2.findCardByName('fine-katana');
            this.miyaMystic.fate = 2;
            this.noMoreActions();
        });

        it('should trigger when the player resolves the void effect', function () {
            this.initiateConflict({
                type: 'political',
                ring: 'earth',
                attackers: [this.miyaMystic],
                defenders: [this.chillFortunist],
                jumpTo: 'afterConflict'
            });

            expect(this.player2).toHavePrompt('Any interrupts?');
            expect(this.player2).toBeAbleToSelect(this.chillFortunist);

            this.player2.clickCard(this.chillFortunist);
            expect(this.player2).toHavePrompt('Select card to discard');

            this.player2.clickCard(this.fineKatana);
            expect(this.player2).toHavePrompt('Choose a ring effect to resolve');
            expect(this.player2).toBeAbleToSelectRing('void');
            expect(this.player2).toBeAbleToSelectRing('earth');
            expect(this.player2).toBeAbleToSelectRing('water');
            expect(this.player2).not.toBeAbleToSelectRing('air');
            expect(this.player2).not.toBeAbleToSelectRing('fire');

            this.player2.clickRing('earth');
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Chill Fortunist, discarding Fine Katana to change which ring effect they will resolve'
            );
            expect(this.getChatLogs(5)).toContain('player2 chooses to resolve Earth Ring\'s effect');
        });
    });
});
