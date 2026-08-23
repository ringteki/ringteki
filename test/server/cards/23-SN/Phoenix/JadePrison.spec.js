describe('Jade Prison', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: ['shizuka-toshi'],
                    inPlay: ['resourceful-maho-tsukai', 'isawa-tadaka-2'],
                    provinces: ['magistrate-station'],
                    hand: ['against-the-waves']
                },
                player2: {
                    inPlay: ['asahina-artisan'],
                    dynastyDiscard: ['miya-mystic'],
                    hand: ['jade-prison', 'against-the-waves']
                }
            });
            this.tsukai = this.player1.findCardByName('resourceful-maho-tsukai');
            this.tadaka = this.player1.findCardByName('isawa-tadaka-2');
            this.station = this.player1.findCardByName('magistrate-station');
            this.atw = this.player1.findCardByName('against-the-waves');

            this.artisan = this.player2.findCardByName('asahina-artisan');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.prison = this.player2.findCardByName('jade-prison');
            this.atw2 = this.player2.findCardByName('against-the-waves');

            this.tsukai.bow();
            this.tadaka.bow();
            this.artisan.bow();
            this.game.checkGameState(true);
        });

        it('corrupt character and costs 1 with no affinity', function () {
            let fate = this.player2.fate;

            expect(this.tsukai.bowed).toBe(true);
            this.player1.clickCard(this.atw);
            this.player1.clickCard(this.tsukai);
            expect(this.tsukai.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.prison);
            this.player2.clickCard(this.prison);

            expect(this.tsukai.bowed).toBe(true);
            expect(this.player2.fate).toBe(fate - 1);
            expect(this.getChatLogs(10)).toContain('player2 plays Jade Prison to bow Resourceful Mahō-Tsukai');
        });

        it('uncorrupt and untainted character', function () {
            expect(this.tadaka.bowed).toBe(true);
            this.player1.clickCard(this.atw);
            this.player1.clickCard(this.tadaka);
            expect(this.tadaka.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('tainted character', function () {
            this.tadaka.taint();
            expect(this.tadaka.bowed).toBe(true);
            this.player1.clickCard(this.atw);
            this.player1.clickCard(this.tadaka);
            expect(this.tadaka.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.prison);
            this.player2.clickCard(this.prison);

            expect(this.tadaka.bowed).toBe(true);
            expect(this.getChatLogs(10)).toContain('player2 plays Jade Prison to bow Isawa Tadaka');
        });

        it('affinity', function () {
            let fate = this.player2.fate;
            this.player2.moveCard(this.mystic, 'play area');

            expect(this.tsukai.bowed).toBe(true);
            this.player1.clickCard(this.atw);
            this.player1.clickCard(this.tsukai);
            expect(this.tsukai.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.prison);
            this.player2.clickCard(this.prison);

            expect(this.tsukai.bowed).toBe(true);
            expect(this.player2.fate).toBe(fate);
            expect(this.getChatLogs(10)).toContain('player2 plays Jade Prison to bow Resourceful Mahō-Tsukai');
        });

        it('no shugenja', function () {
            this.player2.moveCard(this.artisan, 'dynasty discard pile');
            expect(this.tsukai.bowed).toBe(true);
            this.player1.clickCard(this.atw);
            this.player1.clickCard(this.tsukai);
            expect(this.tsukai.bowed).toBe(false);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('my own character', function () {
            this.artisan.taint();
            this.player1.pass();
            expect(this.artisan.bowed).toBe(true);
            this.player2.clickCard(this.atw2);
            this.player2.clickCard(this.artisan);
            expect(this.artisan.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
