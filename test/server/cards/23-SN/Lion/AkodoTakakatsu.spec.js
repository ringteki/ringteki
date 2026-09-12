describe('Akodo Takakatsu', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-tadakatsu', 'doji-challenger'],
                    hand: ['invocation-of-ash']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer'],
                    hand: ['mono-no-aware']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');

            this.tadakatsu = this.player1.findCardByName('akodo-tadakatsu');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.invocation = this.player1.findCardByName('invocation-of-ash');
            this.monoNoAware = this.player2.findCardByName('mono-no-aware');

            this.tadakatsu.fate = 2;
            this.mitsu.fate = 1;
        });

        it('reaction to an opponent removing fate', function () {
            this.player1.pass();
            this.player2.clickCard(this.monoNoAware);
            expect(this.tadakatsu.fate).toBe(1);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tadakatsu);

            this.player1.clickCard(this.tadakatsu);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.tadakatsu);
            expect(this.player1).toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses Akodo Tadakatsu to injure Doji Whisperer');
        });

        it('reaction to an opponent resolving a ring effect', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                ring: 'void',
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.noMoreActions();

            this.player2.clickPrompt('No');
            this.player2.clickCard(this.tadakatsu);
            expect(this.tadakatsu.fate).toBe(1);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.tadakatsu);
            this.player1.clickCard(this.mitsu);
            expect(this.mitsu.fate).toBe(0);
        });

        it('no reaction when your own card removes the fate', function () {
            this.player1.playAttachment(this.invocation, this.challenger);
            this.player2.pass();
            this.player1.clickCard(this.invocation);
            this.player1.clickCard(this.tadakatsu);

            expect(this.tadakatsu.fate).toBe(1);
            expect(this.player1).not.toBeAbleToSelect(this.tadakatsu);
            expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
        });

        it('reaction to attacking - bow', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tadakatsu],
                defenders: [this.mitsu]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tadakatsu);

            this.player1.clickCard(this.tadakatsu);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.tadakatsu);
            expect(this.player2).toBeAbleToSelect(this.mitsu);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);

            this.player2.clickCard(this.mitsu);
            expect(this.player2).toHavePromptButton('Injure this character');
            expect(this.player2).toHavePromptButton('Bow this character');

            expect(this.mitsu.bowed).toBe(false);
            this.player2.clickPrompt('Bow this character');
            expect(this.mitsu.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Akodo Tadakatsu to bow Togashi Mitsu');
        });

        it('reaction to attacking - injure', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tadakatsu],
                defenders: [this.mitsu]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tadakatsu);

            this.player1.clickCard(this.tadakatsu);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.tadakatsu);
            expect(this.player2).toBeAbleToSelect(this.mitsu);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);

            this.player2.clickCard(this.mitsu);
            expect(this.player2).toHavePromptButton('Injure this character');
            expect(this.player2).toHavePromptButton('Bow this character');

            expect(this.mitsu.fate).toBe(1);
            this.player2.clickPrompt('Injure this character');
            expect(this.mitsu.fate).toBe(0);
            expect(this.getChatLogs(5)).toContain('player1 uses Akodo Tadakatsu to injure Togashi Mitsu');
        });
    });
});
