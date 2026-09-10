describe('triggered ability window', function () {
    integration(function () {
        describe('when one ability could affect several cards', function () {
            beforeEach(function () {
                // Master of Bindings reacts to a character being readied, so the fate
                // phase readying everything gives one ability two candidate cards --
                // the window then nests a second prompt inside the first one's onSelect.
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: ['master-of-bindings', 'master-of-bindings']
                    },
                    player2: {
                        inPlay: ['solemn-scholar', 'doji-diplomat']
                    }
                });

                this.bindings1 = this.player1.filterCardsByName('master-of-bindings')[0];
                this.bindings2 = this.player1.filterCardsByName('master-of-bindings')[1];
                this.scholar = this.player2.findCardByName('solemn-scholar');
                this.diplomat = this.player2.findCardByName('doji-diplomat');

                this.scholar.bow();
                this.diplomat.bow();

                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
            });

            it('leaves no card selected once the window has closed', function () {
                expect(this.player1).toHavePrompt('Any reactions?');
                this.player1.clickCard(this.bindings1);
                expect(this.player1).toHavePrompt('Select a card to affect');
                this.player1.clickCard(this.scholar);
                expect(this.scholar.bowed).toBe(true);

                this.player1.clickCard(this.bindings2);
                this.player1.clickCard(this.diplomat);
                expect(this.diplomat.bowed).toBe(true);

                // The nested prompt captured the source card while the outer prompt still
                // had it selected; a leftover selection here is a card the client draws as
                // selected for the rest of the game, and later prompts keep restoring it.
                expect(this.player1).toHavePrompt('Select dynasty cards to discard');
                this.player1.clickPrompt('Done');

                expect(this.player1.player.selectedCards).toEqual([]);
            });
        });
    });
});
