describe('Shore of the Ashen Flames', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka', 'matsu-berserker']
                },
                player2: {
                    provinces: ['shore-of-the-ashen-flames', 'entrenched-position']
                }
            });

            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

            this.shoreOfTheAshenFlames = this.player2.findCardByName('shore-of-the-ashen-flames', 'province 1');
            this.entrenched = this.player2.findCardByName('entrenched-position');
        });

        it('should not trigger if the province is broken', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military',
                ring: 'earth'
            });

            this.player2.pass();
            this.player1.pass();
            expect(this.player1).toHavePrompt('Do you wish to discard Adept of the Waves?');
        });

        it('should trigger if the province is not broken', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military',
                ring: 'earth'
            });

            this.player2.pass();
            this.player1.pass();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.shoreOfTheAshenFlames);
        });

        it('should reslove the conflict ring', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military',
                ring: 'earth'
            });

            this.player2.pass();
            this.player1.pass();
            this.player2.clickCard(this.shoreOfTheAshenFlames);

            expect(this.getChatLogs(3)).toContain('player2 uses Shore of the Ashen Flames to resolve Earth Ring');
        });

        it('should not trigger at another province', function() {
            this.shoreOfTheAshenFlames.facedown = false;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [],
                province: this.entrenched,
                type: 'military',
                ring: 'earth'
            });

            this.player2.pass();
            this.player1.pass();
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});
