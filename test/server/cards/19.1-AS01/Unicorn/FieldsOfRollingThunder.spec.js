describe('Fields of Rolling Thunder', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat']
                },
                player2: {
                    inPlay: ['border-rider', 'doji-whisperer'],
                    dynastyDiscard: ['fields-of-rolling-thunder', 'fields-of-rolling-thunder', 'fields-of-rolling-thunder']
                }
            });

            this.diplomat = this.player1.findCardByName('doji-diplomat');

            this.fields = this.player2.filterCardsByName('fields-of-rolling-thunder')[0];
            this.fields2 = this.player2.filterCardsByName('fields-of-rolling-thunder')[1];
            this.fields3 = this.player2.filterCardsByName('fields-of-rolling-thunder')[2];
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.rider = this.player2.findCardByName('border-rider');
            this.player2.moveCard(this.fields, 'province 1');
            this.fields.facedown = false;
        });

        it('if you have a ring should let you choose and honor a unicorn character', function () {
            this.player2.claimRing('water');
            this.player1.pass();
            this.player2.clickCard(this.fields);
            expect(this.player2).toBeAbleToSelect(this.rider);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);

            this.player2.clickCard(this.rider);
            expect(this.rider.isHonored).toBe(true);
            expect(this.getChatLogs(1)).toContain('player2 uses Fields of Rolling Thunder to honor Border Rider');
        });

        it('should not trigger if you don\'t have a ring', function () {
            this.player1.pass();
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.fields);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should lose an extra honor for losing unopposed', function () {
            this.noMoreActions();
            let honor = this.player2.honor;
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [],
                type: 'political',
                ring: 'void'
            });

            this.noMoreActions();
            expect(this.player2.honor).toBe(honor - 2);
            expect(this.getChatLogs(5)).toContain('player2 loses 2 honor for not defending the conflict');
        });

        it('should not lose an extra honor for losing unopposed if facedown', function () {
            this.fields.facedown = true;
            this.noMoreActions();
            let honor = this.player2.honor;
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [],
                type: 'political',
                ring: 'void'
            });

            this.noMoreActions();
            expect(this.player2.honor).toBe(honor - 1);
            expect(this.getChatLogs(5)).toContain('player2 loses 1 honor for not defending the conflict');
        });

        it('honor loss should stack', function () {
            this.player2.moveCard(this.fields2, 'province 2');
            this.player2.moveCard(this.fields3, 'province 3');

            this.fields2.facedown = false;
            this.fields3.facedown = false;
            this.noMoreActions();
            let honor = this.player2.honor;
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [],
                type: 'political',
                ring: 'void'
            });

            this.noMoreActions();
            expect(this.player2.honor).toBe(honor - 4);
            expect(this.getChatLogs(5)).toContain('player2 loses 4 honor for not defending the conflict');
        });
    });
});
