describe('Shosuro Isa', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-shadows', 'blackmail-artist', 'daidoji-saboteur', 'shadow-stalker'],
                    hand: ['strike-from-the-shadows']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'kakita-yoshi'],
                }
            });

            this.adept = this.player1.findCardByName('adept-of-shadows');
            this.bm = this.player1.findCardByName('blackmail-artist');
            this.saboteur = this.player1.findCardByName('daidoji-saboteur');
            this.stalker = this.player1.findCardByName('shadow-stalker');
            this.strike = this.player1.findCardByName('strike-from-the-shadows');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('should turn a loss into a win', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.adept, this.bm, this.saboteur],
                defenders: [this.kuwanan],
            });
            expect(this.getChatLogs(5)).toContain('Military Air conflict - Attacker: 4 Defender: 5');
            expect(this.getChatLogs(5)).toContain('Defender is winning the conflict');

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.strike);

            this.player1.clickCard(this.strike); // +2

            expect(this.getChatLogs(10)).toContain('player1 plays Strike from the Shadows to give all participating Shinobi they control +1military/+1political until the end of the conflict');
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 6 vs 5');
        });

        it('should turn into a break', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.adept, this.bm, this.saboteur, this.stalker],
                defenders: [this.kuwanan],
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.strike);

            this.player1.clickCard(this.strike); // +3

            expect(this.getChatLogs(10)).toContain('player1 plays Strike from the Shadows to give all participating Shinobi they control +1military/+1political until the end of the conflict');
            expect(this.getChatLogs(10)).toContain('player1 has broken Shameful Display!');

            expect(this.player1).toHavePrompt('Break Shameful Display');
        });
    });
});
