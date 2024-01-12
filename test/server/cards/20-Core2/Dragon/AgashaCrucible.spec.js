describe('Agasha Crucible', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja'],
                    dynastyDiscard: ['agasha-crucible'],
                    hand: ['the-rushing-wave', 'grasp-of-earth-2']
                },
                player2: {
                    dynastyDiscard: ['favorable-ground']
                }
            });

            this.rushingWave = this.player1.findCardByName('the-rushing-wave');
            this.graspOfEarth = this.player1.findCardByName('grasp-of-earth-2');
            this.doomed = this.player1.findCardByName('doomed-shugenja');

            this.agashaFoundry = this.player1.placeCardInProvince('agasha-crucible', 'province 1');

            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
        });

        it('triggers when spell event is played', function () {
            this.player1.clickCard(this.rushingWave);
            expect(this.player1).toHavePrompt('Choose a province');
            this.player1.clickCard(this.shamefulDisplay);
            expect(this.player1).toHavePrompt('Any interrupts to The Rushing Wave being played?');
            expect(this.player1).toBeAbleToSelect(this.agashaFoundry);

            this.player1.clickCard(this.agashaFoundry);
            expect(this.getChatLogs(5)).toContain('player1 uses Agasha Crucible to satisfy all elemental affinities');
            expect(this.getChatLogs(5)).toContain(
                "player1 plays The Rushing Wave to set province 1's strength to 0 until the end of the phase"
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 channels their water affinity to also set the strength of province 2 to 0'
            );
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