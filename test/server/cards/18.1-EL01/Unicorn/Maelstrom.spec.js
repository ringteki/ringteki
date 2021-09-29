describe('Maelstrom', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['moto-chagatai', 'border-rider']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-hotaru', 'kakita-yoshi'],
                    provinces: ['maelstrom', 'the-pursuit-of-justice'],
                    hand: ['assassination', 'fine-katana']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.hotaru = this.player2.findCardByName('doji-hotaru');
            this.chagatai = this.player1.findCardByName('moto-chagatai');
            this.rider = this.player1.findCardByName('border-rider');
            this.province = this.player2.findCardByName('maelstrom');
            this.pursuit = this.player2.findCardByName('the-pursuit-of-justice');

            this.assassination = this.player2.findCardByName('assassination');
            this.katana = this.player2.findCardByName('fine-katana');
        });

        it('should let you move a character to the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai],
                defenders: [this.yoshi],
                province: this.province
            });

            this.player2.clickCard(this.province);
            expect(this.player2).not.toBeAbleToSelect(this.chagatai);
            expect(this.player2).toBeAbleToSelect(this.hotaru);
            expect(this.player2).toBeAbleToSelect(this.rider);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);

            expect(this.rider.isParticipating()).toBe(false);
            this.player2.clickCard(this.rider);
            expect(this.rider.isParticipating()).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 uses Maelstrom to move Border Rider into the conflict');
        });

        it('should work at other water provinces', function() {
            this.province.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai],
                defenders: [this.yoshi],
                province: this.pursuit
            });

            this.player2.clickCard(this.province);
            expect(this.player2).not.toBeAbleToSelect(this.chagatai);
            expect(this.player2).toBeAbleToSelect(this.hotaru);
            expect(this.player2).toBeAbleToSelect(this.rider);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);

            expect(this.rider.isParticipating()).toBe(false);
            this.player2.clickCard(this.rider);
            expect(this.rider.isParticipating()).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 uses Maelstrom to move Border Rider into the conflict');
        });
    });
});
