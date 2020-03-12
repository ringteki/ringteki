describe('Seven Stings Keep', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-liar', 'alibi-artist', 'matsu-berserker'],
                    stronghold: ['seven-stings-keep']
                },
                player2: {
                    inPlay: ['kakita-toshimoko']
                }
            });

            this.liar = this.player1.findCardByName('bayushi-liar');
            this.artist = this.player1.findCardByName('alibi-artist');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.keep = this.player1.findCardByName('seven-stings-keep');
        });

        it('should give the option to trigger when your conflict opportunity starts', function() {
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            // this.initiateConflict({
            //     type: 'military',
            //     attackers: [this.rider],
            //     defenders: []
            // });

            // expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});