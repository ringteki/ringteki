describe('Called to War', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['matsu-berserker', 'ikoma-prodigy'],
                    hand: ['presence-of-the-lords-of-death']
                },
                player2: {
                    honor: 10,
                    inPlay: ['solemn-scholar', 'shiba-tsukune', 'righteous-magistrate'],
                    provinces: ['manicured-garden', 'by-onnotangu-s-light']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
            this.death = this.player1.findCardByName('presence-of-the-lords-of-death');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.shibaTsukune = this.player2.findCardByName('shiba-tsukune');
            this.magistrate = this.player2.findCardByName('righteous-magistrate');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.light = this.player2.findCardByName('by-onnotangu-s-light');

            this.matsuBerserker.fate = 1;
            this.solemnScholar.fate = 1;
            this.shibaTsukune.fate = 2;
        });

        it('should allow each player to choose a participating character with fate', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [this.solemnScholar, this.magistrate],
                province: this.garden
            });
            this.player2.pass();

            let fate = this.player1.fate;
            let cost = this.death.printedCost;

            this.player1.clickCard(this.death);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player1).not.toBeAbleToSelect(this.ikomaProdigy);
            expect(this.player1).not.toBeAbleToSelect(this.shibaTsukune);
            expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);
            this.player1.clickCard(this.matsuBerserker);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toBeAbleToSelect(this.matsuBerserker);
            expect(this.player1).not.toBeAbleToSelect(this.ikomaProdigy);
            expect(this.player1).not.toBeAbleToSelect(this.shibaTsukune);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            this.player1.clickCard(this.solemnScholar);

            expect(this.matsuBerserker.fate).toBe(0);
            expect(this.solemnScholar.fate).toBe(0);
            expect(this.player1.fate).toBe(fate - cost + 1);

            expect(this.getChatLogs(5)).toContain('player1 plays Presence of the Lords of Death to remove a fate from Matsu Berserker and Solemn Scholar and gain a fate');
        });

        it('should not be playable if you cannot remove fate from a character from each player', function() {
            this.solemnScholar.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [this.solemnScholar],
                province: this.garden
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.death);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not be playable if you cannot remove fate from a character from each player', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [this.solemnScholar],
                province: this.light
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.death);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
