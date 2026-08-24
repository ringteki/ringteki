describe('Paths Not Taken', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['cautious-scout', 'doji-challenger', 'aranat'],
                    hand: ['paths-not-taken', 'desperate-defense']
                },
                player2: {
                    inPlay: ['togashi-mitsu-2', 'doji-whisperer', 'miya-mystic'],
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu-2');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');

            this.scout = this.player1.findCardByName('cautious-scout');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
            this.paths = this.player1.findCardByName('paths-not-taken');
            this.defense = this.player1.findCardByName('desperate-defense');
        });

        it('no scout', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mitsu, this.whisperer],
                defenders: [this.challenger],
            });
            this.player1.clickCard(this.defense);
            this.player2.pass();

            this.player1.clickCard(this.paths);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.whisperer);

            expect(this.getChatLogs(5)).toContain('player1 plays Paths not Taken to send Doji Whisperer home');
        });

        it('scout', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mitsu, this.whisperer],
                defenders: [this.challenger, this.scout],
            });
            this.player1.clickCard(this.defense);
            this.player2.pass();

            this.player1.clickCard(this.paths);
            expect(this.player1).toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.scout);

            this.player1.clickCard(this.mitsu);

            expect(this.getChatLogs(5)).toContain('player1 plays Paths not Taken to send Togashi Mitsu home');
        });
    });
});
