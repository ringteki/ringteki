describe('A Poisoned Banquet', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-shadows', 'heir-of-the-serpent'],
                    hand: ['fiery-madness', 'fiery-madness', 'a-poisoned-banquet']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-kuwanan', 'kakita-yoshi'],
                    hand: ['fiery-madness']
                }
            });

            this.shadows = this.player1.findCardByName('adept-of-shadows');
            this.serpent = this.player1.findCardByName('heir-of-the-serpent');
            this.madness1 = this.player1.filterCardsByName('fiery-madness')[0];
            this.madness2 = this.player1.filterCardsByName('fiery-madness')[1];
            this.banquet = this.player1.findCardByName('a-poisoned-banquet');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.madness3 = this.player2.filterCardsByName('fiery-madness')[0];

            this.shadows.fate = 1;
            this.challenger.fate = 2;
            this.yoshi.fate = 0;
        });

        it('happy path', function () {
            this.player1.playAttachment(this.madness1, this.challenger);
            this.player2.playAttachment(this.madness3, this.shadows);
            this.player1.playAttachment(this.madness2, this.yoshi);

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();

            this.player2.clickPrompt('military');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.banquet);

            this.player1.clickCard(this.banquet);
            expect(this.challenger.fate).toBe(1);
            expect(this.shadows.fate).toBe(0);

            expect(this.challenger.location).toBe('play area');
            expect(this.shadows.location).toBe('play area');
            expect(this.yoshi.location).toBe('dynasty discard pile');

            expect(this.getChatLogs(5)).toContain('player1 plays A Poisoned Banquet to injure Adept of Shadows, Doji Challenger and Kakita Yoshi');
        });

        it('no poisons shouldn\'t react', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();

            this.player2.clickPrompt('military');

            expect(this.player1).toHavePrompt('Fate Phase');
        });
    });
});
