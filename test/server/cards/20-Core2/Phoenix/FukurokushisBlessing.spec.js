describe("Fukurokushi's Blessing", function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['fukurokushi-s-blessing']
                },
                player2: {
                    hand: ['feeding-an-army'],
                    provinces: ['midnight-revels', 'public-forum'],
                    inPlay: ['solemn-scholar']
                }
            });

            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.blessing = this.player1.findCardByName('fukurokushi-s-blessing');

            this.feeding = this.player2.findCardByName('feeding-an-army');
            this.revels = this.player2.findCardByName('midnight-revels', 'province 1');
            this.publicForum = this.player2.findCardByName('public-forum', 'province 2');
            this.revels.facedown = false;
            this.publicForum.facedown = false;

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
        });

        it('cancels provinces on attack', function () {
            this.noMoreActions();
            this.player2.clickPrompt('Pass');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                type: 'military',
                province: this.revels
            });

            this.player2.clickCard(this.revels);
            this.player2.clickCard(this.kuwanan);
            expect(this.getChatLogs(10)).toContain('player2 uses Midnight Revels to bow Doji Kuwanan');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.blessing);

            this.player1.clickCard(this.blessing);
            expect(this.getChatLogs(10)).toContain(
                "player1 plays Fukurokushi's Blessing to cancel the effects of Midnight Revels's ability"
            );
            expect(this.kuwanan.bowed).toBe(false);
        });

        it('does not work outside conflicts', function () {
            this.noMoreActions();
            this.player2.clickCard(this.feeding);
            this.player2.clickCard(this.publicForum);
            this.player2.clickCard(this.publicForum);
            expect(this.getChatLogs(10)).toContain(
                'player2 uses Public Forum to add an honor token to Public Forum instead of breaking it'
            );
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.blessing);
            expect(this.publicForum.isBroken).toBe(false);
        });
    });
});
