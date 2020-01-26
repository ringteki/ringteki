describe('Called to War', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['matsu-berserker', 'ikoma-prodigy'],
                    hand: ['called-to-war']
                },
                player2: {
                    honor: 10,
                    inPlay: ['solemn-scholar', 'shiba-tsukune', 'righteous-magistrate']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
            this.calledToWar = this.player1.findCardByName('called-to-war');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.shibaTsukune = this.player2.findCardByName('shiba-tsukune');
            this.magistrate = this.player2.findCardByName('righteous-magistrate');
        });

        it('should allow each player to choose a bushi', function() {
            this.player1.clickCard(this.calledToWar);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player1).not.toBeAbleToSelect(this.ikomaProdigy);
            this.player1.clickCard(this.matsuBerserker);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.shibaTsukune);
            expect(this.player2).not.toBeAbleToSelect(this.solemnScholar);
            this.player2.clickCard(this.shibaTsukune);
            expect(this.getChatLogs(10)).toContain('player1 plays Called to War to places a fate on Matsu Berserker.  player2 gives player1 1 honor to place a fate on Shiba Tsukune');

            expect(this.matsuBerserker.fate).toBe(1);
            expect(this.shibaTsukune.fate).toBe(1);

            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(9);
        });

        it('should allow opponent to choose not to select a bushi', function() {
            this.player1.clickCard(this.calledToWar);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player1).not.toBeAbleToSelect(this.ikomaProdigy);
            this.player1.clickCard(this.matsuBerserker);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.shibaTsukune);
            expect(this.player2).not.toBeAbleToSelect(this.solemnScholar);
            expect(this.player2).toHavePromptButton('Done');
            this.player2.clickPrompt('Done');
            expect(this.getChatLogs(10)).toContain('player1 plays Called to War to places a fate on Matsu Berserker');

            expect(this.matsuBerserker.fate).toBe(1);
            expect(this.shibaTsukune.fate).toBe(0);

            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
        });

        it('should allow each player to choose a bushi', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [this.magistrate],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.calledToWar);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
            expect(this.player1).not.toBeAbleToSelect(this.ikomaProdigy);
            this.player1.clickCard(this.matsuBerserker);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).not.toBeAbleToSelect(this.shibaTsukune);
            expect(this.player2).not.toBeAbleToSelect(this.solemnScholar);
            this.player2.clickPrompt('Done');
            expect(this.getChatLogs(10)).toContain('player1 plays Called to War to places a fate on Matsu Berserker');

            expect(this.matsuBerserker.fate).toBe(1);
            expect(this.shibaTsukune.fate).toBe(0);

            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
        });
    });
});
