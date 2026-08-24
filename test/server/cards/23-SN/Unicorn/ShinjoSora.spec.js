describe('Shinjo Sora', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'aranat', 'brash-samurai'],
                },
                player2: {
                    inPlay: ['shinjo-sora', 'togashi-mitsu', 'doji-whisperer', 'miya-mystic'],
                    hand: ['assassination', 'way-of-the-scorpion']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.assassination = this.player2.findCardByName('assassination');
            this.scorp = this.player2.findCardByName('way-of-the-scorpion');
            this.sora = this.player2.findCardByName('shinjo-sora');

            const adepts = this.player2.filterCardsByName('adept-of-the-waves');
            adepts.forEach(card => {
                card.facedown = true;
            })

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
            this.brash = this.player1.findCardByName('brash-samurai');
        });

        it('happy path', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.sora],
            });
            this.player2.clickCard(this.sora);
            expect(this.getChatLogs(10)).toContain('player2 uses Shinjo Sora to unleash a swarm of bears!');
            expect(this.game.currentConflict.defenders.length).toBe(5);

            let bear = this.game.currentConflict.defenders[1];
            this.player1.pass();
            this.player2.clickCard(this.scorp);
            this.player2.clickCard(bear);

            expect(bear.getMilitarySkill()).toBe(1);
            expect(bear.getPoliticalSkill()).toBe(0);
            expect(bear.getGlory()).toBe(0);
            expect(bear.getCost()).toBe(null);

            expect(this.getChatLogs(10)).toContain('player2 plays Way of the Scorpion to dishonor Rampaging Bear');
        });

        it('fewer facedown cards', function () {
            const adepts = this.player2.filterCardsByName('adept-of-the-waves');
            adepts.forEach((card, index) => {
                if (index !== 0) {
                    card.facedown = false;
                }
            })

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.sora],
            });
            this.player2.clickCard(this.sora);
            expect(this.getChatLogs(10)).toContain('player2 uses Shinjo Sora to unleash a swarm of bears!');
            expect(this.game.currentConflict.defenders.length).toBe(2);
        });
    });
});
