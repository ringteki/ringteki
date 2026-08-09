describe('Asahina Purifier', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-whisperer'],
                    hand: ['favored-mount', 'backhanded-compliment']
                },
                player2: {
                    inPlay: ['hantei-sotorii', 'doomed-shugenja', 'asahina-purifier', 'unleashed-experiment'],
                    hand: ['assassination']
                }
            });

            this.shameful = this.player2.findCardByName('shameful-display', 'province 1');
            this.shameful2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.mount = this.player1.findCardByName('favored-mount');
            this.bhc = this.player1.findCardByName('backhanded-compliment');

            this.unleashed = this.player2.findCardByName('unleashed-experiment');
            this.purifier = this.player2.findCardByName('asahina-purifier');
            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.shugenja = this.player2.findCardByName('doomed-shugenja');
            this.assassination = this.player2.findCardByName('assassination');

            this.unleashed.fate = 5;
        });

        it('should work when you defend tainted province', function () {
            this.shameful.taint();
            let honor = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash],
                defenders: [this.sotorii, this.shugenja],
                province: this.shameful
            });
            expect(this.getChatLogs(10)).toContain('player2 loses 1 honor in order to declare defending characters');
            expect(this.player2).toBeAbleToSelect(this.purifier);
            this.player2.clickCard(this.purifier);
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.getChatLogs(10)).toContain('player2 uses Asahina Purifier to gain 1 honor rather than having player2 lose 1 honor from a status token');
        });

        it('should NOT work if no honor loss', function () {
            this.shameful.taint();
            let honor = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash],
                defenders: [this.sotorii, this.shugenja],
                province: this.shameful2
            });
            expect(this.player2.honor).toBe(honor);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should work when opponent assigns a tainted character', function () {
            this.brash.taint();
            this.sotorii.taint();
            this.shugenja.taint();
            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash, this.whisperer],
                province: this.shameful
            });
            expect(this.getChatLogs(10)).toContain('player1 pays 1 honor to declare their attackers');

            expect(this.player2).toBeAbleToSelect(this.purifier);
            this.player2.clickCard(this.purifier);
            expect(this.getChatLogs(10)).toContain('player2 uses Asahina Purifier to gain 1 honor rather than having player1 lose 1 honor from a status token');

            expect(this.player1.honor).toBe(honor1);
            expect(this.player2.honor).toBe(honor2 + 1);
        });

        it('should work when you assign a tainted character', function () {
            this.sotorii.taint();
            this.shugenja.taint();
            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash, this.whisperer],
                defenders: [this.sotorii, this.shugenja],
                province: this.shameful
            });
            expect(this.getChatLogs(10)).toContain('player2 pays 2 honor to declare their defenders');

            expect(this.player2).toBeAbleToSelect(this.purifier);
            this.player2.clickCard(this.purifier);
            expect(this.player2).toHavePrompt('Choose an event to respond to');
            expect(this.player2).toHavePromptButton('onModifyHonor');
            this.player2.clickPrompt('onModifyHonor');
            expect(this.getChatLogs(10)).toContain('player2 uses Asahina Purifier to gain 1 honor rather than having player2 lose 1 honor from a status token');
            expect(this.player2.honor).toBe(honor2);
        });

        it('should not work on card costs', function () {
            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash, this.whisperer],
                defenders: [this.sotorii, this.shugenja],
                province: this.shameful
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.shugenja);

            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player2.honor).toBe(honor2 - 3);
        });

        it('should not work on direct honor loss', function () {
            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash, this.whisperer],
                defenders: [this.sotorii, this.shugenja],
                province: this.shameful
            });
            this.player2.pass();
            this.player1.clickCard(this.bhc);
            this.player1.clickPrompt('player2');

            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2.honor).toBe(honor2 - 1);
        });

        it('should not work on ring or unopposed', function () {
            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash],
                defenders: [],
                ring: 'air',
                province: this.shameful
            });
            this.player2.pass();
            this.player1.pass();

            this.player1.clickPrompt('Take 1 honor from opponent');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player2.honor).toBe(honor2 - 2);
        });

        it('should work when a dishonored character leaves play', function () {
            this.shugenja.dishonor();
            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash, this.whisperer],
                defenders: [this.shugenja],
                province: this.shameful
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.shugenja);

            expect(this.player2).toBeAbleToSelect(this.purifier);
            this.player2.clickCard(this.purifier);
            expect(this.getChatLogs(10)).toContain('player2 uses Asahina Purifier to gain 1 honor rather than having player2 lose 1 honor from a status token');
            expect(this.player2.honor).toBe(honor2 - 2);
        });

        it('should not work with other assign costs', function () {
            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash, this.whisperer],
                defenders: [this.unleashed, this.shugenja],
                province: this.shameful
            });
            expect(this.getChatLogs(10)).toContain('player2 pays 2 honor to declare their defenders');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player2.honor).toBe(honor2 - 2);
        });
    });
});
