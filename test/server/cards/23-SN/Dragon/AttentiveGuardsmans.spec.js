describe('Attentive Guardsman', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['attentive-guardsman', 'togashi-yokuni', 'doji-challenger'],
                    dynastyDeck: ['favorable-ground']
                },
                player2: {
                    inPlay: ['attentive-guardsman'],
                    dynastyDeck: ['favorable-ground']
                }
            });
            this.ground = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.ground.facedown = false;

            this.ground2 = this.player2.placeCardInProvince('favorable-ground', 'province 1');
            this.ground2.facedown = false;

            this.guard1 = this.player1.findCardByName('attentive-guardsman');
            this.guard2 = this.player2.findCardByName('attentive-guardsman');

            this.yokuni = this.player1.findCardByName('togashi-yokuni');
            this.challenger = this.player1.findCardByName('doji-challenger');
        });

        it('picking during declaration', function () {
            this.noMoreActions();

            expect(this.player1).toHavePrompt('Initiate Conflict');

            this.player1.clickCard(this.challenger);
            expect(this.challenger.inConflict).toBe(true);
            this.player1.clickCard(this.guard1);
            expect(this.guard1.inConflict).toBe(false);
            this.player1.clickCard(this.yokuni);
            expect(this.yokuni.inConflict).toBe(true);
            this.player1.clickCard(this.guard1);
            expect(this.guard1.inConflict).toBe(true);

            this.player1.clickCard(this.yokuni);
            expect(this.yokuni.inConflict).toBe(false);
            this.player1.clickCard(this.guard1);
            expect(this.guard1.inConflict).toBe(false);
        });

        it('blocking movement', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.guard2]
            });
            expect(this.guard2.isParticipating()).toBe(true);
            this.player2.pass();

            this.player1.clickCard(this.ground);
            expect(this.player1).toBeAbleToSelect(this.yokuni);
            expect(this.player1).not.toBeAbleToSelect(this.guard1);
        });

        it('allowing movement and +1/+1', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yokuni],
                defenders: []
            });

            let mil = this.guard2.getMilitarySkill();
            let pol = this.guard2.getPoliticalSkill();

            this.player2.clickCard(this.ground2);
            this.player2.clickCard(this.guard2);
            expect(this.guard2.isParticipating()).toBe(true);
            expect(this.guard2.getMilitarySkill()).toBe(mil + 1);
            expect(this.guard2.getPoliticalSkill()).toBe(pol + 1);

            let mil1 = this.guard1.getMilitarySkill();
            let pol1 = this.guard1.getPoliticalSkill();

            this.player1.clickCard(this.ground);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.guard1);
            this.player1.clickCard(this.guard1);

            expect(this.guard1.isParticipating()).toBe(true);
            expect(this.guard1.getMilitarySkill()).toBe(mil1);
            expect(this.guard1.getPoliticalSkill()).toBe(pol1);

        });
    });
});
