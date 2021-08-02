describe('Yogo Tadashi', function() {
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
                    inPlay: ['yogo-tadashi', 'kakita-yoshi'],
                    hand: ['fiery-madness', 'tainted-koku', 'softskin']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.tadashi = this.player2.findCardByName('yogo-tadashi');
            this.chagatai = this.player1.findCardByName('moto-chagatai');
            this.rider = this.player1.findCardByName('border-rider');
            this.madness = this.player2.findCardByName('fiery-madness');
            this.koku = this.player2.findCardByName('tainted-koku');
            this.softskin = this.player2.findCardByName('softskin');
        });

        it('should react to a posion being played and prompt you to choose a participating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai],
                defenders: [this.tadashi, this.yoshi]
            });
            this.player2.playAttachment(this.madness, this.yoshi);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.tadashi);
            this.player2.clickCard(this.tadashi);
            expect(this.player2).toBeAbleToSelect(this.chagatai);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            expect(this.player2).not.toBeAbleToSelect(this.rider);
            expect(this.player2).toBeAbleToSelect(this.tadashi);
        });

        it('should give a chosen character -1/-1, give itself +1/+1 unlimited times', function() {
            let cMil = this.chagatai.getMilitarySkill();
            let cPol = this.chagatai.getPoliticalSkill();

            let yMil = this.tadashi.getMilitarySkill();
            let yPol = this.tadashi.getPoliticalSkill();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.chagatai],
                defenders: [this.tadashi, this.yoshi]
            });
            this.player2.playAttachment(this.madness, this.yoshi);
            this.player2.clickCard(this.tadashi);
            this.player2.clickCard(this.chagatai);
            expect(this.chagatai.getMilitarySkill()).toBe(cMil - 1);
            expect(this.chagatai.getPoliticalSkill()).toBe(cPol - 1);
            expect(this.tadashi.getMilitarySkill()).toBe(yMil + 1);
            expect(this.tadashi.getPoliticalSkill()).toBe(yPol + 1);

            expect(this.getChatLogs(5)).toContain('player2 uses Yogo Tadashi to give Moto Chagatai -1military/-1political and Yogo Tadashi +1military/+1political');
            this.player1.pass();
            this.player2.playAttachment(this.koku, this.yoshi);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.tadashi);
            this.player2.clickCard(this.chagatai);
            expect(this.chagatai.getMilitarySkill()).toBe(cMil - 2);
            expect(this.chagatai.getPoliticalSkill()).toBe(cPol - 2);
            expect(this.tadashi.getMilitarySkill()).toBe(yMil + 2);
            expect(this.tadashi.getPoliticalSkill()).toBe(yPol + 2);

            this.player1.pass();
            this.player2.playAttachment(this.softskin, this.chagatai);
            expect(this.player2).toHavePrompt('Triggered Abilities');
        });
    });
});
