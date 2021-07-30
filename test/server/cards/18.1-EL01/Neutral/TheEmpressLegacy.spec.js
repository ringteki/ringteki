describe('The Empress\'s Legacy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: [],
                    dynastyDiscard: ['the-empress-s-legacy', 'kitsu-warrior', 'akodo-toturi', 'kakita-toshimoko', 'seventh-tower', 'favorable-ground', 'city-of-lies', 'forgotten-library']
                }
            });
            this.legacy = this.player1.findCardByName('the-empress-s-legacy');
            this.kitsuWarrior = this.player1.findCardByName('kitsu-warrior');
            this.akodototuri = this.player1.findCardByName('akodo-toturi');
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.library = this.player1.findCardByName('forgotten-library');

            this.favorable = this.player1.findCardByName('favorable-ground');
            this.tower = this.player1.findCardByName('seventh-tower');
            this.cityOfLies = this.player1.findCardByName('city-of-lies');

            this.player1.moveCard(this.legacy, 'province 1');
            this.player1.moveCard(this.library, 'dynasty deck');
            this.player1.moveCard(this.toshimoko, 'dynasty deck');
            this.player1.moveCard(this.kitsuWarrior, 'dynasty deck');
            this.player1.moveCard(this.akodototuri, 'dynasty deck');
            this.player1.moveCard(this.favorable, 'dynasty deck');
            this.player1.moveCard(this.tower, 'dynasty deck');
            this.player1.moveCard(this.cityOfLies, 'dynasty deck');

            this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
            this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
            this.pSH = this.player1.findCardByName('shameful-display', 'stronghold province');

            this.legacy.facedown = false;

            this.p2.isBroken = true;
            this.p1.facedown = false;
            this.p2.facedown = false;
            this.p3.facedown = false;
            this.p4.facedown = true;
            this.pSH.facedown = false;
        });

        it('should allow you to select an unbroken faceup nonstronghold province', function() {
            this.player1.clickCard(this.legacy);
            expect(this.player1).toBeAbleToSelect(this.p1);
            expect(this.player1).not.toBeAbleToSelect(this.p2);
            expect(this.player1).toBeAbleToSelect(this.p3);
            expect(this.player1).not.toBeAbleToSelect(this.p4);
            expect(this.player1).not.toBeAbleToSelect(this.pSH);
        });

        it('should allow you to choose a unique character from your dynasty deck', function() {
            let cards = this.player1.provinces['province 3'].dynastyCards.length;
            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.p3);
            expect(this.player1).toHavePromptButton('Akodo Toturi');
            expect(this.player1).toHavePromptButton('Kakita Toshimoko');
            expect(this.player1).toHavePromptButton('Take nothing');
            this.player1.clickPrompt('Kakita Toshimoko');
            expect(this.player1.provinces['province 3'].dynastyCards.length).toBe(cards + 1);
            expect(this.toshimoko.location).toBe('province 3');
            expect(this.toshimoko.facedown).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays The Empress\'s Legacy to choose a character to place in a province');
            expect(this.getChatLogs(5)).toContain('player1 puts Kakita Toshimoko facedown into Shameful Display');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their dynasty deck');
        });
    });
});
