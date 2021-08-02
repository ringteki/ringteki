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
            this.game.checkGameState(true);

            this.studentOfWar.fate = 5;
        });

        it('should prompt to choose two provinces controlled by the same player and reveal one and turn the other facedown', function() {
            this.player1.clickCard(this.land);
            expect(this.player1).toHavePrompt('Choose a faceup province');
            expect(this.player1).toBeAbleToSelect(this.fury);
            expect(this.player1).not.toBeAbleToSelect(this.temple);
            expect(this.player1).not.toBeAbleToSelect(this.brushfires);
            expect(this.player1).not.toBeAbleToSelect(this.khans);
            expect(this.player1).not.toBeAbleToSelect(this.market);
            expect(this.player1).toBeAbleToSelect(this.garden);

            this.player1.clickCard(this.garden);

            expect(this.player1).toHavePrompt('Choose a province to reveal');
            expect(this.player1).not.toBeAbleToSelect(this.fury);
            expect(this.player1).not.toBeAbleToSelect(this.temple);
            expect(this.player1).toBeAbleToSelect(this.brushfires);
            expect(this.player1).toBeAbleToSelect(this.khans);
            expect(this.player1).toBeAbleToSelect(this.market);
            expect(this.player1).not.toBeAbleToSelect(this.garden);

            this.player1.clickCard(this.brushfires);
            expect(this.garden.facedown).toBe(true);
            expect(this.brushfires.facedown).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 plays Lay of the Land to turn Manicured Garden facedown');
            expect(this.getChatLogs(5)).toContain('player1 uses Lay of the Land to reveal Brushfires');
        });

        it('should prompt to choose two provinces controlled by the same player and reveal one and turn the other facedown', function() {
            this.player1.clickCard(this.land);
            expect(this.player1).toHavePrompt('Choose a faceup province');
            expect(this.player1).toBeAbleToSelect(this.fury);
            expect(this.player1).not.toBeAbleToSelect(this.temple);
            expect(this.player1).not.toBeAbleToSelect(this.brushfires);
            expect(this.player1).not.toBeAbleToSelect(this.khans);
            expect(this.player1).not.toBeAbleToSelect(this.market);
            expect(this.player1).toBeAbleToSelect(this.garden);

            this.player1.clickCard(this.fury);

            expect(this.player1).toHavePrompt('Choose a province to reveal');
            expect(this.player1).not.toBeAbleToSelect(this.fury);
            expect(this.player1).toBeAbleToSelect(this.temple);
            expect(this.player1).not.toBeAbleToSelect(this.brushfires);
            expect(this.player1).not.toBeAbleToSelect(this.khans);
            expect(this.player1).not.toBeAbleToSelect(this.market);
            expect(this.player1).not.toBeAbleToSelect(this.garden);

            this.player1.clickCard(this.temple);
            expect(this.fury.facedown).toBe(true);
            expect(this.temple.facedown).toBe(false);
        });

        it('should work if there\'s no province to reveal', function() {
            this.garden.facedown = false;
            this.fury.facedown = false;
            this.temple.facedown = false;
            this.brushfires.facedown = false;
            this.khans.facedown = false;
            this.market.facedown = false;
            this.sd.facedown = false;
            this.game.checkGameState(true);

            this.player1.clickCard(this.land);
            expect(this.player1).toHavePrompt('Choose a faceup province');
            expect(this.player1).toBeAbleToSelect(this.fury);
            expect(this.player1).toBeAbleToSelect(this.temple);
            expect(this.player1).toBeAbleToSelect(this.brushfires);
            expect(this.player1).toBeAbleToSelect(this.khans);
            expect(this.player1).toBeAbleToSelect(this.market);
            expect(this.player1).toBeAbleToSelect(this.garden);

            this.player1.clickCard(this.garden);

            expect(this.player1).not.toHavePrompt('Choose a province to reveal');
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.getChatLogs(5)).toContain('player1 plays Lay of the Land to turn Manicured Garden facedown');
        });

        it('should not work in a conflict', function() {

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.studentOfWar],
                defenders: [],
                province: this.garden
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.land);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
