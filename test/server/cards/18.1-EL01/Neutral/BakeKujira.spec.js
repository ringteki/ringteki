describe('Bake Kujira', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bake-kujira'],
                    hand: ['unleash-the-djinn'],
                    dynastyDiscard: ['funeral-pyre']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'doji-fumiki'],
                    hand: ['way-of-the-scorpion', 'charge', 'forebearer-s-echoes'],
                    dynastyDiscard: ['bake-kujira', 'doji-challenger']
                }
            });

            this.whale = this.player1.findCardByName('bake-kujira');
            this.pyre = this.player1.placeCardInProvince('funeral-pyre', 'province 1');
            this.djinn = this.player1.findCardByName('unleash-the-djinn');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.fumiki = this.player2.findCardByName('doji-fumiki');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.scorp = this.player2.findCardByName('way-of-the-scorpion');
            this.charge = this.player2.findCardByName('charge');
            this.echoes = this.player2.findCardByName('forebearer-s-echoes');

            this.whale2 = this.player2.findCardByName('bake-kujira');
        });

        it('should be immune to events and not able to be put into play', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.kuwanan]
            });

            this.player2.clickCard(this.scorp);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
            expect(this.player2).not.toBeAbleToSelect(this.whale);
            this.player2.clickCard(this.kuwanan);

            let mil = this.whale.getMilitarySkill();
            this.player1.clickCard(this.djinn);
            expect(this.whale.getMilitarySkill()).toBe(mil);

            this.player2.clickCard(this.echoes);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.whale2);

            this.player2.clickPrompt('Cancel');

            this.player2.placeCardInProvince(this.whale2, 'province 1');
            this.player2.placeCardInProvince(this.challenger, 'province 2');

            this.game.checkGameState(true);

            this.player2.clickCard(this.charge);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.whale2);
        });

        it('should eat people and put them on the bottom of the right deck when it leaves - dynasty', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.kuwanan]
            });

            this.player2.pass();

            let mil = this.whale.getMilitarySkill();

            this.player1.clickCard(this.whale);
            expect(this.player1).not.toBeAbleToSelect(this.fumiki);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            this.player1.clickCard(this.kuwanan);
            expect(this.whale.getMilitarySkill()).toBe(mil + 2);
            expect(this.kuwanan.location).toBe(this.whale.uuid);

            expect(this.getChatLogs(5)).toContain('player1 uses Bake-Kujira to swallow Doji Kuwanan whole!');

            this.player2.pass();
            this.player1.clickCard(this.pyre);
            this.player1.clickCard(this.whale);
            expect(this.kuwanan.location).toBe('dynasty deck');
            expect(this.getChatLogs(5)).toContain('Doji Kuwanan is put on the bottom of the deck due to Bake-Kujira leaving play');
        });

        it('should eat people and put them on the bottom of the right deck when it leaves - conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.fumiki]
            });

            this.player2.pass();

            let mil = this.whale.getMilitarySkill();

            this.player1.clickCard(this.whale);
            this.player1.clickCard(this.fumiki);
            expect(this.whale.getMilitarySkill()).toBe(mil + 2);
            expect(this.fumiki.location).toBe(this.whale.uuid);

            expect(this.getChatLogs(5)).toContain('player1 uses Bake-Kujira to swallow Doji Fumiki whole!');

            this.player2.pass();
            this.player1.clickCard(this.pyre);
            this.player1.clickCard(this.whale);
            expect(this.fumiki.location).toBe('conflict deck');
            expect(this.getChatLogs(5)).toContain('Doji Fumiki is put on the bottom of the deck due to Bake-Kujira leaving play');
        });
    });
});
