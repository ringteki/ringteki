describe('Agasha Crucible', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja'],
                    dynastyDiscard: ['agasha-crucible'],
                    hand: ['rejuvenating-vapors', 'grasp-of-earth-2']
                },
                player2: {
                    dynastyDiscard: ['favorable-ground']
                }
            });

            this.suitengu = this.player1.findCardByName('rejuvenating-vapors');
            this.graspOfEarth = this.player1.findCardByName('grasp-of-earth-2');
            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.doomed.bow();

            this.agashaFoundry = this.player1.placeCardInProvince('agasha-crucible', 'province 1');

            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
        });

        it('triggers when spell event is played', function () {
            this.player1.clickCard(this.suitengu);
            this.player1.clickCard(this.doomed);
            expect(this.player1).toHavePrompt('Any interrupts to Rejuvenating Vapors being played?');
            expect(this.player1).toBeAbleToSelect(this.agashaFoundry);

            this.player1.clickCard(this.agashaFoundry);
            expect(this.getChatLogs(5)).toContain('player1 uses Agasha Crucible to satisfy all elemental affinities');
            expect(this.getChatLogs(5)).toContain('player1 plays Rejuvenating Vapors to ready Doomed Shugenja');
            expect(this.player1).toHavePrompt('Discard all cards from a province?');
        });

        it('triggers when spell attachment is played', function () {
            const initFate = this.player1.fate;

            this.player1.clickCard(this.graspOfEarth);
            this.player1.clickCard(this.doomed);
            expect(this.player1).toHavePrompt('Any interrupts?');
            expect(this.player1).toBeAbleToSelect(this.agashaFoundry);

            this.player1.clickCard(this.agashaFoundry);
            expect(this.getChatLogs(5)).toContain('player1 uses Agasha Crucible to satisfy all elemental affinities');
            expect(this.player1.fate).toBe(initFate);
        });
    });
});