describe('One Man, One Strike', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['kakita-zinkae', 'brash-samurai', 'doji-challenger'],
                    hand: ['one-man-one-strike']
                },
                player2: {
                    inPlay: ['isawa-atsuko', 'solemn-scholar'],
                    hand: ['let-go', 'fine-katana', 'a-new-name', 'assassination', 'against-the-waves']
                }
            });

            this.zinkae = this.player1.findCardByName('kakita-zinkae');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.strike = this.player1.findCardByName('one-man-one-strike');

            this.atsuko = this.player2.findCardByName('isawa-atsuko');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.letgo = this.player2.findCardByName('let-go');
            this.katana = this.player2.findCardByName('fine-katana');
            this.ann = this.player2.findCardByName('a-new-name');
            this.assassination = this.player2.findCardByName('assassination');
            this.atw = this.player2.findCardByName('against-the-waves');

            this.challenger.bow();
        });

        it('should require you to choose a ready duelist as the challenger', function() {
            this.player1.clickCard(this.strike);
            expect(this.player1).toBeAbleToSelect(this.zinkae);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });

        it('should give opportunity to refuse', function() {
            this.player1.clickCard(this.strike);
            this.player1.clickCard(this.zinkae);
            this.player1.clickCard(this.atsuko);
            expect(this.player2).toHavePrompt('Do you wish to refuse the duel?');
            expect(this.player2).toHavePromptButton('Yes');
            expect(this.player2).toHavePromptButton('No');
        });

        it('should discard half your hand rounded down to refuse', function() {
            this.player1.clickCard(this.strike);
            this.player1.clickCard(this.zinkae);
            this.player1.clickCard(this.atsuko);

            this.player2.clickPrompt('Yes');
            expect(this.player2).toBeAbleToSelect(this.letgo);
            expect(this.player2).toBeAbleToSelect(this.katana);
            expect(this.player2).toBeAbleToSelect(this.assassination);
            expect(this.player2).toBeAbleToSelect(this.ann);
            expect(this.player2).toBeAbleToSelect(this.atw);

            expect(this.player2).toHavePrompt('Choose 2 cards to discard');
            expect(this.getChatLogs(5)).toContain('player2 chooses to refuse the duel and discard 2 cards from their hand');

            this.player2.clickCard(this.letgo);
            expect(this.player2).not.toHavePromptButton('Done');
            this.player2.clickCard(this.katana);
            expect(this.player2).toHavePromptButton('Done');
            this.player2.clickPrompt('Done');

            expect(this.letgo.location).toBe('conflict discard pile');
            expect(this.katana.location).toBe('conflict discard pile');

            expect(this.getChatLogs(5)).toContain('player2 discards Let Go and Fine Katana');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should bow & dishonor the loser & stop them from readying', function() {
            // this.noMoreActions();
            // this.initiateConflict({
            //     attackers: [this.zinkae, this.brash],
            //     defenders: [this.toshimoko, this.whisperer]
            // });

            this.player1.clickCard(this.strike);
            this.player1.clickCard(this.zinkae);
            this.player1.clickCard(this.atsuko);
            this.player2.clickPrompt('No');

            expect(this.player1).toHavePrompt('Honor Bid');
            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');

            expect(this.getChatLogs(10)).toContain('Duel Effect: bow and dishonor Isawa Atsuko, preventing them from readying for the rest of the phase');
            expect(this.atsuko.bowed).toBe(true);
            expect(this.atsuko.isDishonored).toBe(true);

            this.player2.clickCard(this.atw);
            expect(this.player2).toBeAbleToSelect(this.scholar);
            expect(this.player2).not.toBeAbleToSelect(this.atsuko);
        });

        it('during a conflict should let you pick a mix of participating and not', function() {
            this.challenger.ready();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash, this.challenger],
                defenders: [this.atsuko]
            });

            this.player2.pass();

            this.player1.clickCard(this.strike);
            expect(this.player1).toBeAbleToSelect(this.zinkae);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.zinkae);
            expect(this.player1).toBeAbleToSelect(this.atsuko);
            expect(this.player1).toBeAbleToSelect(this.scholar);
        });
    });
});
