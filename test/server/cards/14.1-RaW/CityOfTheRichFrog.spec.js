describe('City of the Rich Frog', function() {
    integration(function() {
        describe('Testing Eminent', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        provinces: ['city-of-the-rich-frog'],
                        inPlay: ['kitsu-warrior'],
                        dynastyDiscard: ['bayushi-liar', 'bayushi-shoju', 'doomed-shugenja', 'akodo-zentaro']
                    },
                    player2: {
                        dynastyDiscard: ['kitsuki-yaruma']
                    }
                });

                this.richFrog = this.player1.findCardByName('city-of-the-rich-frog', 'province 1');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 2');
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.akodoZentaro = this.player1.findCardByName('akodo-zentaro');
                this.kitsuWarrior = this.player1.findCardByName('kitsu-warrior');
                this.bayushiLiar = this.player1.placeCardInProvince('bayushi-liar', 'province 1');
                this.bayushiShoju = this.player1.placeCardInProvince('bayushi-shoju', 'province 2');

                this.kitsukiYaruma = this.player2.placeCardInProvince('kitsuki-yaruma', 'province 1');
            });

            it('should start the game faceup', function() {
                expect(this.richFrog.facedown).toBe(false);
            });

            it('should not be able to be turned facedown', function() {
                this.shamefulDisplay.facedown = false;
                this.player1.pass();
                this.player2.clickCard(this.kitsukiYaruma);
                this.player2.clickPrompt('0');
                expect(this.kitsukiYaruma.location).toBe('play area');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.kitsukiYaruma);
                expect(this.player2).toHavePrompt('Choose a province');
                expect(this.player2).toBeAbleToSelect(this.shamefulDisplay);
                expect(this.player2).not.toBeAbleToSelect(this.richFrog);
            });
        });

        describe('testing eminent - during setup', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'setup',
                    player1: {
                        provinces: ['city-of-the-rich-frog']
                    },
                    skipAutoSetup: true
                });
                this.richFrog = this.player1.findCardByName('city-of-the-rich-frog');

                this.selectFirstPlayer(this.player1);
            });

            it('cannot be stronghold province', function() {
                expect(this.player1).toHavePrompt('Select stronghold province');
                this.player1.clickCard(this.richFrog);
                expect(this.player1).toHavePrompt('Select stronghold province');
            });
        });

        describe('Testing City of the Rich Frog', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'setup',
                    player1: {
                        fate: 30,
                        provinces: ['city-of-the-rich-frog', 'manicured-garden', 'shameful-display', 'midnight-revels', 'upholding-authority'],
                        dynastyDeck: ['adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves'],
                        dynastyDiscard: ['adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves'],
                        hand: ['backhanded-compliment']
                    },
                    player2: {
                    },
                    skipAutoSetup: true
                });

                this.richFrog = this.player1.findCardByName('city-of-the-rich-frog');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display');
                this.manicured = this.player1.findCardByName('manicured-garden');
                this.revels = this.player1.findCardByName('midnight-revels');
                this.upholding = this.player1.findCardByName('upholding-authority');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.revels);
                this.player1.clickCard(this.richFrog);
                this.player1.clickCard(this.shamefulDisplay);
                this.player1.clickCard(this.manicured);
                this.player1.clickCard(this.upholding);
                this.player1.clickPrompt('Done');

                this.player2.clickCard('shameful-display');
                this.player2.clickPrompt('Done');
            });

            it('should only have one card during setup', function() {
                expect(this.player1).toHavePrompt('Select dynasty cards to mulligan');
                expect(this.richFrog.location).toBe('province 1');
                expect(this.player1.player.getDynastyCardsInProvince('province 1').length).toBe(1);
            });

            it('should fill to 3 cards after setup', function() {
                this.keepDynasty();
                this.keepConflict();
                expect(this.getChatLogs(10)).toContain('City of the Rich Frog fills to 3 cards!');

                expect(this.richFrog.location).toBe('province 1');
                expect(this.player1.player.getDynastyCardsInProvince('province 1').length).toBe(3);
            });

            it('should have all 3 cards be faceup after setup', function() {
                this.keepDynasty();
                this.keepConflict();
                expect(this.richFrog.location).toBe('province 1');
                expect(this.player1.player.getDynastyCardsInProvince('province 1').length).toBe(3);

                let cards = this.player1.player.getDynastyCardsInProvince('province 1');
                cards.forEach(card => {
                    expect(card.facedown).toBe(false);
                });
            });

            it('should refill to 3 cards after buying all cards from the province', function() {
                this.keepDynasty();
                this.keepConflict();
                this.player1.clickCard('backhanded-compliment');
                this.player1.clickPrompt('player1');
                this.player2.pass();

                let cards = this.player1.player.getDynastyCardsInProvince(this.richFrog.location);
                expect(cards.length).toBe(3);
                let i = 0;
                cards.forEach(card => {
                    expect(card.facedown).toBe(false);
                    expect(this.player1.player.getDynastyCardsInProvince(this.richFrog.location).length).toBe(3 - i);
                    this.player1.clickCard(card);
                    this.player1.clickPrompt('0');
                    i++;
                });

                cards = this.player1.player.getDynastyCardsInProvince(this.richFrog.location);
                expect(cards.length).toBe(3);
            });


            it('should refill to 3 cards even if you deck yourself while refilling', function() {
                this.keepDynasty();
                this.keepConflict();
                this.player1.clickCard('backhanded-compliment');
                this.player1.clickPrompt('player1');
                this.player2.pass();

                this.player1.reduceDeckToNumber('dynasty deck', 1);

                let cards = this.player1.player.getDynastyCardsInProvince(this.richFrog.location);
                expect(cards.length).toBe(3);
                let i = 0;
                cards.forEach(card => {
                    expect(card.facedown).toBe(false);
                    expect(this.player1.player.getDynastyCardsInProvince(this.richFrog.location).length).toBe(3 - i);
                    this.player1.clickCard(card);
                    this.player1.clickPrompt('0');
                    i++;
                });

                cards = this.player1.player.getDynastyCardsInProvince(this.richFrog.location);
                expect(cards.length).toBe(3);
            });
        });
    });
});
