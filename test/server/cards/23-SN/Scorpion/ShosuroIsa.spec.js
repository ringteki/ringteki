describe('Shosuro Isa', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-isa', 'blackmail-artist'],
                    dynastyDiscard: ['blackmail-artist', 'bayushi-shoju'],
                    conflictDiscard: ['daidoji-saboteur']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'kakita-yoshi'],
                    hand: ['assassination'],
                    dynastyDiscard: ['asahina-diviner']
                }
            });

            this.isa = this.player1.findCardByName('shosuro-isa');
            this.bm1 = this.player1.findCardByName('blackmail-artist', 'play area');
            this.bm2 = this.player1.findCardByName('blackmail-artist', 'dynasty discard pile');
            this.shoju = this.player1.findCardByName('bayushi-shoju');
            this.saboteur = this.player1.findCardByName('daidoji-saboteur');

            this.diviner = this.player2.findCardByName('asahina-diviner');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.assassination = this.player2.findCardByName('assassination');
        });

        it('happy path', function () {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.isa);
            expect(this.player1).toBeAbleToSelect(this.bm2);
            expect(this.player1).toBeAbleToSelect(this.saboteur);
            expect(this.player1).not.toBeAbleToSelect(this.shoju);
            expect(this.player1).not.toBeAbleToSelect(this.diviner);

            this.player1.clickCard(this.saboteur);
            expect(this.getChatLogs(10)).toContain('player1 uses Shosuro Isa to manifest a shadow of Daidōji Saboteur');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.saboteur);

            this.player1.clickCard(this.saboteur);
            this.player1.clickCard(this.kuwanan);

            expect(this.saboteur.getMilitarySkill()).toBe(0);
            expect(this.saboteur.getPoliticalSkill()).toBe(0);
            expect(this.saboteur.hasTrait('shadow')).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isa],
                defenders: [this.kuwanan]
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.saboteur);

            expect(this.saboteur.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Daidōji Saboteur fades into nothingness and is removed from the game due to leaving play');
        });

        it('should not remove same named card', function () {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.isa);
            this.player1.clickCard(this.bm2);
            expect(this.bm2.getMilitarySkill()).toBe(0);
            expect(this.bm2.getPoliticalSkill()).toBe(0);
            expect(this.bm2.hasTrait('shadow')).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isa],
                defenders: [this.kuwanan]
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.bm1);

            expect(this.bm1.location).toBe('dynasty discard pile');
        });
    });
});
