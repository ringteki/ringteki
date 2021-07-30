describe('Ashigaru Company', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja'],
                    hand: ['ashigaru-company'],
                    conflictDiscard: ['ashigaru-company', 'ayubune-pilot', 'banzai', 'assassination', 'charge', 'against-the-waves', 'let-go']
                },
                player2: {
                    inPlay: []
                }
            });

            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.company1 = this.player1.findCardByName('ashigaru-company', 'hand');

            this.company2 = this.player1.findCardByName('ashigaru-company', 'conflict discard pile');
            this.pilot = this.player1.findCardByName('ayubune-pilot');
            this.banzai = this.player1.findCardByName('banzai');
            this.assassination = this.player1.findCardByName('assassination');
            this.charge = this.player1.findCardByName('charge');
            this.atw = this.player1.findCardByName('against-the-waves');
            this.letGo = this.player1.findCardByName('let-go');

            this.player1.moveCard(this.atw, 'conflict deck');
            this.player1.moveCard(this.letGo, 'conflict deck');
            this.player1.moveCard(this.charge, 'conflict deck');
            this.player1.moveCard(this.assassination, 'conflict deck');
            this.player1.moveCard(this.banzai, 'conflict deck');
            this.player1.moveCard(this.pilot, 'conflict deck');
            this.player1.moveCard(this.company2, 'conflict deck');

        });

        it('should react to entering play', function() {
            this.player1.clickCard(this.company1);
            this.player1.clickCard(this.doomed);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.company1);
        });

        it('should let you find a follower', function() {
            this.player1.clickCard(this.company1);
            this.player1.clickCard(this.doomed);
            this.player1.clickCard(this.company1);
            expect(this.player1).toHavePrompt('Choose a card to put in your hand');
            expect(this.player1).toHavePromptButton('Ashigaru Company');
            expect(this.player1).toHavePromptButton('Ayubune Pilot');
            expect(this.player1).toHaveDisabledPromptButton('Banzai!');
            expect(this.player1).toHaveDisabledPromptButton('Charge!');
            expect(this.player1).toHaveDisabledPromptButton('Assassination');
        });

        it('should add the chosen card to your hand and put the rest on the bottom', function() {
            this.player1.clickCard(this.company1);
            this.player1.clickCard(this.doomed);
            this.player1.clickCard(this.company1);
            this.player1.clickPrompt('Ashigaru Company');
            expect(this.company2.location).toBe('hand');

            const deck = this.player1.conflictDeck;
            const L = this.player1.conflictDeck.length;
            const banzaiBottom = deck[L - 4] === this.banzai || deck[L - 3] === this.banzai || deck[L - 2] === this.banzai || deck[L - 1] === this.banzai;
            const chargeBottom = deck[L - 4] === this.charge || deck[L - 3] === this.charge || deck[L - 2] === this.charge || deck[L - 1] === this.charge;
            const assassinationBottom = deck[L - 4] === this.assassination || deck[L - 3] === this.assassination || deck[L - 2] === this.assassination || deck[L - 1] === this.assassination;
            const pilotBottom = deck[L - 4] === this.pilot || deck[L - 3] === this.pilot || deck[L - 2] === this.pilot || deck[L - 1] === this.pilot;

            expect(banzaiBottom).toBe(true);
            expect(chargeBottom).toBe(true);
            expect(assassinationBottom).toBe(true);
            expect(pilotBottom).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Ashigaru Company to look at the top five cards of their deck');
            expect(this.getChatLogs(5)).toContain('player1 takes Ashigaru Company');
            expect(this.getChatLogs(5)).toContain('player1 puts 4 cards on the bottom of their conflict deck');
        });
    });
});
