describe('Young Ise Zumi', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves', 'solemn-scholar', 'miya-mystic', 'young-ise-zumi']
                },
                player2: {
                    inPlay: ['miya-mystic', 'kakita-toshimoko']
                }
            });

            this.zumi = this.player1.findCardByName('young-ise-zumi');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.solemn = this.player1.findCardByName('solemn-scholar');
            this.mystic = this.player1.findCardByName('miya-mystic');

            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
        });

        it('triggers when you win a conflict', function () {
            let fate = this.player1.fate;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.zumi],
                defenders: [],
                ring: 'air'
            });

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.zumi);
            this.player1.clickCard(this.zumi);

            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('earth');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).toBeAbleToSelectRing('water');
            expect(this.player1).toBeAbleToSelectRing('void');

            this.player1.clickRing('fire');
            expect(this.player1.fate).toBe(fate - 1);
            expect(this.game.rings.fire.fate).toBe(1);

            expect(this.getChatLogs(5)).toContain('player1 uses Young Ise Zumi, placing 1 fate on the Fire Ring to prevent conflicts from being declared with the Fire Ring');
        });

        it('does not trigger when you lose a conflict', function () {
            let fate = this.player1.fate;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.zumi],
                defenders: [this.toshimoko],
                ring: 'air'
            });

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('does not trigger when another character wins the conflict', function () {
            let fate = this.player1.fate;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.solemn],
                defenders: [],
                ring: 'air'
            });

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Air Ring');
        });

        it('if triggered, protects a ring', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.zumi],
                defenders: [],
                ring: 'air'
            });

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.zumi);
            this.player1.clickCard(this.zumi);
            this.player1.clickRing('fire');

            this.player1.clickPrompt('Don\'t resolve');

            this.noMoreActions();
            expect(this.player2).toHavePrompt('Initiate Conflict');

            this.player2.clickRing('fire');
            expect(this.game.rings.fire.contested).toBe(false);

            this.player2.clickRing('water');
            expect(this.game.rings.water.contested).toBe(true);

            this.player2.clickPrompt('Pass Conflict');
            this.player2.clickPrompt('Yes');

            this.noMoreActions();

            expect(this.player1).toHavePrompt('Initiate Conflict');

            this.player1.clickRing('fire');
            expect(this.game.rings.fire.contested).toBe(false);

            this.player1.clickRing('water');
            expect(this.game.rings.water.contested).toBe(true);
        });
    });
});
