describe('Yasuki Kiyoko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 1,
                    inPlay: ['yasuki-kiyoko', 'keeper-initiate', 'eager-scout'],
                    hand: ['way-of-the-crab', 'seal-of-the-crab'],
                    dynastyDeck: ['funeral-pyre']
                },
                player2: {
                    inPlay: ['stoic-gunso']
                }
            });
            this.funeralPyre = this.player1.placeCardInProvince('funeral-pyre');
            this.kiyoko = this.player1.findCardByName('yasuki-kiyoko');
        });

        it('should trigger on a character leaving play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kiyoko],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.funeralPyre);
            this.player1.clickCard('eager-scout');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.kiyoko);
        });

        it('should give the choice between a card and a fate - fate', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kiyoko],
                defenders: []
            });
            let fate = this.player1.fate
            this.player2.pass();
            this.player1.clickCard(this.funeralPyre);
            this.player1.clickCard('eager-scout');
            this.player1.clickCard(this.kiyoko);
            expect(this.player1.currentButtons).toContain('Gain 1 fate');
            expect(this.player1.currentButtons).toContain('Draw 1 card');
            this.player1.clickPrompt('Gain 1 fate');
            expect(this.player1.fate).toBe(fate + 1);
        });

        it('should give the choice between a card and a fate - card', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kiyoko],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.funeralPyre);
            this.player1.clickCard('eager-scout');
            this.player1.clickCard(this.kiyoko);
            let hand = this.player1.hand.length;
            expect(this.player1.currentButtons).toContain('Gain 1 fate');
            expect(this.player1.currentButtons).toContain('Draw 1 card');
            this.player1.clickPrompt('Draw 1 card');
            expect(this.player1.hand.length).toBe(hand + 2); //+1 from draw, +1 from pyre
            expect(this.getChatLogs(5)).toContain('player1 uses Yasuki Kiyoko to draw 1 card');
        });

        it('should not trigger on opponent\'s characters leaving play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kiyoko],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('way-of-the-crab');
            this.player1.clickCard('eager-scout');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.kiyoko);
            this.player1.pass();
            expect(this.player2).toHavePrompt('Way of the Crab');
            expect(this.player2).toBeAbleToSelect('stoic-gunso');
            this.stoicGunso = this.player2.clickCard('stoic-gunso');
            expect(this.stoicGunso.location).toBe('conflict discard pile');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
