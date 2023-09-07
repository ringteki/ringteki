const { GameModes } = require('../../../build/server/GameModes');

describe('Dynasty - Obsidian', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['togashi-mitsu', 'doji-challenger'],
                    hand: ['fine-katana', 'fine-katana', 'a-new-name', 'steward-of-law']
                },
                player2: {
                    inPlay: ['hantei-sotorii'],
                    hand: ['fine-katana']
                },
                gameMode: GameModes.Obsidian
            });

            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.steward = this.player1.findCardByName('steward-of-law');

            this.katana1 = this.player1.filterCardsByName('fine-katana')[0];
            this.katana2 = this.player1.filterCardsByName('fine-katana')[1];
            this.katana3 = this.player2.findCardByName('fine-katana');
            this.ann = this.player1.findCardByName('a-new-name');
        });

        it('should let you play attachments in dynasty', function () {
            this.player1.clickCard(this.katana1);
            this.player1.clickCard(this.mitsu);
            expect(this.mitsu.attachments).toContain(this.katana1);
        });

        it('should let you play conflict characters in dynasty', function () {
            this.player1.clickCard(this.steward);
            this.player1.clickPrompt('1');
            expect(this.steward.location).toBe('play area');
            expect(this.steward.fate).toBe(1);
        });
    });
});
