describe('Whispers of the Lords of Death', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'isawa-tadaka'],
                    hand: ['whispers-of-the-lords-of-death']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'kitsu-motso', 'akodo-reserve-company'],
                    hand: ['whispers-of-the-lords-of-death']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.whispers = this.player1.findCardByName('whispers-of-the-lords-of-death');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.kitsuMotso = this.player2.findCardByName('kitsu-motso');
            this.whispers2 = this.player2.findCardByName('whispers-of-the-lords-of-death');
            this.company = this.player2.findCardByName('akodo-reserve-company');

            this.challenger.fate = 2;
            this.kitsuMotso.fate = 1;
            this.isawaTadaka.fate = 0;
            this.solemnScholar.fate = 0;
        });

        it('should let you attach to anyone', function() {
            this.player1.clickCard(this.whispers);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.isawaTadaka);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).toBeAbleToSelect(this.kitsuMotso);

            this.player1.clickCard(this.challenger);
            expect(this.challenger.attachments).toContain(this.whispers);
        });

        it('should react when parent loses a conflict, but not if they win', function() {
            this.player1.playAttachment(this.whispers, this.solemnScholar);
            this.player2.playAttachment(this.whispers2, this.challenger);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.isawaTadaka],
                defenders: [this.solemnScholar, this.kitsuMotso],
                type: 'military'
            });

            this.challenger.bow();
            this.isawaTadaka.bow();

            let fate = this.challenger.fate;
            expect(this.challenger.attachments).toContain(this.whispers2);
            expect(this.kitsuMotso.attachments).not.toContain(this.whispers2);

            this.noMoreActions();

            expect(this.player1).toHavePrompt('Choose a character to receive the Lords of Death');
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.isawaTadaka);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).toBeAbleToSelect(this.kitsuMotso);

            this.player1.clickCard(this.kitsuMotso);

            expect(this.challenger.fate).toBe(fate - 1);
            expect(this.challenger.attachments).not.toContain(this.whispers2);
            expect(this.kitsuMotso.attachments).toContain(this.whispers2);

            expect(this.getChatLogs(10)).toContain('player2 uses Whispers of the Lords of Death to remove a fate from Doji Challenger and move Whispers of the Lords of Death to another character');
            expect(this.getChatLogs(10)).toContain('player1 attaches Whispers of the Lords of Death to Kitsu Motso');

            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should react when parent loses a conflict, but not if they win', function() {
            this.player1.playAttachment(this.whispers, this.solemnScholar);
            this.player2.playAttachment(this.whispers2, this.challenger);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.isawaTadaka],
                defenders: [this.solemnScholar, this.kitsuMotso],
                type: 'military'
            });

            this.challenger.bow();
            this.isawaTadaka.bow();

            let fate = this.challenger.fate;
            expect(this.challenger.attachments).toContain(this.whispers2);
            expect(this.kitsuMotso.attachments).not.toContain(this.whispers2);

            this.noMoreActions();

            expect(this.player1).toHavePrompt('Choose a character to receive the Lords of Death');
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.isawaTadaka);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).toBeAbleToSelect(this.kitsuMotso);
            expect(this.player1).not.toBeAbleToSelect(this.company);

            this.player1.clickCard(this.kitsuMotso);

            expect(this.challenger.fate).toBe(fate - 1);
            expect(this.challenger.attachments).not.toContain(this.whispers2);
            expect(this.kitsuMotso.attachments).toContain(this.whispers2);

            expect(this.getChatLogs(10)).toContain('player2 uses Whispers of the Lords of Death to remove a fate from Doji Challenger and move Whispers of the Lords of Death to another character');
            expect(this.getChatLogs(10)).toContain('player1 attaches Whispers of the Lords of Death to Kitsu Motso');

            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should react even if parent has no fate', function() {
            this.player1.playAttachment(this.whispers, this.solemnScholar);
            this.player2.playAttachment(this.whispers2, this.isawaTadaka);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.isawaTadaka],
                defenders: [this.solemnScholar, this.kitsuMotso],
                type: 'military'
            });

            this.challenger.bow();
            this.isawaTadaka.bow();

            let fate = this.isawaTadaka.fate;

            this.noMoreActions();
            this.player1.clickCard(this.kitsuMotso);

            expect(this.isawaTadaka.fate).toBe(fate);
            expect(this.isawaTadaka.attachments).not.toContain(this.whispers2);
            expect(this.kitsuMotso.attachments).toContain(this.whispers2);

            expect(this.getChatLogs(10)).toContain('player2 uses Whispers of the Lords of Death to remove a fate from Isawa Tadaka and move Whispers of the Lords of Death to another character');
            expect(this.getChatLogs(10)).toContain('player1 attaches Whispers of the Lords of Death to Kitsu Motso');

            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should react if parent has fate and there is no legal target', function() {
            this.player1.playAttachment(this.whispers, this.challenger);

            this.player2.moveCard(this.solemnScholar, 'dynasty dicard pile');
            this.player2.moveCard(this.kitsuMotso, 'dynasty dicard pile');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.isawaTadaka],
                defenders: [this.company],
                type: 'military'
            });

            this.challenger.bow();
            this.isawaTadaka.bow();

            let fate = this.challenger.fate;

            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Choose a character to receive the Lords of Death');
            expect(this.challenger.fate).toBe(fate - 1);
            expect(this.challenger.attachments).toContain(this.whispers);

            expect(this.getChatLogs(10)).toContain('player1 uses Whispers of the Lords of Death to remove a fate from Doji Challenger and move Whispers of the Lords of Death to another character');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not react if parent has no fate and there is no legal target', function() {
            this.player1.playAttachment(this.whispers, this.isawaTadaka);

            this.player2.moveCard(this.solemnScholar, 'dynasty dicard pile');
            this.player2.moveCard(this.kitsuMotso, 'dynasty dicard pile');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.isawaTadaka],
                defenders: [this.company],
                type: 'military'
            });

            this.challenger.bow();
            this.isawaTadaka.bow();

            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Choose a character to receive the Lords of Death');
            expect(this.isawaTadaka.attachments).toContain(this.whispers);

            expect(this.getChatLogs(10)).not.toContain('player1 uses Whispers of the Lords of Death to remove a fate from Isawa Tadaka and move Whispers of the Lords of Death to another character');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should always let controller pick new target', function() {
            this.player1.playAttachment(this.whispers, this.challenger);
            this.player2.playAttachment(this.whispers2, this.challenger);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.isawaTadaka],
                defenders: [this.solemnScholar, this.kitsuMotso],
                type: 'military'
            });

            this.challenger.bow();
            this.isawaTadaka.bow();

            let fate = this.challenger.fate;
            this.noMoreActions();

            expect(this.player1).toHavePrompt('Choose a character to receive the Lords of Death');
            this.player1.clickCard(this.kitsuMotso);
            expect(this.player1).toHavePrompt('Choose a character to receive the Lords of Death');
            this.player1.clickCard(this.solemnScholar);

            expect(this.challenger.fate).toBe(fate - 2);

            expect(this.getChatLogs(10)).toContain('player2 uses Whispers of the Lords of Death to remove a fate from Doji Challenger and move Whispers of the Lords of Death to another character');
            expect(this.getChatLogs(10)).toContain('player1 uses Whispers of the Lords of Death to remove a fate from Doji Challenger and move Whispers of the Lords of Death to another character');
            expect(this.getChatLogs(10)).toContain('player1 attaches Whispers of the Lords of Death to Kitsu Motso');
            expect(this.getChatLogs(10)).toContain('player1 attaches Whispers of the Lords of Death to Solemn Scholar');

            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
