describe('Doji Reiha', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-reiha', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'agasha-swordsmith']
                }
            });
            this.reiha = this.player1.findCardByName('doji-reiha');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.swordsmith = this.player2.findCardByName('agasha-swordsmith');
        });

        const resolveDuel = function (spec) {
            spec.player1.clickCard(spec.reiha);
            spec.player2.clickCard(spec.mitsu);
            spec.player1.clickPrompt('1');
            spec.player2.clickPrompt('1');
            spec.player2.clickPrompt('Do nothing');
        };

        it('honors each contestant once', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.reiha],
                defenders: [this.mitsu],
                type: 'political'
            });
            this.player2.pass();
            resolveDuel(this);

            expect(this.reiha.isHonored).toBe(true);
            expect(this.mitsu.isHonored).toBe(true);
        });

        it('only removes the dishonored status from a dishonored contestant', function () {
            this.reiha.dishonor();
            expect(this.reiha.isDishonored).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.reiha],
                defenders: [this.mitsu],
                type: 'political'
            });
            this.player2.pass();
            resolveDuel(this);

            // One honor on a dishonored character clears the status; it must not honor twice.
            expect(this.reiha.isDishonored).toBe(false);
            expect(this.reiha.isHonored).toBe(false);
            expect(this.mitsu.isHonored).toBe(true);
        });
    });
});
