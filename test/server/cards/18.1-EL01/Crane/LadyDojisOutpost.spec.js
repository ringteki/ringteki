describe('Lady Dojis Outpost', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    honor: 15,
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'doji-kuwanan'],
                    hand: ['resourcefulness'],
                    stronghold: ['lady-doji-s-outpost']
                },
                player2: {
                    honor: 10,
                    inPlay: ['beloved-advisor', 'beloved-advisor'],
                    hand: ['forgery'],
                    stronghold: ['city-of-the-open-hand']
                }
            });

            this.outpost = this.player1.findCardByName('lady-doji-s-outpost');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.resourcefulness = this.player1.findCardByName('resourcefulness');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.advisor1 = this.player2.filterCardsByName('beloved-advisor')[0];
            this.advisor2 = this.player2.filterCardsByName('beloved-advisor')[1];
            this.city = this.player2.findCardByName('city-of-the-open-hand');

            this.forgery = this.player2.findCardByName('forgery');

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
        });

        it('should trigger at the start of the conflict phase and prompt the player to name a card', function() {
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.outpost);
            this.player1.clickCard(this.outpost);
            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt(this.advisor1.name, 'card-name');
            expect(this.getChatLogs(1)).toContain('player1 uses Lady Dōji\'s Outpost, bowing Lady Dōji\'s Outpost and naming Beloved Advisor to cancel the first ability triggered by player2 from a non-Stronghold card named Beloved Advisor');
        });

        it('should cancel the first activation but not the second', function() {
            let hand = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.player1.clickCard(this.outpost);
            this.player1.chooseCardInPrompt(this.advisor1.name, 'card-name');

            this.player1.pass();
            this.player2.clickCard(this.advisor1);

            expect(this.getChatLogs(5)).toContain('player2 attempts to initiate Beloved Advisor\'s ability, but Lady Dōji\'s Outpost cancels it');
            expect(this.player1.hand.length).toBe(hand);
            expect(this.player2.hand.length).toBe(hand2);

            this.player1.pass();
            this.player2.clickCard(this.advisor1);
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.advisor2);
            expect(this.player1.hand.length).toBe(hand + 1);
            expect(this.player2.hand.length).toBe(hand2 + 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Beloved Advisor to draw 1 card');
        });

        it('should not cancel non-named cards', function() {
            let hand = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.player1.clickCard(this.outpost);
            this.player1.chooseCardInPrompt(this.forgery.name, 'card-name');

            this.player1.pass();
            this.player2.clickCard(this.advisor1);

            expect(this.getChatLogs(5)).not.toContain('player2 attempts to initiate Beloved Advisor\'s ability, but Lady Dōji\'s Outpost cancels it');
            expect(this.player1.hand.length).toBe(hand + 1);
            expect(this.player2.hand.length).toBe(hand2 + 1);

            this.player1.clickCard(this.resourcefulness);
            this.player1.clickCard(this.kuwanan);
            this.player1.clickCard(this.challenger);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.forgery);
            expect(this.getChatLogs(5)).not.toContain('player2 attempts to initiate Forgery\'s ability, but Lady Dōji\'s Outpost cancels it');

            expect(this.kuwanan.isHonored).toBe(true);
            expect(this.challenger.isDishonored).toBe(true);

            expect(this.forgery.location).toBe('conflict discard pile');
        });

        it('should not cancel Strongholds', function() {
            let honor = this.player2.honor;

            this.player1.clickCard(this.outpost);
            this.player1.chooseCardInPrompt(this.city.name, 'card-name');

            this.player1.pass();
            this.player2.clickCard(this.city);

            expect(this.getChatLogs(5)).not.toContain('player2 attempts to initiate City of the Open Hand\'s ability, but Lady Dōji\'s Outpost cancels it');
            expect(this.getChatLogs(5)).toContain('player2 uses City of the Open Hand, bowing City of the Open Hand to gain 1 honor');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player2.honor).toBe(honor + 1);
        });

        it('should expire at the end of the phase', function() {
            this.advisor1.fate = 5;
            this.player1.player.promptedActionWindows.fate = true;
            this.player2.player.promptedActionWindows.fate = true;

            let hand = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.player1.clickCard(this.outpost);
            this.player1.chooseCardInPrompt(this.advisor1.name, 'card-name');

            this.advancePhases('fate');
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            this.player1.pass();
            this.player2.clickCard(this.advisor1);

            expect(this.getChatLogs(5)).not.toContain('player2 attempts to initiate Beloved Advisor\'s ability, but Lady Dōji\'s Outpost cancels it');
            expect(this.player1.hand.length).toBe(hand + 1);
            expect(this.player2.hand.length).toBe(hand2 + 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Beloved Advisor to draw 1 card');
        });
    });
});
