describe('Daidoji Ienori', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['moto-chagatai']
                },
                player2: {
                    honor: 10,
                    inPlay: ['daidoji-ienori', 'kakita-yoshi']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.ienori = this.player2.findCardByName('daidoji-ienori');
            this.chagatai = this.player1.findCardByName('moto-chagatai');

            this.yoshi.honor();
            this.ienori.dishonor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai],
                defenders: [this.ienori, this.yoshi]
            });
        });

        it('should react to a duel initiating', function() {
            this.player2.clickCard(this.ienori);
            expect(this.player2).toBeAbleToSelect(this.chagatai);
            expect(this.player2).toBeAbleToSelect(this.ienori);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            this.player2.clickCard(this.chagatai);
            expect(this.player2).not.toBeAbleToSelect(this.chagatai);
            expect(this.player2).not.toBeAbleToSelect(this.ienori);
            expect(this.player2).toBeAbleToSelect(this.yoshi);

            this.player2.clickCard(this.yoshi);
            expect(this.chagatai.getMilitarySkill()).toBe(1);
            expect(this.chagatai.getPoliticalSkill()).toBe(1);

            expect(this.yoshi.getMilitarySkill()).toBe(2);
            expect(this.yoshi.getPoliticalSkill()).toBe(6);

            expect(this.getChatLogs(5)).toContain('player2 uses Daidoji Ienori, discarding a status token to set the skills of Moto Chagatai to 1military/1political');
        });
    });
});
