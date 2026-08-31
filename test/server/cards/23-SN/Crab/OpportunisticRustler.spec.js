describe('Opportunistic Rustler', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['opportunistic-rustler'],
                },
                player2: {
                    inPlay: ['brash-samurai', 'diplomat-of-the-steppes', 'courtly-challenger', 'tengu-sensei']
                }
            });

            this.rustler = this.player1.findCardByName('opportunistic-rustler');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.diplomat = this.player2.findCardByName('diplomat-of-the-steppes');
            this.courtly = this.player2.findCardByName('courtly-challenger');
            this.tengu = this.player2.findCardByName('tengu-sensei');

            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');


            this.player2.reduceDeckToNumber('dynasty deck', 0);
            this.player2.moveCard(this.tengu, 'dynasty deck');
            this.player2.moveCard(this.brash, 'dynasty deck');
            this.player2.moveCard(this.courtly, 'dynasty deck');
            this.player2.moveCard(this.diplomat, 'dynasty deck');
        });

        it('non cavalry', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.rustler],
                province: this.sd1
            });

            let mil = this.rustler.getMilitarySkill();
            let pol = this.rustler.getPoliticalSkill();

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rustler);
            this.player1.clickCard(this.rustler);

            expect(this.getChatLogs(5)).toContain('player1 uses Opportunistic Rustler to look at player2\'s dynasty deck');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton(this.brash.name);
            expect(this.player1).toHavePromptButton(this.courtly.name);
            expect(this.player1).not.toHavePromptButton(this.tengu.name);
            expect(this.player1).toHavePromptButton(this.diplomat.name);

            this.player1.clickPrompt(this.courtly.name);

            expect(this.rustler.getMilitarySkill()).toBe(mil + 2);
            expect(this.rustler.getPoliticalSkill()).toBe(pol);
            expect(this.courtly.location).toBe('province 1');
            expect(this.courtly.facedown).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 puts Courtly Challenger faceup into the attacked province and gives Opportunistic Rustler +2military');
            expect(this.getChatLogs(5)).toContain('player2 puts 2 cards on the bottom of their dynasty deck');
            expect(this.player2.player.dynastyDeck.length).toBe(3);
        });

        it('cavalry', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.rustler],
                province: this.sd1
            });

            let mil = this.rustler.getMilitarySkill();
            let pol = this.rustler.getPoliticalSkill();

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rustler);
            this.player1.clickCard(this.rustler);

            expect(this.getChatLogs(5)).toContain('player1 uses Opportunistic Rustler to look at player2\'s dynasty deck');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton(this.brash.name);
            expect(this.player1).toHavePromptButton(this.courtly.name);
            expect(this.player1).not.toHavePromptButton(this.tengu.name);
            expect(this.player1).toHavePromptButton(this.diplomat.name);

            this.player1.clickPrompt(this.diplomat.name);

            expect(this.rustler.getMilitarySkill()).toBe(mil + 3);
            expect(this.rustler.getPoliticalSkill()).toBe(pol);
            expect(this.diplomat.location).toBe('removed from game');

            expect(this.getChatLogs(5)).toContain('player1 removes Diplomat of the Steppes from the game and gives Opportunistic Rustler +3military');
            expect(this.getChatLogs(5)).toContain('player2 puts 2 cards on the bottom of their dynasty deck');
            expect(this.player2.player.dynastyDeck.length).toBe(3);
        });
    });
});
