const GameModes = require('../../../server/GameModes');

describe('Disguised - Emerald', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    dynastyDiscard: ['daidoji-kageyu']
                },
                player2: {
                    inPlay: ['hantei-sotorii']
                },
                gameMode: GameModes.Emerald
            });

            this.kageyu = this.player1.findCardByName('daidoji-kageyu');
            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.player1.placeCardInProvince(this.kageyu, 'province 1');
        });

        it('should not let you play a disguised character at home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.sotorii],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.kageyu);
            this.player1.clickCard(this.whisperer);

            expect(this.player1).not.toHavePromptButton('Conflict');
            expect(this.player1).not.toHavePromptButton('Home');
            expect(this.kageyu.isParticipating()).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 plays Daidoji Kageyu into the conflict using Disguised, choosing to replace Doji Whisperer');
        });
    });
});
