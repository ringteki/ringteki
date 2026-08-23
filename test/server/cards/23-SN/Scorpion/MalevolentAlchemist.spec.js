describe('Malevolent Alchemist', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['malevolent-alchemist', 'bayushi-aramoro'],
                    dynastyDiscard: ['malevolent-alchemist'],
                    hand: ['fiery-madness', 'fiery-madness', 'stolen-breath']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-kuwanan', 'kakita-yoshi'],
                    hand: ['fiery-madness']
                }
            });

            this.alc1 = this.player1.findCardByName('malevolent-alchemist', 'play area');
            this.alc2 = this.player1.findCardByName('malevolent-alchemist', 'dynasty discard pile');
            this.aramoro = this.player1.findCardByName('bayushi-aramoro');
            this.madness1 = this.player1.filterCardsByName('fiery-madness')[0];
            this.madness2 = this.player1.filterCardsByName('fiery-madness')[1];
            this.breath = this.player1.findCardByName('stolen-breath');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.madness3 = this.player2.filterCardsByName('fiery-madness')[0];
        });

        it('should give -1/-1 regardless of who owns the attachment', function () {
            this.player1.playAttachment(this.madness1, this.challenger);
            this.player2.playAttachment(this.madness3, this.kuwanan);
            expect(this.kuwanan.getMilitarySkill()).toBe(2) // -2 from madness, -1 from alchemist
            expect(this.kuwanan.getPoliticalSkill()).toBe(1) // -2 from madness, -1 from alchemist
            this.player1.playAttachment(this.breath, this.kuwanan);

            expect(this.challenger.getMilitarySkill()).toBe(0) // -2 from madness, -1 from alchemist
            expect(this.challenger.getPoliticalSkill()).toBe(0) // -2 from madness, -1 from alchemist

            expect(this.kuwanan.getMilitarySkill()).toBe(1) // -2 from madness, -2 from alchemist
            expect(this.kuwanan.getPoliticalSkill()).toBe(0) // -2 from madness, -2 from alchemist

            expect(this.yoshi.getMilitarySkill()).toBe(2) // no poisons
            expect(this.yoshi.getPoliticalSkill()).toBe(6) // no poisons
        });

        it('should not impact my characters', function () {
            this.player1.playAttachment(this.madness1, this.challenger);
            this.player2.playAttachment(this.madness3, this.aramoro);
            this.player1.playAttachment(this.breath, this.kuwanan);

            expect(this.challenger.getMilitarySkill()).toBe(0) // -2 from madness, -1 from alchemist
            expect(this.challenger.getPoliticalSkill()).toBe(0) // -2 from madness, -1 from alchemist

            expect(this.kuwanan.getMilitarySkill()).toBe(4) // -1 from alchemist
            expect(this.kuwanan.getPoliticalSkill()).toBe(3) // -1 from alchemist

            expect(this.aramoro.getMilitarySkill()).toBe(3) // -2 from madness, no alchemist
            expect(this.aramoro.getPoliticalSkill()).toBe(0) // -2 from madness, no alchemist
        });

        it('should stack', function () {
            this.player1.moveCard(this.alc2, 'play area');
            this.challenger.honor();
            this.kuwanan.honor();

            this.player1.playAttachment(this.madness1, this.challenger);
            this.player2.playAttachment(this.madness3, this.kuwanan);
            expect(this.kuwanan.getMilitarySkill()).toBe(4) // -2 from madness, -2 from alchemist
            expect(this.kuwanan.getPoliticalSkill()).toBe(3) // -2 from madness, -2 from alchemist
            this.player1.playAttachment(this.breath, this.kuwanan);

            expect(this.challenger.getMilitarySkill()).toBe(1) // -2 from madness, -2 from alchemist
            expect(this.challenger.getPoliticalSkill()).toBe(1) // -2 from madness, -2 from alchemist

            expect(this.kuwanan.getMilitarySkill()).toBe(2) // -2 from madness, -4 from alchemist
            expect(this.kuwanan.getPoliticalSkill()).toBe(1) // -2 from madness, -4 from alchemist
        });
    });
});
