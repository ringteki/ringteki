describe('Logistics', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['total-warfare', 'logistics', 'fine-katana'],
                    inPlay: ['bayushi-shoju'],
                    dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'kakita-toshimoko', 'dispatch-to-nowhere', 'kakita-yoshi', 'doji-whisperer'],
                    provinces: ['dishonorable-assault'],
                    stronghold: 'kyuden-kakita'
                },
                player2: {
                    hand: ['educated-heimin', 'prepared-ambush']
                }
            });

            this.logistics = this.player1.findCardByName('logistics');

            this.assault = this.player1.findCardByName('dishonorable-assault');
            this.shoju = this.player1.findCardByName('bayushi-shoju');
            this.katana = this.player1.findCardByName('fine-katana');
            this.kyudenKakita = this.player1.findCardByName('kyuden-kakita');

            this.totalWarfare = this.player1.findCardByName('total-warfare');
            this.heimin = this.player2.findCardByName('educated-heimin');
            this.ambush = this.player2.findCardByName('prepared-ambush');

            this.storehouse = this.player1.findCardByName('imperial-storehouse');
            this.ground = this.player1.findCardByName('favorable-ground');
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.dispatch = this.player1.findCardByName('dispatch-to-nowhere');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');

            this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
            this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
            this.pStronghold = this.player1.findCardByName('shameful-display', 'stronghold province');

            this.p1_2 = this.player2.findCardByName('shameful-display', 'province 1');
            this.p2_2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.p3_2 = this.player2.findCardByName('shameful-display', 'province 3');
            this.p4_2 = this.player2.findCardByName('shameful-display', 'province 4');
            this.pStronghold_2 = this.player2.findCardByName('shameful-display', 'stronghold province');

            this.player1.placeCardInProvince(this.storehouse, 'province 1');
            this.player1.placeCardInProvince(this.ground, 'province 2');
            this.player1.placeCardInProvince(this.toshimoko, 'province 3');
            this.player1.placeCardInProvince(this.dispatch, 'province 4');
            this.player1.moveCard(this.yoshi, 'province 1');

            this.player1.reduceDeckToNumber('dynasty deck', 0);
            this.player1.moveCard(this.whisperer, 'dynasty deck');

            this.p4.isBroken = true;
            this.p4_2.isBroken = true;

            this.storehouse.facedown = false;
            this.yoshi.facedown = false;
            this.ground.facedown = true;
            this.toshimoko.facedown = true;
            this.dispatch.facedown = false;

            this.player1.playAttachment(this.totalWarfare, this.p3);
            this.player2.playAttachment(this.heimin, this.pStronghold_2);
            this.player1.playAttachment(this.katana, this.shoju);
            this.player2.playAttachment(this.ambush, this.p2);
        });

        it('should allow you to select a card in or attached to a province, whether or not it is facedown', function() {
            this.player1.clickCard(this.logistics);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            expect(this.player1).toBeAbleToSelect(this.ground);
            expect(this.player1).toBeAbleToSelect(this.toshimoko);
            expect(this.player1).toBeAbleToSelect(this.dispatch);
            expect(this.player1).toBeAbleToSelect(this.totalWarfare);
            expect(this.player1).toBeAbleToSelect(this.heimin);
            expect(this.player1).toBeAbleToSelect(this.ambush);

            expect(this.player1).not.toBeAbleToSelect(this.kyudenKakita);
            expect(this.player1).not.toBeAbleToSelect(this.assault);
            expect(this.player1).not.toBeAbleToSelect(this.shoju);
            expect(this.player1).not.toBeAbleToSelect(this.katana);
        });

        it('should not work if there are no eligible provinces', function() {
            this.assault.isBroken = true;
            this.p2.isBroken = true;
            this.p3.isBroken = true;
            this.p4.isBroken = true;

            this.p1_2.isBroken = true;
            this.p2_2.isBroken = true;
            this.p3_2.isBroken = true;
            this.p4_2.isBroken = true;

            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.logistics);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should limit selection if there are very few eligible provinces', function() {
            this.assault.isBroken = true;
            this.p2.isBroken = true;
            this.p3.isBroken = false;
            this.p4.isBroken = true;

            this.p1_2.isBroken = true;
            this.p2_2.isBroken = true;
            this.p3_2.isBroken = true;
            this.p4_2.isBroken = true;

            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.logistics);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            expect(this.player1).toBeAbleToSelect(this.ground);
            expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
            expect(this.player1).toBeAbleToSelect(this.dispatch);
            expect(this.player1).not.toBeAbleToSelect(this.totalWarfare);
            expect(this.player1).not.toBeAbleToSelect(this.heimin);
            expect(this.player1).toBeAbleToSelect(this.ambush);
        });

        describe('Selecting a card in a province', function() {
            it('should allow you to choose an unbroken non-stronghold province controlled by the same player', function() {
                this.player1.clickCard(this.logistics);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.yoshi);

                expect(this.player1).not.toBeAbleToSelect(this.assault);
                expect(this.player1).toBeAbleToSelect(this.p2);
                expect(this.player1).toBeAbleToSelect(this.p3);
                expect(this.player1).not.toBeAbleToSelect(this.p4);
                expect(this.player1).not.toBeAbleToSelect(this.pStronghold_2);

                expect(this.player1).not.toBeAbleToSelect(this.p1_2);
                expect(this.player1).not.toBeAbleToSelect(this.p2_2);
                expect(this.player1).not.toBeAbleToSelect(this.p3_2);
                expect(this.player1).not.toBeAbleToSelect(this.p4_2);
                expect(this.player1).not.toBeAbleToSelect(this.pStronghold_2);
            });

            it('should move the card', function() {
                this.player1.clickCard(this.logistics);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.yoshi);
                expect(this.yoshi.location).toBe('province 1');
                this.player1.clickCard(this.p2);
                expect(this.yoshi.location).toBe('province 2');
            });

            it('should cause the province to refill', function() {
                this.player1.clickCard(this.logistics);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.toshimoko);
                expect(this.toshimoko.location).toBe('province 3');
                expect(this.whisperer.location).toBe('dynasty deck');
                this.player1.clickCard(this.assault);
                expect(this.toshimoko.location).toBe('province 1');
                expect(this.whisperer.location).toBe('province 3');
            });

            it('should not draw a card if a battlefield is not in play', function() {
                this.player1.moveCard(this.totalWarfare, 'conflict discard pile');
                this.player2.moveCard(this.ambush, 'conflict discard pile');
                let hand = this.player1.hand.length;
                this.player1.clickCard(this.logistics);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.toshimoko);
                expect(this.toshimoko.location).toBe('province 3');
                expect(this.whisperer.location).toBe('dynasty deck');
                this.player1.clickCard(this.assault);
                expect(this.toshimoko.location).toBe('province 1');
                expect(this.whisperer.location).toBe('province 3');
                expect(this.player1.hand.length).toBe(hand - 1); //-1 from Logistics
            });

            it('should draw a card if a battlefield is in play', function() {
                let hand = this.player1.hand.length;
                this.player1.clickCard(this.logistics);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.toshimoko);
                expect(this.toshimoko.location).toBe('province 3');
                expect(this.whisperer.location).toBe('dynasty deck');
                this.player1.clickCard(this.assault);
                expect(this.toshimoko.location).toBe('province 1');
                expect(this.whisperer.location).toBe('province 3');
                expect(this.player1.hand.length).toBe(hand); //-1 from Logistics
            });

            it('chat message - facedown card in province, facedown target, battlefield in play', function() {
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.toshimoko);
                this.player1.clickCard(this.assault);
                expect(this.getChatLogs(10)).toContain('player1 plays Logistics to move a facedown card to province 1 and draw a card');
            });

            it('chat message - faceup card in province, faceup target, battlefield in play', function() {
                this.assault.facedown = false;
                this.toshimoko.facedown = false;
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.toshimoko);
                this.player1.clickCard(this.assault);
                expect(this.getChatLogs(10)).toContain('player1 plays Logistics to move Kakita Toshimoko to Dishonorable Assault and draw a card');
            });

            it('chat message - facedown target, battlefield not in play', function() {
                this.player1.moveCard(this.totalWarfare, 'conflict discard pile');
                this.player2.moveCard(this.ambush, 'conflict discard pile');
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.toshimoko);
                this.player1.clickCard(this.p2);
                expect(this.getChatLogs(10)).toContain('player1 plays Logistics to move a facedown card to province 2');
            });
        });

        describe('Selecting an attachment', function() {
            it('should allow you to choose an unbroken non-stronghold province controlled by the same player (attachment & province controlled by same player)', function() {
                this.player1.clickCard(this.logistics);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.heimin);

                expect(this.player1).not.toBeAbleToSelect(this.assault);
                expect(this.player1).not.toBeAbleToSelect(this.p2);
                expect(this.player1).not.toBeAbleToSelect(this.p3);
                expect(this.player1).not.toBeAbleToSelect(this.p4);
                expect(this.player1).not.toBeAbleToSelect(this.pStronghold_2);

                expect(this.player1).toBeAbleToSelect(this.p1_2);
                expect(this.player1).toBeAbleToSelect(this.p2_2);
                expect(this.player1).toBeAbleToSelect(this.p3_2);
                expect(this.player1).not.toBeAbleToSelect(this.p4_2);
                expect(this.player1).not.toBeAbleToSelect(this.pStronghold_2);
            });

            it('should allow you to choose an unbroken non-stronghold province controlled by the same player (attachment & province not controlled by same player)', function() {
                this.player1.clickCard(this.logistics);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.ambush);

                expect(this.player1).toBeAbleToSelect(this.assault);
                expect(this.player1).not.toBeAbleToSelect(this.p2);
                expect(this.player1).toBeAbleToSelect(this.p3);
                expect(this.player1).not.toBeAbleToSelect(this.p4);
                expect(this.player1).not.toBeAbleToSelect(this.pStronghold_2);

                expect(this.player1).not.toBeAbleToSelect(this.p1_2);
                expect(this.player1).not.toBeAbleToSelect(this.p2_2);
                expect(this.player1).not.toBeAbleToSelect(this.p3_2);
                expect(this.player1).not.toBeAbleToSelect(this.p4_2);
                expect(this.player1).not.toBeAbleToSelect(this.pStronghold_2);
            });

            it('should attach the card to the new province', function() {
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.heimin);
                expect(this.pStronghold_2.attachments.toArray()).toContain(this.heimin);
                expect(this.p2_2.attachments.toArray()).not.toContain(this.heimin);
                this.player1.clickCard(this.p2_2);
                expect(this.pStronghold_2.attachments.toArray()).not.toContain(this.heimin);
                expect(this.p2_2.attachments.toArray()).toContain(this.heimin);
            });

            it('should not draw a card if a battlefield is not in play', function() {
                this.player1.moveCard(this.totalWarfare, 'conflict discard pile');
                this.player2.moveCard(this.ambush, 'conflict discard pile');
                let hand = this.player1.hand.length;
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.heimin);
                this.player1.clickCard(this.p2_2);
                expect(this.player1.hand.length).toBe(hand - 1); //-1 from Logistics
            });

            it('should draw a card if a battlefield is in play', function() {
                let hand = this.player1.hand.length;
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.heimin);
                this.player1.clickCard(this.p2_2);
                expect(this.player1.hand.length).toBe(hand); //-1 from Logistics
            });

            it('chat message - facedown target, battlefield in play', function() {
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.heimin);
                this.player1.clickCard(this.p2_2);
                expect(this.getChatLogs(10)).toContain('player1 plays Logistics to move Educated Heimin to province 2 and draw a card');
            });

            it('chat message - facedown target, battlefield not in play', function() {
                this.player1.moveCard(this.totalWarfare, 'conflict discard pile');
                this.player2.moveCard(this.ambush, 'conflict discard pile');
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.heimin);
                this.player1.clickCard(this.p2_2);
                expect(this.getChatLogs(10)).toContain('player1 plays Logistics to move Educated Heimin to province 2');
            });

            it('chat message - faceup target, battlefield in play', function() {
                this.p2_2.facedown = false;
                this.player1.clickCard(this.logistics);
                this.player1.clickCard(this.heimin);
                this.player1.clickCard(this.p2_2);
                expect(this.getChatLogs(10)).toContain('player1 plays Logistics to move Educated Heimin to Shameful Display and draw a card');
            });
        });
    });
});
