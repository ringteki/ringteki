describe('Paths Not Taken', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['cautious-scout', 'doji-challenger', 'aranat'],
                    // Entrenched Position is printed 5 and 10 during a military conflict,
                    // so printed and total strength pick out different characters.
                    provinces: ['entrenched-position'],
                    hand: ['paths-not-taken']
                },
                player2: {
                    inPlay: ['togashi-mitsu-2', 'doji-whisperer', 'miya-mystic']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu-2');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');

            this.scout = this.player1.findCardByName('cautious-scout');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
            this.paths = this.player1.findCardByName('paths-not-taken');
            this.province = this.player1.findCardByName('entrenched-position');
        });

        it('no scout', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                province: this.province,
                attackers: [this.mitsu, this.whisperer],
                defenders: [this.challenger]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.paths);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.whisperer);

            expect(this.whisperer.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Paths not Taken to send Doji Whisperer home');
        });

        it('scout', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                province: this.province,
                attackers: [this.mitsu, this.whisperer],
                defenders: [this.challenger, this.scout]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.paths);
            expect(this.player1).toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.scout);

            this.player1.clickCard(this.mitsu);

            expect(this.mitsu.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Paths not Taken to send Togashi Mitsu home');
        });

        it('cannot be played while attacking', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu]
            });

            expect(this.player1).not.toHavePrompt('Triggered Abilities');

            this.player2.pass();
            this.player1.clickCard(this.paths);
            expect(this.paths.location).toBe('hand');
            expect(this.mitsu.isParticipating()).toBe(true);
        });
    });
});
