describe('Iuchi Hatsue', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['iuchi-hatsue', 'doji-challenger', 'aranat']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'miya-mystic']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');

            this.hatsue = this.player1.findCardByName('iuchi-hatsue');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
        });

        it('swap locations and skill bonus', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu]
            });
            let mil = this.hatsue.getMilitarySkill();
            let pol = this.hatsue.getPoliticalSkill();

            this.player2.pass();

            this.player1.clickCard(this.hatsue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.hatsue);
            expect(this.player1).not.toBeAbleToSelect(this.aranat);
            expect(this.player1).toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.challenger);

            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.hatsue);
            expect(this.player1).toBeAbleToSelect(this.aranat);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);

            expect(this.aranat.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(true);

            this.player1.clickCard(this.aranat);

            expect(this.aranat.isParticipating()).toBe(true);
            expect(this.challenger.isParticipating()).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Iuchi Hatsue to switch Doji Challenger and Aranat');

            expect(this.hatsue.getMilitarySkill()).toBe(mil + 2);
            expect(this.hatsue.getPoliticalSkill()).toBe(pol + 2);
        });

        it('opponent swap locations', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu]
            });
            this.player2.pass();

            this.player1.clickCard(this.hatsue);
            this.player1.clickCard(this.mitsu);

            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.hatsue);
            expect(this.player2).not.toBeAbleToSelect(this.aranat);
            expect(this.player2).not.toBeAbleToSelect(this.mitsu);
            expect(this.player2).toBeAbleToSelect(this.whisperer);

            expect(this.whisperer.isParticipating()).toBe(false);
            expect(this.mitsu.isParticipating()).toBe(true);

            this.player2.clickCard(this.whisperer);

            expect(this.whisperer.isParticipating()).toBe(true);
            expect(this.mitsu.isParticipating()).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Iuchi Hatsue to switch Togashi Mitsu and Doji Whisperer');
        });
    });
});
