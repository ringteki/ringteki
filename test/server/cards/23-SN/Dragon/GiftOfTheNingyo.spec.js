describe('Gift of the Ningyo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'aranat'],
                    hand: ['steed-of-the-steppes', 'gift-of-the-ningyo']
                },
                player2: {
                    inPlay: ['brash-samurai', 'ceremonial-robes', 'feral-ningyo'],
                    hand: ['spirit-of-valor']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.gift = this.player1.findCardByName('gift-of-the-ningyo');
            this.mount = this.player1.findCardByName('steed-of-the-steppes');
            this.aranat = this.player1.findCardByName('aranat');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.robe = this.player2.findCardByName('ceremonial-robes');
            this.ningyo = this.player2.findCardByName('feral-ningyo');
            this.spirit = this.player2.findCardByName('spirit-of-valor');

            this.player1.playAttachment(this.gift, this.challenger);
        });

        it('my attachment on opponent character', function () {
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            this.player2.pass();

            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.player1.clickCard(this.mount);
            this.player1.clickCard(this.brash);

            expect(this.challenger.getPoliticalSkill()).toBe(5);
        });

        it('opponent attachment on opponent character', function () {
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.player2.clickCard(this.spirit);
            this.player2.clickCard(this.brash);

            expect(this.challenger.getPoliticalSkill()).toBe(5);
        });

        it('opponent attachment on my character', function () {
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.brash]
            });
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.player2.clickCard(this.spirit);
            this.player2.clickCard(this.challenger);

            expect(this.challenger.getPoliticalSkill()).toBe(4);
        });

        it('opponent spirit', function () {
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.robe]
            });
            expect(this.challenger.getPoliticalSkill()).toBe(5);
        });

        it('opponent creature', function () {
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.ningyo]
            });
            expect(this.challenger.getPoliticalSkill()).toBe(5);
        });

        it('my creature', function () {
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.aranat],
                defenders: [this.brash]
            });
            expect(this.challenger.getPoliticalSkill()).toBe(3);
        });
    });
});
