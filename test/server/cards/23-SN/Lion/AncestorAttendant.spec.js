describe('Ancestor Attendant', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ancestor-attendant', 'doji-challenger'],
                    dynastyDeck: ['doji-whisperer', 'kakita-yoshi', 'kakita-toshimoko', 'daidoji-kageyu', 'moto-chagatai', 'favorable-ground',
                        'imperial-storehouse', 'iron-mine', 'a-season-of-war', 'dispatch-to-nowhere'],

                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'doji-diplomat'],
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.diplomat = this.player2.findCardByName('doji-diplomat');

            this.attendant = this.player1.findCardByName('ancestor-attendant');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.player1.reduceDeckToNumber('dynasty deck', 0);

            this.dojiWhisperer = this.player1.moveCard('doji-whisperer', 'dynasty deck');
            this.yoshi = this.player1.moveCard('kakita-yoshi', 'dynasty deck');
            this.toshimoko = this.player1.moveCard('kakita-toshimoko', 'dynasty deck');
            this.kageyu = this.player1.moveCard('daidoji-kageyu', 'dynasty deck');
            this.chagatai = this.player1.moveCard('moto-chagatai', 'dynasty deck');

            this.favorable = this.player1.moveCard('favorable-ground', 'dynasty deck');
            this.storehouse = this.player1.moveCard('imperial-storehouse', 'dynasty deck');
            this.mine = this.player1.moveCard('iron-mine', 'dynasty deck');
            this.season = this.player1.moveCard('a-season-of-war', 'dynasty deck');
            this.dispatch = this.player1.moveCard('dispatch-to-nowhere', 'dynasty deck');
        });

        it('dishonor and discard', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.attendant, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
            });

            this.player2.pass();

            expect(this.player1.dynastyDeck.length).toBe(10);

            this.player1.clickCard(this.attendant);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.attendant);
            expect(this.player1).toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.diplomat);

            this.player1.clickCard(this.mitsu);
            expect(this.mitsu.isDishonored).toBe(true);
            expect(this.player1.dynastyDeck.length).toBe(5);
            expect(this.getChatLogs(5)).toContain('player1 uses Ancestor Attendant to dishonor Togashi Mitsu and discard the top 5 cards of their dynasty deck');
        });

        it('restrict targeting based on deck size', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.attendant, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
            });

            this.player2.pass();

            this.player1.reduceDeckToNumber('dynasty deck', 3);
            expect(this.player1.dynastyDeck.length).toBe(3);

            this.player1.clickCard(this.attendant);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.attendant);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.diplomat);

            this.player1.clickCard(this.diplomat);
            expect(this.diplomat.isDishonored).toBe(true);
            expect(this.player1.dynastyDeck.length).toBe(3);
            expect(this.getChatLogs(5)).toContain('player1 uses Ancestor Attendant to dishonor Doji Diplomat');
        });

        it('needs participation', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
            });

            this.player2.pass();

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.attendant);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
