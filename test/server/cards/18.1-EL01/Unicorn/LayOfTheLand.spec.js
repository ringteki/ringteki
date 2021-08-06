describe('Lay of the Land', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['student-of-war'],
                    hand: ['lay-of-the-land'],
                    provinces: ['elemental-fury', 'temple-of-the-dragons']
                },
                player2: {
                    inPlay: ['shinjo-outrider'],
                    provinces: ['brushfires', 'khan-s-ordu', 'market-of-kaze-no-kami', 'manicured-garden']
                }
            });

            this.studentOfWar = this.player1.findCardByName('student-of-war');
            this.land = this.player1.findCardByName('lay-of-the-land');

            this.outrider = this.player2.findCardByName('shinjo-outrider');

            this.fury = this.player1.findCardByName('elemental-fury');
            this.temple = this.player1.findCardByName('temple-of-the-dragons');

            this.brushfires = this.player2.findCardByName('brushfires');
            this.khans = this.player2.findCardByName('khan-s-ordu');
            this.market = this.player2.findCardByName('market-of-kaze-no-kami');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.sd = this.player2.findCardByName('shameful-display', 'stronghold province');

            this.garden.facedown = false;
            this.fury.facedown = false;
            this.garden.isBroken = true;
            this.game.checkGameState(true);

            this.studentOfWar.fate = 5;
        });

        it('should prompt to choose an unbroken province', function() {
            this.player1.clickCard(this.land);
            expect(this.player1).toHavePrompt('Choose an unbroken province');
            expect(this.player1).not.toBeAbleToSelect(this.fury);
            expect(this.player1).toBeAbleToSelect(this.temple);
            expect(this.player1).toBeAbleToSelect(this.brushfires);
            expect(this.player1).toBeAbleToSelect(this.khans);
            expect(this.player1).toBeAbleToSelect(this.market);
            expect(this.player1).not.toBeAbleToSelect(this.garden);

            this.player1.clickCard(this.brushfires);
            expect(this.brushfires.facedown).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Lay of the Land to reveal and disard any number of status tokens from Brushfires');
        });

        it('status tokens', function() {
            this.fury.taint();
            this.fury.dishonor();

            this.brushfires.taint();
            this.brushfires.dishonor();

            this.player1.clickCard(this.land);
            expect(this.player1).toHavePrompt('Choose an unbroken province');
            expect(this.player1).toBeAbleToSelect(this.fury);
            expect(this.player1).toBeAbleToSelect(this.temple);
            expect(this.player1).toBeAbleToSelect(this.brushfires);
            expect(this.player1).toBeAbleToSelect(this.khans);
            expect(this.player1).toBeAbleToSelect(this.market);
            expect(this.player1).not.toBeAbleToSelect(this.garden);

            this.player1.clickCard(this.brushfires);
            expect(this.player1).toHavePrompt('Do you wish to discard Tainted Token?');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Do you wish to discard Dishonored Token?');
            this.player1.clickPrompt('Yes');

            expect(this.brushfires.isDishonored).toBe(false);
            expect(this.brushfires.isTainted).toBe(false);
            expect(this.brushfires.facedown).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 plays Lay of the Land to reveal and disard any number of status tokens from Brushfires');
            expect(this.getChatLogs(4)).toContain('player1 chooses to discard Dishonored Token from Brushfires');
            expect(this.getChatLogs(3)).toContain('player1 chooses to discard Tainted Token from Brushfires');
        });

        // it('should not work in a conflict', function() {

        //     this.noMoreActions();
        //     this.initiateConflict({
        //         type: 'military',
        //         attackers: [this.studentOfWar],
        //         defenders: [],
        //         province: this.garden
        //     });

        //     this.player2.pass();
        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        //     this.player1.clickCard(this.land);
        //     expect(this.player1).toHavePrompt('Conflict Action Window');
        // });
    });
});
