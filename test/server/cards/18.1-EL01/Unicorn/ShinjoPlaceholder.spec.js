describe('Flagship of the Unicorn', function() {
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
                    inPlay: ['shinjo-placeholder', 'kakita-yoshi'],
                    provinces: ['manicured-garden', 'pilgrimage']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.shinjo = this.player2.findCardByName('shinjo-placeholder');
            this.chagatai = this.player1.findCardByName('moto-chagatai');
            this.rider = this.player1.findCardByName('border-rider');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.pilgrimage = this.player2.findCardByName('pilgrimage');
        });

        it('should prompt you to choose a character and a facedown province', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai, this.rider],
                defenders: [this.shinjo, this.yoshi],
                province: this.garden
            });

            this.player2.clickCard(this.shinjo);
            expect(this.player2).toHavePrompt('Choose a character to bow');
            expect(this.player2).toBeAbleToSelect(this.chagatai);
            expect(this.player2).not.toBeAbleToSelect(this.shinjo);
            expect(this.player2).toBeAbleToSelect(this.rider);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);

            this.player2.clickCard(this.rider);
            expect(this.player2).toHavePrompt('Choose a province to reveal');
            expect(this.player2).toBeAbleToSelect(this.pilgrimage);
            expect(this.player2).not.toBeAbleToSelect(this.garden);

            this.player2.clickCard(this.pilgrimage);
            expect(this.rider.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 uses Shinjo Placeholder to reveal Pilgrimage and bow Border Rider');
        });

        it('should prompt you to choose a character and a facedown province - no bow', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai, this.rider],
                defenders: [this.shinjo, this.yoshi],
                province: this.garden
            });

            this.player2.clickCard(this.shinjo);
            this.player2.clickCard(this.chagatai);
            this.player2.clickCard(this.pilgrimage);
            expect(this.chagatai.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 uses Shinjo Placeholder to reveal Pilgrimage and fail to bow Moto Chagatai');
        });
    });
});
