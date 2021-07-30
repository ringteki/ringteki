describe('Stinger', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['doji-whisperer', 'doji-diplomat', 'brash-samurai', 'kakita-yoshi'],
                    hand: ['in-lady-doji-s-service']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-hotaru-2'],
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.brash = this.player1.findCardByName('brash-samurai');

            this.hotaru = this.player2.findCardByName('doji-hotaru-2');
            this.service = this.player1.findCardByName('in-lady-doji-s-service');

            this.yoshi.honor();
            this.whisperer.honor();
            this.brash.honor();
            this.hotaru.honor();
        });

        it('should react at the start of the fate phase and give all honored courtiers you control Courtesy', function() {
            this.advancePhases('fate');
            let fate = this.player1.fate;
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.service);
            this.player1.clickCard(this.service);
            expect(this.yoshi.hasKeyword('courtesy')).toBe(true);
            expect(this.whisperer.hasKeyword('courtesy')).toBe(true);
            expect(this.diplomat.hasKeyword('courtesy')).toBe(false);
            expect(this.brash.hasKeyword('courtesy')).toBe(false);
            expect(this.hotaru.hasKeyword('courtesy')).toBe(false);

            this.player1.clickPrompt('Done');
            expect(this.player1.fate).toBe(fate + 2);

            expect(this.getChatLogs(10)).toContain('player1 plays In Lady Dōji\'s Service to give Courtesy to Doji Whisperer and Kakita Yoshi');
            expect(this.getChatLogs(10)).toContain('player1 gains a fate due to Doji Whisperer\'s Courtesy');
            expect(this.getChatLogs(10)).toContain('player1 gains a fate due to Kakita Yoshi\'s Courtesy');
        });
    });
});
