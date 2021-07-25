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

            this.studentOfWar.fate = 5;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.studentOfWar],
                province: this.garden,
                defenders: []
            });
        });

        it('should trigger after you win as an attacker', function() {
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.land);
        });

        it('should prompt to choose provinces to reveal', function() {
            this.noMoreActions();
            this.player1.clickCard(this.land);
            expect(this.player1).toHavePrompt('Choose any number of provinces to reveal');
            expect(this.player1).toBeAbleToSelect(this.fury);
            expect(this.player1).toBeAbleToSelect(this.temple);
            expect(this.player1).toBeAbleToSelect(this.brushfires);
            expect(this.player1).toBeAbleToSelect(this.khans);
            expect(this.player1).toBeAbleToSelect(this.market);
            expect(this.player1).not.toBeAbleToSelect(this.garden);
        });

        it('should reveal the chosen provinces', function() {
            this.noMoreActions();
            this.player1.clickCard(this.land);
            this.player1.clickCard(this.fury);
            this.player1.clickCard(this.temple);
            this.player1.clickCard(this.brushfires);
            this.player1.clickCard(this.khans);
            this.player1.clickCard(this.market);
            this.player1.clickPrompt('Done');
            expect(this.getChatLogs(5)).toContain('player1 plays Lay of the Land to reveal Elemental Fury, Temple of the Dragons, Brushfires, Khan\'s Ordu and Market of Kaze-no-Kami');
        });

        it('should trigger reactions simultaneously', function() {
            this.noMoreActions();
            this.player1.clickCard(this.land);
            this.player1.clickCard(this.fury);
            this.player1.clickCard(this.temple);
            this.player1.clickCard(this.brushfires);
            this.player1.clickCard(this.khans);
            this.player1.clickCard(this.market);
            this.player1.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.fury);
            expect(this.player1).toBeAbleToSelect(this.temple);
            this.player1.clickCard(this.fury);
            this.player1.clickRing('water');

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.market);
            expect(this.player2).toBeAbleToSelect(this.brushfires);
            expect(this.player2).toBeAbleToSelect(this.khans);
            this.player2.clickCard(this.khans);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.fury);
            expect(this.player1).toBeAbleToSelect(this.temple);
        });
    });
});
