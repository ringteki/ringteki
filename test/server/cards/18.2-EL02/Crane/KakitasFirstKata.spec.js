describe('Kakita\'s First Kata', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['vice-proprietor'],
                    hand: ['a-new-name', 'fine-katana', 'ornate-fan', 'assassination', 'let-go']
                },
                player2: {
                    inPlay: ['kakita-yoshi', 'doji-challenger', 'hantei-sotorii', 'mirumoto-raitsugu'],
                    hand: ['kakita-s-first-kata', 'dutiful-assistant']
                }
            });

            this.vice = this.player1.findCardByName('vice-proprietor');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.stance = this.player2.findCardByName('kakita-s-first-kata');

            this.ann = this.player1.findCardByName('a-new-name');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.assassination = this.player1.findCardByName('assassination');
            this.letGo = this.player1.findCardByName('let-go');
            this.assistant = this.player2.findCardByName('dutiful-assistant');

            this.yoshi.honor();

            this.player1.pass();
            this.player2.playAttachment(this.assistant, this.yoshi);
        });

        it('should ready and discard - crane character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.sotorii, this.raitsugu, this.challenger],
                type: 'political'
            });

            this.player2.pass();
            this.player1.clickCard(this.vice);
            this.player2.clickCard(this.yoshi);
            let hand = this.player1.hand.length;
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.stance);
            this.player2.clickCard(this.stance);
            expect(this.getChatLogs(5)).toContain('player2 plays Kakita\'s First Kata to ready Kakita Yoshi and make player1 discard 5 cards at random');
            expect(this.player1.hand.length).toBe(hand - 5);
        });

        it('should not react - non-crane, non-duelist', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.sotorii, this.raitsugu, this.challenger],
                type: 'political'
            });

            this.player2.pass();
            this.player1.clickCard(this.vice);
            this.player2.clickCard(this.sotorii);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });

        it('should ready and discard - non-crane duelist character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.sotorii, this.raitsugu, this.challenger],
                type: 'political'
            });

            this.player2.pass();
            this.player1.clickCard(this.vice);
            this.player2.clickCard(this.raitsugu);
            let hand = this.player1.hand.length;
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.stance);
            this.player2.clickCard(this.stance);
            expect(this.getChatLogs(5)).toContain('player2 plays Kakita\'s First Kata to ready Mirumoto Raitsugu and make player1 discard 1 card at random');
            expect(this.player1.hand.length).toBe(hand - 1);
        });
    });
});
