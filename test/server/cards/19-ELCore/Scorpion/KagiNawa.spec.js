describe('Kagi Nawa', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-sadako', 'solemn-scholar', 'kitsu-motso'],
                    hand: ['kagi-nawa']
                },
                player2: {
                    inPlay: ['doji-challenger', 'alibi-artist', 'samurai-of-integrity']
                }
            });
            this.sadako = this.player1.findCardByName('shosuro-sadako');
            this.solemnScholar = this.player1.findCardByName('solemn-scholar');
            this.kitsuMotso = this.player1.findCardByName('kitsu-motso');
            this.kagiNawa = this.player1.findCardByName('kagi-nawa');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.alibiArtist = this.player2.findCardByName('alibi-artist');
            this.samuraiOfIntegrity = this.player2.findCardByName('samurai-of-integrity');
        });

        it('should only be attachable to any Shinobi', function () {
            this.player1.clickCard(this.kagiNawa);

            expect(this.player1).toBeAbleToSelect(this.sadako);
            expect(this.player1).toBeAbleToSelect(this.alibiArtist);
            expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).not.toBeAbleToSelect(this.kitsuMotso);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.samuraiOfIntegrity);
        });

        it('should not work in a conflict', function () {
            this.player1.clickCard(this.kagiNawa);
            this.player1.clickCard(this.sadako);
            this.player2.pass();
            this.player1.clickCard(this.kagiNawa);

            expect(this.player1).toHavePrompt('Action Window');
            expect(this.getChatLogs(3)).toContain('player1 plays Kagi-Nawa, attaching it to Shosuro Sadako');
        });

        it('should be able to select a 2 cost or lower character and move them to the conflict', function () {
            this.player1.clickCard(this.kagiNawa);
            this.player1.clickCard(this.sadako);
            this.player1.clickCard(this.kagiNawa);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.sadako],
                defenders: [],
                type: 'political'
            });

            this.player2.pass();
            this.player1.clickCard(this.kagiNawa);

            expect(this.player1).toHavePrompt('Choose a character with printed cost 2 or lower to move in');
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).toBeAbleToSelect(this.alibiArtist);
            expect(this.player1).toBeAbleToSelect(this.samuraiOfIntegrity);
            expect(this.player1).not.toBeAbleToSelect(this.sadako);
            expect(this.player1).not.toBeAbleToSelect(this.kitsuMotso);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.samuraiOfIntegrity);
            expect(this.samuraiOfIntegrity.inConflict).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Kagi-Nawa to hook Samurai of Integrity and drag them into the conflict');
        });
    });
});
