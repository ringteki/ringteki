describe('Shinjo Oyuun', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-oyuun', 'doji-challenger', 'aranat']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'miya-mystic']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');

            this.shinjo = this.player1.findCardByName('shinjo-oyuun');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');

            this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
            this.p4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.pStronghold = this.player2.findCardByName('shameful-display', 'stronghold province');

            this.p1.facedown = false;
            this.p2.facedown = false;
            this.p3.facedown = false;
            this.p3.isBroken = true;
        });

        it('3 provinces', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjo],
                defenders: [this.whisperer]
            });
            this.player2.pass();

            this.player1.clickCard(this.shinjo);
            expect(this.player1).not.toBeAbleToSelect(this.shinjo);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.aranat);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.mystic);
            this.player1.clickCard(this.mystic);
            expect(this.mystic.isParticipating()).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Shinjo Oyuun to move Miya Mystic into the conflict');
        });

        it('5 provinces', function () {
            this.p4.facedown = false;
            this.pStronghold.facedown = false;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shinjo],
                defenders: [this.whisperer]
            });
            this.player2.pass();

            this.player1.clickCard(this.shinjo);
            expect(this.player1).not.toBeAbleToSelect(this.shinjo);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.aranat);
            expect(this.player1).toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.mystic);
            this.player1.clickCard(this.mitsu);
            expect(this.mitsu.isParticipating()).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Shinjo Oyuun to move Togashi Mitsu into the conflict');
        });
    });
});
