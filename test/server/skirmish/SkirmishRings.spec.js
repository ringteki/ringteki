const { GameModes } = require('../../../build/server/GameModes');

describe('Skirmish Ring Effects', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['eager-scout', 'doji-whisperer'],
                    hand: ['assassination']
                },
                player2: {
                    inPlay: ['matsu-tsuko-2', 'akodo-toturi'],
                    hand: ['let-go']
                },
                gameMode: GameModes.Skirmish
            });

            this.scout = this.player1.findCardByName('eager-scout');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.tsuko = this.player2.findCardByName('matsu-tsuko-2');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.whisperer.bowed = true;
            this.tsuko.bowed = true;

            this.whisperer.fate = 1;
            this.tsuko.fate = 2;
            this.toturi.fate = 0;
        });

        it('water ring', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                ring: 'water'
            });
            this.noMoreActions();

            expect(this.player1).not.toBeAbleToSelect(this.scout);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.tsuko);
            expect(this.player1).toBeAbleToSelect(this.toturi);

            expect(this.toturi.bowed).toBe(false);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.bowed).toBe(true);
        });

        it('earth ring', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                ring: 'earth'
            });
            this.noMoreActions();

            expect(this.player1).toHavePromptButton('Draw a card');
            expect(this.player1).toHavePromptButton('Opponent discards a card');

            let hand = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.player1.clickPrompt('Opponent discards a card');
            expect(this.player1.hand.length).toBe(hand);
            expect(this.player2.hand.length).toBe(hand2 - 1);
        });

        it('air ring', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                ring: 'air'
            });
            this.noMoreActions();

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            expect(this.player1).not.toHavePromptButton('Gain 2 Honor');
            expect(this.player1).toHavePromptButton('Take 1 Honor from opponent');

            this.player1.clickPrompt('Take 1 Honor from opponent');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2.honor).toBe(honor2 - 1);
        });
    });
});
