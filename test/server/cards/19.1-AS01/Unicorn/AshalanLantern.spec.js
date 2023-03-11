describe('Ashalan Lantern', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 3,
                    inPlay: ['battle-maiden-recruit', 'saadiyah-al-mozedu'],
                    hand: ['ashalan-lantern']
                },
                player2: {
                    inPlay: ['brash-samurai', 'kakita-asami', 'courtly-challenger', 'tengu-sensei']
                }
            });

            this.recruit = this.player1.findCardByName('battle-maiden-recruit');
            this.saadiyah = this.player1.findCardByName('saadiyah-al-mozedu');
            this.lantern = this.player1.findCardByName('ashalan-lantern');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.courtly = this.player2.findCardByName('courtly-challenger');
            this.tengu = this.player2.findCardByName('tengu-sensei');

            this.player2.reduceDeckToNumber('dynasty deck', 0);
        });

        it('searches the top 3 dynasty cards for a character and play it, then discard attachment', function () {
            this.player2.moveCard(this.brash, 'dynasty deck');
            this.player2.moveCard(this.courtly, 'dynasty deck');
            this.player2.moveCard(this.tengu, 'dynasty deck');

            this.player1.clickCard(this.lantern);
            this.player1.clickCard(this.recruit);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.recruit],
                defenders: []
            });

            this.player2.pass();

            let p1InitialFate = this.player1.fate;
            this.player1.clickCard(this.lantern);

            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt('Good Omen', 'card-name');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton(this.brash.name);
            expect(this.player1).toHavePromptButton(this.courtly.name);
            expect(this.player1).toHavePromptButton(this.tengu.name);

            this.player1.clickPrompt(this.brash.name);
            expect(this.player1).toHavePrompt('Choose additional fate');

            this.player1.clickPrompt('0');
            expect(this.brash.location).toBe('play area');
            expect(this.game.currentConflict.attackers).toContain(this.brash);
            expect(this.game.currentConflict.defenders).not.toContain(this.brash);
            expect(this.player1.fate).toBe(p1InitialFate - 2);
            expect(this.getChatLogs(10)).toContain(
                'player1 uses Ashalan Lantern, naming Good Omen to look for a character on the top of player2\'s dynasty deck'
            );
            expect(this.getChatLogs(10)).toContain(
                'Battle Maiden Recruit is not Foreign, their Ashalan Lantern is discarded'
            );
            expect(this.lantern.location).toBe('conflict discard pile');
        });

        it('searches the top 3 dynasty cards for a character and play it, then keep attachment if attached character is Foreign', function () {
            this.player2.moveCard(this.brash, 'dynasty deck');
            this.player2.moveCard(this.courtly, 'dynasty deck');
            this.player2.moveCard(this.tengu, 'dynasty deck');

            this.player1.clickCard(this.lantern);
            this.player1.clickCard(this.saadiyah);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.saadiyah],
                defenders: []
            });

            this.player2.pass();

            let p1InitialFate = this.player1.fate;
            this.player1.clickCard(this.lantern);

            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt('Good Omen', 'card-name');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton(this.brash.name);
            expect(this.player1).toHavePromptButton(this.courtly.name);
            expect(this.player1).toHavePromptButton(this.tengu.name);

            this.player1.clickPrompt(this.brash.name);
            expect(this.player1).toHavePrompt('Choose additional fate');

            this.player1.clickPrompt('0');
            expect(this.brash.location).toBe('play area');
            expect(this.game.currentConflict.attackers).toContain(this.brash);
            expect(this.game.currentConflict.defenders).not.toContain(this.brash);
            expect(this.player1.fate).toBe(p1InitialFate - 2);
            expect(this.getChatLogs(10)).toContain(
                'player1 uses Ashalan Lantern, naming Good Omen to look for a character on the top of player2\'s dynasty deck'
            );
            expect(this.getChatLogs(10)).not.toContain(
                'Saadiyah al-Mozedu is not Foreign, their Ashalan Lantern is discarded'
            );
            expect(this.lantern.location).toBe('play area');
        });

        it('gives 3 fate discount if character chosen matches the name', function () {
            this.player2.moveCard(this.brash, 'dynasty deck');
            this.player2.moveCard(this.courtly, 'dynasty deck');
            this.player2.moveCard(this.tengu, 'dynasty deck');

            this.player1.clickCard(this.lantern);
            this.player1.clickCard(this.recruit);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.recruit],
                defenders: []
            });

            this.player2.pass();

            let p1InitialFate = this.player1.fate;
            this.player1.clickCard(this.lantern);

            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt(this.tengu.name, 'card-name');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton(this.brash.name);
            expect(this.player1).toHavePromptButton(this.courtly.name);
            expect(this.player1).toHavePromptButton(this.tengu.name);

            this.player1.clickPrompt(this.tengu.name);
            expect(this.player1).toHavePrompt('Choose additional fate');

            this.player1.clickPrompt('0');
            expect(this.tengu.location).toBe('play area');
            expect(this.game.currentConflict.attackers).toContain(this.tengu);
            expect(this.game.currentConflict.defenders).not.toContain(this.tengu);
            expect(this.player1.fate).toBe(p1InitialFate - 2);
            expect(this.getChatLogs(10)).toContain(
                'player1 uses Ashalan Lantern, naming Tengu Sensei to look for a character on the top of player2\'s dynasty deck'
            );
            expect(this.getChatLogs(10)).toContain(
                'Battle Maiden Recruit is not Foreign, their Ashalan Lantern is discarded'
            );
        });

        it('allows to decide not play any character', function () {
            this.player2.moveCard(this.brash, 'dynasty deck');
            this.player2.moveCard(this.courtly, 'dynasty deck');
            this.player2.moveCard(this.tengu, 'dynasty deck');

            this.player1.clickCard(this.lantern);
            this.player1.clickCard(this.recruit);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.recruit],
                defenders: []
            });

            this.player2.pass();

            this.player1.clickCard(this.lantern);

            expect(this.player1).toHavePrompt('Name a card');
            this.player1.chooseCardInPrompt('Good Omen', 'card-name');

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton('Take nothing');

            this.player1.clickPrompt('Take nothing');
            expect(this.getChatLogs(10)).toContain(
                'player1 uses Ashalan Lantern, naming Good Omen to look for a character on the top of player2\'s dynasty deck'
            );
            expect(this.lantern.location).toBe('play area');
            expect(this.getChatLogs(10)).toContain('player1 takes nothing');
            expect(this.getChatLogs(10)).not.toContain(
                'Battle Maiden Recruit is not Foreign, their Ashalan Lantern is discarded'
            );
        });
    });
});
