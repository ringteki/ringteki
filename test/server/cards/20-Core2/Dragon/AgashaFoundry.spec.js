describe('Agasha Foundry', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja'],
                    dynastyDiscard: ['agasha-foundry'],
                    hand: ['breath-of-suitengu', 'portable-bastion']
                },
                player2: {
                    dynastyDiscard: ['favorable-ground']
                }
            });

            this.suitengu = this.player1.findCardByName('breath-of-suitengu');
            this.bastion = this.player1.findCardByName('portable-bastion');
            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.doomed.bow();

            this.agashaFoundry = this.player1.placeCardInProvince('agasha-foundry', 'province 1');

            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
        });

        it('triggers when spell event is played', function () {
            this.player1.clickCard(this.suitengu);
            this.player1.clickCard(this.doomed);
            expect(this.player1).toHavePrompt('Any interrupts to Breath of Suitengu being played?');
            expect(this.player1).toBeAbleToSelect(this.agashaFoundry);

            this.player1.clickCard(this.agashaFoundry);
            expect(this.getChatLogs(5)).toContain('player1 uses Agasha Foundry to satisfy all elemental affinities');
            expect(this.getChatLogs(5)).toContain('player1 plays Breath of Suitengu to ready Doomed Shugenja');
            expect(this.player1).toHavePrompt('Discard all cards from a province?');
        });

        it('triggers when spell attachment is played', function () {
            const initFate = this.player1.fate;

            this.player1.clickCard(this.bastion);
            this.player1.clickCard(this.doomed);
            expect(this.player1).toHavePrompt('Any interrupts?');
            expect(this.player1).toBeAbleToSelect(this.agashaFoundry);

            this.player1.clickCard(this.agashaFoundry);
            expect(this.getChatLogs(5)).toContain('player1 uses Agasha Foundry to satisfy all elemental affinities');
            expect(this.player1.fate).toBe(initFate);
        });
    });
});
