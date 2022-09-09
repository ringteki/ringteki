fdescribe('Loyal Retainer', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-the-blade'],
                    hand: ['fine-katana', 'dragon-s-fang', 'dragon-s-claw', 'loyal-retainer'],
                },
                player2: {
                    hand: ['let-go', 'disarm']
                }
            });

            this.masterOfTheBlade = this.player1.findCardByName('master-of-the-blade');

            this.dragonsClaw = this.player1.findCardByName('dragon-s-claw');
            this.dragonsFang = this.player1.findCardByName('dragon-s-fang');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.loyalRetainer = this.player1.findCardByName('loyal-retainer');

            this.letGo = this.player2.findCardByName('let-go');
            this.disarm = this.player2.findCardByName('disarm');
        });

        it('should trigger when an attachment is target', function() {
            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.masterOfTheBlade);

            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.fineKatana);

            expect(this.player1).toHavePrompt('Triggered Abilities');
        });
    });
});
