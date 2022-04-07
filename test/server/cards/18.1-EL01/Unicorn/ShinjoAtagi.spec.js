describe('Shinjo Atagi', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['moto-chagatai', 'border-rider', 'doji-whisperer']
                },
                player2: {
                    honor: 10,
                    inPlay: ['shinjo-atagi', 'kakita-yoshi'],
                    provinces: ['manicured-garden', 'pilgrimage']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.shinjo = this.player2.findCardByName('shinjo-atagi');
            this.chagatai = this.player1.findCardByName('moto-chagatai');
            this.rider = this.player1.findCardByName('border-rider');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.pilgrimage = this.player2.findCardByName('pilgrimage');
            this.sd3 = this.player2.findCardByName('shameful-display', 'province 3');
            this.sd4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.sd5 = this.player2.findCardByName('shameful-display', 'stronghold province');
        });

        it('should set a participating characters skill to the province strength', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai, this.rider],
                defenders: [this.shinjo, this.yoshi],
                province: this.garden
            });

            this.player2.clickCard(this.shinjo);
            expect(this.player2).toBeAbleToSelect(this.shinjo);
            expect(this.player2).toBeAbleToSelect(this.chagatai);
            expect(this.player2).toBeAbleToSelect(this.rider);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            this.player2.clickCard(this.rider);
            expect(this.rider.getMilitarySkill()).toBe(4);
            expect(this.rider.getPoliticalSkill()).toBe(4);
            expect(this.getChatLogs(5)).toContain('player2 uses Shinjo Atagi to set the skills of Border Rider to the strength of an attacked province');
            expect(this.getChatLogs(5)).toContain('Shinjo Atagi sets the skills of Border Rider to 4military/4political');
        });
    });
});
