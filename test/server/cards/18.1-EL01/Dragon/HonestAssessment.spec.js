describe('Dragons Claw', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'kakita-yoshi'],
                    hand: ['honest-assessment']
                },
                player2: {
                    hand: ['dragon-s-claw', 'dragon-s-fang', 'fine-katana', 'fine-katana']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.assessment = this.player1.findCardByName('honest-assessment');

            this.claw = this.player2.findCardByName('dragon-s-claw');
            this.fang = this.player2.findCardByName('dragon-s-fang');
            this.katana1 = this.player2.filterCardsByName('fine-katana')[0];
            this.katana2 = this.player2.filterCardsByName('fine-katana')[1];
        });

        it('should attach to a courtier', function() {
            this.player1.clickCard(this.assessment);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.yoshi);
            expect(this.assessment.parent).toBe(this.yoshi);
        });

        it('should prompt you to name a card and reveal hand if opponent doesn\'t have the card', function() {
            this.player1.clickCard(this.assessment);
            this.player1.clickCard(this.yoshi);

            this.player2.pass();
            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt(this.assessment.name, 'card-name');

            expect(this.getChatLogs(10)).toContain('player1 uses Kakita Yoshi\'s gained ability from Honest Assessment, naming Honest Assessment to look at player2\'s hand for cards named Honest Assessment');
            expect(this.getChatLogs(10)).toContain('Kakita Yoshi sees Dragon\'s Claw, Dragon\'s Fang, Fine Katana and Fine Katana');
        });

        it('should prompt opponent to choose to discard if they have the card', function() {
            this.player1.clickCard(this.assessment);
            this.player1.clickCard(this.yoshi);

            this.player2.pass();
            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt(this.katana1.name, 'card-name');

            expect(this.getChatLogs(10)).toContain('player1 uses Kakita Yoshi\'s gained ability from Honest Assessment, naming Fine Katana to look at player2\'s hand for cards named Fine Katana');
            expect(this.getChatLogs(10)).toContain('Kakita Yoshi sees Dragon\'s Claw, Dragon\'s Fang, Fine Katana and Fine Katana');
            expect(this.player2).toHavePrompt('Discard a copy of Fine Katana?');
            expect(this.player2).toHavePromptButton('Yes');
            expect(this.player2).toHavePromptButton('No');
        });

        it('choosing to discard', function() {
            this.player1.clickCard(this.assessment);
            this.player1.clickCard(this.yoshi);
            this.player2.pass();

            let hand1 = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt(this.katana1.name, 'card-name');
            this.player2.clickPrompt('Yes');

            expect(this.player1.hand.length).toBe(hand1);
            expect(this.player2.hand.length).toBe(hand2 - 1);

            let katana1Discarded = this.katana1.location === 'conflict discard pile';
            let katana2Discarded = this.katana2.location === 'conflict discard pile';

            expect(katana1Discarded || katana2Discarded).toBe(true);
            expect(katana1Discarded && katana2Discarded).toBe(false);
            expect(this.getChatLogs(10)).toContain('player2 chooses to discard a copy of Fine Katana');
            expect(this.getChatLogs(10)).toContain('player2 discards Fine Katana');
        });

        it('choosing not to discard', function() {
            this.player1.clickCard(this.assessment);
            this.player1.clickCard(this.yoshi);
            this.player2.pass();

            let hand1 = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt(this.katana1.name, 'card-name');
            this.player2.clickPrompt('No');

            expect(this.player1.hand.length).toBe(hand1 + 1);
            expect(this.player2.hand.length).toBe(hand2);

            let katana1Discarded = this.katana1.location === 'conflict discard pile';
            let katana2Discarded = this.katana2.location === 'conflict discard pile';

            expect(katana1Discarded || katana2Discarded).toBe(false);
            expect(katana1Discarded && katana2Discarded).toBe(false);
            expect(this.getChatLogs(10)).toContain('player2 chooses to let player1 draw a card');
        });
    });
});
