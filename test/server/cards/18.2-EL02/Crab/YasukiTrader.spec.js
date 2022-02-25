describe('Yasuki Trader', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 1,
                    inPlay: ['yasuki-trader', 'keeper-initiate', 'eager-scout'],
                    hand: ['way-of-the-crab', 'seal-of-the-crab'],
                    dynastyDeck: ['funeral-pyre']
                },
                player2: {
                    inPlay: ['stoic-gunso']
                }
            });
            this.funeralPyre = this.player1.placeCardInProvince('funeral-pyre');
            this.trader = this.player1.findCardByName('yasuki-trader');
        });

        it('should trigger on a character leaving play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.trader],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.funeralPyre);
            this.player1.clickCard('eager-scout');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.trader);
        });

        it('should give a card and a fate', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.trader],
                defenders: []
            });
            this.player2.pass();
            let hand = this.player1.hand.length;
            let fate = this.player1.fate;
            this.player1.clickCard(this.funeralPyre);
            this.player1.clickCard('eager-scout');
            this.player1.clickCard(this.trader);
            expect(this.player1.hand.length).toBe(hand + 2); //+1 from draw, +1 from pyre
            expect(this.player1.fate).toBe(fate + 1); //+1 from draw, +1 from pyre
            expect(this.getChatLogs(5)).toContain('player1 uses Yasuki Trader to gain 1 fate and draw 1 card');
        });

        it('should not trigger on opponent\'s characters leaving play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.trader],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('way-of-the-crab');
            this.player1.clickCard('eager-scout');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.trader);
            this.player1.pass();
            expect(this.player2).toHavePrompt('Way of the Crab');
            expect(this.player2).toBeAbleToSelect('stoic-gunso');
            this.stoicGunso = this.player2.clickCard('stoic-gunso');
            expect(this.stoicGunso.location).toBe('conflict discard pile');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
