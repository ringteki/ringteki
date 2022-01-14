describe('Ikoma Tsanuri 2 Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['countryside-trader', 'ikoma-tsanuri-but-not'],
                    provinces: ['kenson-no-gakka', 'abandoning-honor', 'brother-s-gift-dojo'],
                    hand: ['cloud-the-mind', 'fine-katana', 'ornate-fan', 'forebearer-s-echoes'],
                    dynastyDiscard: ['iuchi-farseer']
                },
                player2: {
                    inPlay: ['countryside-trader', 'cunning-negotiator'],
                    provinces: ['midnight-revels', 'upholding-authority', 'manicured-garden', 'temple-of-the-dragons'],
                    dynastyDiscard: ['daidoji-marketplace']
                }
            });

            this.trader = this.player1.findCardByName('countryside-trader');
            this.kensonNoGakka = this.player1.findCardByName('kenson-no-gakka', 'province 1');
            this.upholding = this.player2.findCardByName('upholding-authority', 'province 2');
            this.brothersGiftDojo = this.player1.findCardByName('brother-s-gift-dojo', 'province 3');

            this.trader2 = this.player2.findCardByName('countryside-trader');
            this.revels = this.player2.findCardByName('midnight-revels', 'province 1');
            this.abandoning = this.player1.findCardByName('abandoning-honor', 'province 2');
            this.manicuredGarden = this.player2.findCardByName('manicured-garden', 'province 3');
            this.templeOfDragons = this.player2.findCardByName('temple-of-the-dragons', 'province 4');

            this.tsanuri = this.player1.findCardByName('ikoma-tsanuri-but-not');
            this.negotiator = this.player2.findCardByName('cunning-negotiator');
            this.marketPlace = this.player2.findCardByName('daidoji-marketplace');
            this.player2.placeCardInProvince(this.marketPlace, 'province 4');

            this.farseer = this.player1.findCardByName('iuchi-farseer');
            this.echoes = this.player1.findCardByName('forebearer-s-echoes');

            this.revels.facedown = false;
            this.manicuredGarden.facedown = false;
            this.templeOfDragons.facedown = true;

            this.trader.fate = 1;
            this.trader2.fate = 1;

            this.game.checkGameState(true);
        });

        it('should interrupt reactions', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.tsanuri],
                type: 'military',
                province: this.revels
            });
            this.player2.clickCard(this.revels);
            this.player2.clickCard(this.negotiator);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tsanuri);
            this.player1.clickCard(this.tsanuri);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Tsanuri but Not to cancel the effects of Midnight Revels\'s ability');
        });
    });
});
