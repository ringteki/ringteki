describe('Asako Reina', function() {
    integration(function() {
        describe('Asako Reina\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-reina', 'seeker-of-knowledge'],
                        hand: ['know-the-world']
                    }
                });
                this.seeker = this.player1.findCardByName('seeker-of-knowledge');
                this.asakoReina = this.player1.findCardByName('asako-reina');
                this.seeker.bow();                
                this.asakoReina.bow();                
            });

            describe('should end up with +1 honor', function() {
                it('when the air ring is claimed', function() {
                    this.player1.honor = 10;
                    this.player1.clickCard(this.asakoReina);
                    expect(this.player1.honor).toBe(11);
                });
            });

            describe('should give +1 card ', function() {
                it('when the earth ring is claimed', function() {
                    let hand = this.player1.hand.length;
                    this.player1.clickCard(this.asakoReina);
                    expect(this.player1.hand.length).toBe(hand + 2);
                });
            });

            describe('should let you choose a character to be honored', function() {
                it('when the fire ring is claimed', function() {
                    this.player1.clickCard(this.asakoReina);
                    expect(this.player1).toBeAbleToSelect(this.asakoReina);
                    this.player1.clickCard(this.asakoReina);
                    expect(this.asakoReina.isHonored).toBe(true)
                });
            });
            describe('should let you choose a character to be readied', function() {
                it('when the water ring is claimed', function() {
                    this.player1.clickCard(this.asakoReina);
                    expect(this.player1).toBeAbleToSelect(this.seeker);
                    this.player1.clickCard(this.seeker);
                    expect(this.seeker.bowed).toBe(false)
                });
                it('when the water ring is claimed but not for a 3 coster or above', function() {
                    this.player1.clickCard(this.asakoReina);
                    expect(this.player1).not.toBeAbleToSelect(this.asakoReina);
                    this.player1.clickCard(this.asakoReina);
                    this.player1.clickCard(this.seeker);
                    expect(this.asakoReina.bowed).toBe(true)
                    expect(this.seeker.bowed).toBe(false)
                });
            });
            describe('should gain +1 fate', function() {
                it('when the void ring is claimed', function() {
                    let fate = this.player1.fate;
                    this.player1.clickCard(this.asakoReina);
                    expect(this.player1.fate).toBe(fate + 1);
                });
            });
        });
    });
});
