describe('Shinjo Sora', function () {
    integration(function () {
        describe('releasing the hounds', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger', 'aranat', 'brash-samurai']
                    },
                    player2: {
                        inPlay: ['shinjo-sora', 'togashi-mitsu', 'doji-whisperer', 'miya-mystic'],
                        dynastyDiscard: ['hida-kisada', 'doji-kuwanan', 'imperial-storehouse', 'bayushi-liar'],
                        hand: ['assassination', 'way-of-the-scorpion']
                    }
                });
                this.mitsu = this.player2.findCardByName('togashi-mitsu');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.mystic = this.player2.findCardByName('miya-mystic');
                this.assassination = this.player2.findCardByName('assassination');
                this.scorp = this.player2.findCardByName('way-of-the-scorpion');
                this.sora = this.player2.findCardByName('shinjo-sora');

                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.liar = this.player2.findCardByName('bayushi-liar');
                this.storehouse = this.player2.findCardByName('imperial-storehouse');

                this.player2.moveCard(this.kuwanan, 'province 1');
                this.player2.moveCard(this.storehouse, 'province 2');
                this.player2.moveCard(this.kisada, 'province 3');
                this.player2.moveCard(this.liar, 'province 4');

                this.kuwanan.facedown = true;
                this.kisada.facedown = true;
                this.storehouse.facedown = true;
                this.liar.facedown = true;

                this.challenger = this.player1.findCardByName('doji-challenger');
                this.aranat = this.player1.findCardByName('aranat');
                this.brash = this.player1.findCardByName('brash-samurai');
            });

            it('happy path', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.sora]
                });
                this.player2.clickCard(this.sora);
                expect(this.getChatLogs(10)).toContain('player2 uses Shinjo Sora to release the hounds!');

                let houndsValid = this.game.currentConflict.defenders.length >= 5;
                expect(houndsValid).toBe(true);

                let hound = this.game.currentConflict.defenders[1];
                this.player1.pass();
                this.player2.clickCard(this.scorp);
                this.player2.clickCard(hound);

                expect(hound.getMilitarySkill()).toBe(1);
                expect(hound.getPoliticalSkill()).toBe(0);
                expect(hound.getGlory()).toBe(0);
                expect(hound.getCost()).toBe(null);

                expect(this.kisada.location).toBe('removed from game');
                expect(this.kisada.facedown).toBe(true);

                expect(this.storehouse.location).toBe('removed from game');
                expect(this.storehouse.facedown).toBe(true);

                expect(this.liar.location).toBe('removed from game');
                expect(this.liar.facedown).toBe(true);

                expect(this.kuwanan.location).toBe('removed from game');
                expect(this.kuwanan.facedown).toBe(true);

                expect(this.getChatLogs(10)).toContain('player2 plays Way of the Scorpion to dishonor Unleashed Hound');

                this.noMoreActions();
                expect(hound.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(10)).toContain('Unleashed Hound grows tired and decides to have a nap');

                expect(this.kisada.location).toBe('dynasty discard pile');
                expect(this.storehouse.location).toBe('dynasty discard pile');
                expect(this.liar.location).toBe('dynasty discard pile');
                expect(this.kuwanan.location).toBe('dynasty discard pile');
            });

            it('fewer facedown cards', function () {
                this.kuwanan.facedown = false;
                this.storehouse.facedown = false;
                this.kisada.facedown = false;
                this.liar.facedown = true;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.sora]
                });
                this.player2.clickCard(this.sora);
                expect(this.getChatLogs(10)).toContain('player2 uses Shinjo Sora to release the hounds!');

                expect(this.kuwanan.location).toBe('province 1');
                expect(this.storehouse.location).toBe('province 2');
                expect(this.kisada.location).toBe('province 3');
                expect(this.liar.location).toBe('removed from game');

                let houndsValid = this.game.currentConflict.defenders.length >= 2;
                expect(houndsValid).toBe(true);
            });
        });

        describe('Utaku Infantry', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger']
                    },
                    player2: {
                        inPlay: ['shinjo-sora', 'utaku-infantry'],
                        dynastyDiscard: ['hida-kisada', 'doji-kuwanan', 'imperial-storehouse', 'bayushi-liar']
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.sora = this.player2.findCardByName('shinjo-sora');
                this.infantry = this.player2.findCardByName('utaku-infantry');

                this.kisada = this.player2.findCardByName('hida-kisada');
                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
                this.storehouse = this.player2.findCardByName('imperial-storehouse');
                this.liar = this.player2.findCardByName('bayushi-liar');

                // placeCardInProvince (not moveCard) so each province holds exactly this one
                // card: the hound count has to be exact, and sourcing the inPlay cards can
                // otherwise leave extra facedown cards behind.
                this.player2.placeCardInProvince(this.kisada, 'province 1');
                this.player2.placeCardInProvince(this.kuwanan, 'province 2');
                this.player2.placeCardInProvince(this.storehouse, 'province 3');
                this.player2.placeCardInProvince(this.liar, 'province 4');
            });

            it('counts the hounds as participating Unicorn characters', function () {
                [this.kisada, this.kuwanan, this.storehouse, this.liar].forEach((card) => (card.facedown = true));

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.sora, this.infantry]
                });

                // Sora and the Infantry itself.
                expect(this.infantry.getMilitarySkill()).toBe(2);
                expect(this.infantry.getPoliticalSkill()).toBe(2);

                this.player2.clickCard(this.sora);
                expect(this.getChatLogs(10)).toContain('player2 uses Shinjo Sora to release the hounds!');

                const hounds = this.game.currentConflict.defenders.filter((card) => card.name === 'Unleashed Hound');
                expect(hounds.length).toBe(4);
                hounds.forEach((hound) => {
                    expect(hound.isFaction('unicorn')).toBe(true);
                    expect(hound.isParticipating()).toBe(true);
                });

                // Sora, the Infantry, and four hounds.
                expect(this.infantry.getMilitarySkill()).toBe(6);
                expect(this.infantry.getPoliticalSkill()).toBe(6);
            });

            it('drops back down when the hounds leave play', function () {
                [this.kisada, this.kuwanan, this.storehouse, this.liar].forEach((card) => (card.facedown = true));

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.sora, this.infantry]
                });
                this.player2.clickCard(this.sora);
                expect(this.infantry.getMilitarySkill()).toBe(6);

                this.noMoreActions();
                expect(this.game.currentConflict).toBeFalsy();
                expect(this.infantry.getMilitarySkill()).toBe(0);
            });

            it('does not count hounds that were never created', function () {
                [this.kisada, this.kuwanan, this.storehouse, this.liar].forEach((card) => (card.facedown = false));

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.sora, this.infantry]
                });
                this.player2.clickCard(this.sora);

                expect(this.infantry.getMilitarySkill()).toBe(2);
                expect(this.infantry.getPoliticalSkill()).toBe(2);
            });
        });
    });
});
