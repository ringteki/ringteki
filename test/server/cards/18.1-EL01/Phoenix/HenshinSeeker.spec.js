describe('Henshin Seeker', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['henshin-seeker', 'ancient-master']
                },
                player2: {
                    inPlay: ['tattooed-wanderer'],
                    hand: ['mark-of-shame', 'mark-of-shame', 'mark-of-shame']
                }
            });
            this.seeker = this.player1.findCardByName('henshin-seeker');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');

            this.shame1 = this.player2.filterCardsByName('mark-of-shame')[0];
            this.shame2 = this.player2.filterCardsByName('mark-of-shame')[1];
            this.shame3 = this.player2.filterCardsByName('mark-of-shame')[2];


            this.seeker.honor();
            this.ancientMaster.honor();
            this.wanderer.honor();
        });

        it('should prevent receiving dishonored status tokens if you have the fire ring claimed', function() {
            this.player1.claimRing('fire');
            this.player1.pass();
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
            expect(this.ancientMaster.isDishonored).toBe(false);

            expect(this.wanderer.isHonored).toBe(false);
            expect(this.wanderer.isDishonored).toBe(true);
        });

        it('should not prevent receiving dishonored status tokens if you don\'t have the fire ring claimed', function() {
            this.player1.claimRing('earth');
            this.player1.pass();
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
            expect(this.seeker.isDishonored).toBe(true);

            expect(this.ancientMaster.isHonored).toBe(false);
            expect(this.ancientMaster.isDishonored).toBe(true);

            expect(this.wanderer.isHonored).toBe(false);
            expect(this.wanderer.isDishonored).toBe(true);
        });
    });
});
