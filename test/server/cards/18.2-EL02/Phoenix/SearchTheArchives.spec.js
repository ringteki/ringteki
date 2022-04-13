describe('Search the Archives', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-atsuko', 'solemn-scholar', 'isawa-tadaka', 'seppun-ishikawa'],
                    hand: ['search-the-archives', 'search-the-archives', 'search-the-archives'],
                    conflictDiscard: ['embrace-the-void', 'hurricane-punch', 'display-of-power', 'way-of-the-scorpion', 'isawa-tadaka-2', 'all-and-nothing', 'censure']
                },
                player2: {
                }
            });

            this.ishikawa = this.player1.findCardByName('seppun-ishikawa');
            this.atsuko = this.player1.findCardByName('isawa-atsuko');
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.tadaka = this.player1.findCardByName('isawa-tadaka');
            this.scroll1 = this.player1.filterCardsByName('search-the-archives')[0];
            this.scroll2 = this.player1.filterCardsByName('search-the-archives')[1];
            this.scroll3 = this.player1.filterCardsByName('search-the-archives')[2];

            this.etv = this.player1.findCardByName('embrace-the-void');
            this.punch = this.player1.findCardByName('hurricane-punch');
            this.dop = this.player1.findCardByName('display-of-power');
            this.tadaka2 = this.player1.findCardByName('isawa-tadaka-2');
            this.scorp = this.player1.findCardByName('way-of-the-scorpion');
            this.aan = this.player1.findCardByName('all-and-nothing');
            this.censure = this.player1.findCardByName('censure');

            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.player1.moveCard(this.tadaka2, 'conflict deck');
            this.player1.moveCard(this.punch, 'conflict deck');
            this.player1.moveCard(this.dop, 'conflict deck');
            this.player1.moveCard(this.censure, 'conflict deck');
        });

        it('should let you pick a spell or kiho card from your deck and add it to your hand', function () {
            this.player1.playAttachment(this.scroll1, this.atsuko);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.scroll1);
            this.player1.clickCard(this.scroll1);
            expect(this.player1).toHaveDisabledPromptButton('Isawa Tadaka');
            expect(this.player1).toHavePromptButton('Hurricane Punch');
            expect(this.player1).toHavePromptButton('Display of Power');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            this.player1.clickPrompt('Display of Power');
            expect(this.dop.location).toBe('hand');
            expect(this.getChatLogs(5)).toContain('player1 uses Search the Archives to look at the top 4 cards of their deck');
            expect(this.getChatLogs(5)).toContain('player1 takes Display of Power');
        });

        it('should let you order the other cards', function () {
            this.player1.playAttachment(this.scroll1, this.atsuko);
            this.player1.clickCard(this.scroll1);
            expect(this.player1).toHaveDisabledPromptButton('Isawa Tadaka');
            expect(this.player1).toHavePromptButton('Hurricane Punch');
            expect(this.player1).toHavePromptButton('Display of Power');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            this.player1.clickPrompt('Display of Power');
            expect(this.dop.location).toBe('hand');
            expect(this.getChatLogs(5)).toContain('player1 uses Search the Archives to look at the top 4 cards of their deck');
            expect(this.getChatLogs(5)).toContain('player1 takes Display of Power');

            expect(this.player1).toHavePrompt('Select a card to place');
            expect(this.player1).toHavePromptButton('Isawa Tadaka');
            expect(this.player1).toHavePromptButton('Hurricane Punch');
            expect(this.player1).not.toHavePromptButton('Display of Power');
            expect(this.player1).toHavePromptButton('Censure');

            this.player1.clickPrompt('Isawa Tadaka');
            expect(this.player1).toHavePrompt('Place this card on the top or bottom of your deck?');
            expect(this.player1).toHavePromptButton('Top');
            expect(this.player1).toHavePromptButton('Bottom');
            this.player1.clickPrompt('Top');
            expect(this.getChatLogs(5)).toContain('player1 puts a card on the top of their deck');

            expect(this.player1).toHavePrompt('Select a card to place');
            expect(this.player1).not.toHavePromptButton('Isawa Tadaka');
            expect(this.player1).toHavePromptButton('Hurricane Punch');
            expect(this.player1).not.toHavePromptButton('Display of Power');
            expect(this.player1).toHavePromptButton('Censure');
            this.player1.clickPrompt('Censure');
            expect(this.player1).toHavePrompt('Place this card on the top or bottom of your deck?');
            expect(this.player1).toHavePromptButton('Top');
            expect(this.player1).toHavePromptButton('Bottom');
            this.player1.clickPrompt('Bottom');
            expect(this.getChatLogs(5)).toContain('player1 puts a card on the bottom of their deck');

            expect(this.player1).toHavePrompt('Select a card to place');
            expect(this.player1).not.toHavePromptButton('Isawa Tadaka');
            expect(this.player1).toHavePromptButton('Hurricane Punch');
            expect(this.player1).not.toHavePromptButton('Display of Power');
            expect(this.player1).not.toHavePromptButton('Censure');
            this.player1.clickPrompt('Hurricane Punch');
            expect(this.player1).toHavePrompt('Place this card on the top or bottom of your deck?');
            expect(this.player1).toHavePromptButton('Top');
            expect(this.player1).toHavePromptButton('Bottom');
            this.player1.clickPrompt('Top');
            expect(this.getChatLogs(5)).toContain('player1 puts a card on the top of their deck');

            expect(this.player2).toHavePrompt('Action Window');

            expect(this.player1.conflictDeck[0]).toBe(this.punch);
            expect(this.player1.conflictDeck[1]).toBe(this.tadaka2);
            expect(this.player1.conflictDeck[this.player1.conflictDeck.length - 1]).toBe(this.censure);
        });

        it('testing alternate ordering', function () {
            this.player1.playAttachment(this.scroll1, this.atsuko);
            this.player1.clickCard(this.scroll1);
            expect(this.player1).toHaveDisabledPromptButton('Isawa Tadaka');
            expect(this.player1).toHavePromptButton('Hurricane Punch');
            expect(this.player1).toHavePromptButton('Display of Power');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            this.player1.clickPrompt('Display of Power');
            expect(this.dop.location).toBe('hand');
            expect(this.getChatLogs(5)).toContain('player1 uses Search the Archives to look at the top 4 cards of their deck');
            expect(this.getChatLogs(5)).toContain('player1 takes Display of Power');

            expect(this.player1).toHavePrompt('Select a card to place');
            expect(this.player1).toHavePromptButton('Isawa Tadaka');
            expect(this.player1).toHavePromptButton('Hurricane Punch');
            expect(this.player1).not.toHavePromptButton('Display of Power');
            expect(this.player1).toHavePromptButton('Censure');

            this.player1.clickPrompt('Hurricane Punch');
            this.player1.clickPrompt('Bottom');
            this.player1.clickPrompt('Censure');
            this.player1.clickPrompt('Top');
            this.player1.clickPrompt('Isawa Tadaka');
            this.player1.clickPrompt('Top');

            expect(this.player2).toHavePrompt('Action Window');

            expect(this.player1.conflictDeck[0]).toBe(this.tadaka2);
            expect(this.player1.conflictDeck[1]).toBe(this.censure);
            expect(this.player1.conflictDeck[this.player1.conflictDeck.length - 1]).toBe(this.punch);
        });
    });
});
