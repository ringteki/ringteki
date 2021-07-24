describe('Ramshackle Facade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-hotaru', 'togashi-initiate'],
                    hand: ['ramshackle-facade'],
                    dynastyDiscard: ['northern-curtain-wall', 'seventh-tower', 'funeral-pyre']
                },
                player2: {
                    inPlay: ['doji-challenger', 'kakita-toshimoko', 'doji-whisperer']
                }
            });

            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.pyre = this.player1.findCardByName('funeral-pyre');
            this.wall = this.player1.findCardByName('northern-curtain-wall');
            this.tower = this.player1.findCardByName('seventh-tower');

            this.facade = this.player1.findCardByName('ramshackle-facade');

            this.player1.placeCardInProvince(this.tower, 'province 1');
            this.player1.placeCardInProvince(this.pyre, 'province 2');
            this.player1.placeCardInProvince(this.wall, 'province 3');
            this.tower.facedown = false;
            this.pyre.facedown = false;
            this.wall.facedown = false;
        });

        it('should prompt you to select a character with mil <= to the # of provinces you control and bow it', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.challenger, this.toshimoko, this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.facade);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.initiate);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.toshimoko);

            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays Ramshackle Facade to bow Doji Whisperer');
        });
    });
});
