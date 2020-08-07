describe('Soshi Illusionst', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['soshi-illusionist', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['miya-mystic', 'shiba-peacemaker']
                }
            });
            this.miyaMystic = this.player2.findCardByName('miya-mystic');
            this.shibaPeacemaker = this.player2.findCardByName('shiba-peacemaker');
            this.illusionist = this.player1.findCardByName('soshi-illusionist');
            this.whisperer = this.player1.findCardByName('doji-whisperer');

            this.whisperer.honor();
            this.shibaPeacemaker.dishonor();
        });

        it('Should allow targeting a character with a status token', function() {
            this.player1.clickCard(this.illusionist);
            expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.illusionist);
            expect(this.player1).toBeAbleToSelect(this.shibaPeacemaker);
        });

        it('Should cost a fate and discard the token', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.illusionist);
            this.player1.clickCard(this.shibaPeacemaker);
            expect(this.shibaPeacemaker.isHonored).toBe(false);
            expect(this.shibaPeacemaker.isDishonored).toBe(false);
            expect(this.player1.fate).toBe(fate - 1);

            expect(this.getChatLogs(1)).toContain('player1 uses Soshi Illusionist, spending 1 fate to discard Shiba Peacemaker\'s status token');
        });
    });
});
