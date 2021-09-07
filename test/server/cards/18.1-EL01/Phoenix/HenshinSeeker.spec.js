describe('Henshin Seeker', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['henshin-seeker', 'ancient-master'],
                    hand: ['commune-with-the-spirits']
                },
                player2: {
                    inPlay: ['tattooed-wanderer'],
                    hand: ['mark-of-shame', 'mark-of-shame', 'mark-of-shame']
                }
            });
            this.seeker = this.player1.findCardByName('henshin-seeker');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');
            this.commune = this.player1.findCardByName('commune-with-the-spirits');

            this.shame1 = this.player2.filterCardsByName('mark-of-shame')[0];
            this.shame2 = this.player2.filterCardsByName('mark-of-shame')[1];
            this.shame3 = this.player2.filterCardsByName('mark-of-shame')[2];
        });

        it('should let you honor someone and then prevent receiving dishonored status tokens if you claim the fire ring', function() {
            this.player1.clickCard(this.commune);
            this.player1.clickRing('fire');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.seeker);
            this.player1.clickCard(this.seeker);
            expect(this.player1).toBeAbleToSelect(this.seeker);
            expect(this.player1).toBeAbleToSelect(this.ancientMaster);
            expect(this.player1).not.toBeAbleToSelect(this.wanderer);

            this.player1.clickCard(this.seeker);
            expect(this.seeker.isHonored).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Henshin Seeker to honor Henshin Seeker and prevent Henshin Seeker from receiving dishonored status tokens this phase');

            this.seeker.honor();
            this.ancientMaster.honor();
            this.wanderer.honor();

            this.game.checkGameState(true);

            this.player2.clickCard(this.shame1);
            this.player2.clickCard(this.seeker);
            this.player2.clickCard(this.shame1);

            this.player1.pass();
            this.player2.clickCard(this.shame2);
            this.player2.clickCard(this.ancientMaster);
            this.player2.clickCard(this.shame2);

            this.player1.pass();
            this.player2.clickCard(this.shame3);
            this.player2.clickCard(this.wanderer);
            this.player2.clickCard(this.shame3);

            expect(this.seeker.isHonored).toBe(false);
            expect(this.seeker.isDishonored).toBe(false);

            expect(this.ancientMaster.isHonored).toBe(false);
            expect(this.ancientMaster.isDishonored).toBe(true);

            expect(this.wanderer.isHonored).toBe(false);
            expect(this.wanderer.isDishonored).toBe(true);
        });

        it('should not react if you claim a different ring', function() {
            this.player1.clickCard(this.commune);
            this.player1.clickRing('earth');

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
