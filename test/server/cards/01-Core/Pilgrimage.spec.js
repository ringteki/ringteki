describe('Pilgrimage', function() {
    integration(function() {
        describe('Pilgrimage\'s persistent ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDeck: ['akodo-toturi'],
                        dynastyDiscard: ['shintao-monastery','shintao-monastery','shintao-monastery','shintao-monastery'],
                        inPlay: ['tattooed-wanderer', 'togashi-mitsu-2'],
                        hand: ['seeker-of-knowledge', 'fine-katana', 'charge', 'restored-heirloom']
                    },
                    player2: {
                        role: 'keeper-of-water',
                        provinces: ['pilgrimage'],
                        inPlay: [],
                        hand: ['display-of-power',],
                        dynastyDeck: ['keeper-initiate']
                    }
                });
                this.player1.placeCardInProvince(this.player1.findCardByName('shintao-monastery','dynasty discard pile'), 'province 1');
                this.player1.placeCardInProvince(this.player1.findCardByName('shintao-monastery','dynasty discard pile'), 'province 2');
                this.player1.placeCardInProvince(this.player1.findCardByName('shintao-monastery','dynasty discard pile'), 'province 3');
                this.player1.placeCardInProvince(this.player1.findCardByName('shintao-monastery','dynasty discard pile'), 'province 4');
                this.game.checkGameState(true);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['togashi-mitsu-2'],
                    ring:'earth',
                    defenders: [],
                    province:'pilgrimage'
                });
                this.player2.pass();
                this.player1.clickCard('seeker-of-knowledge');
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Home');
                this.player2.pass();
            });

            describe('When Pilgrimage is not broken', function() {

                it('should cancel the effects of the conflict ring', function() {
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Action Window');
                    expect(this.getChatLogs(1)).toContain('Pilgrimage cancels the ring effect');
                });

                it('should cancel conflict ring resolution due to card effects', function() {
                    this.player1.pass();
                    this.player2.pass();
                    this.player2.clickCard('display-of-power');
                    expect(this.player1).toHavePrompt('Action Window');
                    expect(this.getChatLogs(1)).toContain('Pilgrimage cancels the ring effect');
                });

                //Repro: Togashi Mitsu (2)
                it('should cancel other ring effects resolved by cards', function() {
                    this.player1.clickCard('togashi-mitsu-2');
                    this.player1.clickRing('fire');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.getChatLogs(3)).toContain('Pilgrimage cancels the ring effect');
                });

                it('should take effect before interrupts can trigger', function() {
                    this.player1.clickCard('togashi-mitsu-2');
                    this.player1.clickRing('water');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.player1).not().toHavePrompt('Interrupt Window');
                    expect(this.getChatLogs(3)).toContain('Pilgrimage cancels the ring effect');
                });
            });

            describe('when pilgrimage is broken', function() {

                beforeEach(function() {
                    this.player1.clickCard('fine-katana');
                    this.player1.clickCard('togashi-mitsu-2');
                    this.noMoreActions();
                });

                it('should not cancel the effects of the conflict ring', function() {
                    this.player2.pass();
                    this.player1.clickPrompt('No');
                    expect(this.player1).toHavePrompt('Earth Ring');
                });

                it('should not cancel conflict ring resolution due to card effects', function() {
                    this.player2.clickCard('display-of-power');
                    this.player1.clickPrompt('No');
                    expect(this.player2).toHavePrompt('Earth Ring');
                });
            });
        });
    });
});
