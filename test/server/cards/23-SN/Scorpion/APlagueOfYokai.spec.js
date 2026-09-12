import { GameModes } from '../../../../../build/server/GameModes.js';

describe('A Plague of Yokai', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                gameMode: GameModes.Emerald,
                player1: {
                    inPlay: ['adept-of-shadows', 'heir-of-the-serpent'],
                    conflictDeck: ['a-plague-of-yokai'],
                    conflictDiscard: ['a-plague-of-yokai'],
                    hand: ['a-plague-of-yokai']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-kuwanan', 'kakita-yoshi'],
                    hand: ['a-plague-of-yokai']
                }
            });

            this.shadows = this.player1.findCardByName('adept-of-shadows');
            this.serpent = this.player1.findCardByName('heir-of-the-serpent');
            this.plague1 = this.player1.findCardByName('a-plague-of-yokai', 'hand');
            this.plague2 = this.player1.findCardByName('a-plague-of-yokai', 'conflict deck');
            this.plague3 = this.player1.findCardByName('a-plague-of-yokai', 'conflict discard pile');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.plague4 = this.player2.findCardByName('a-plague-of-yokai', 'hand');
        });

        it('skill penalty and action ability', function () {
            this.player1.clickCard(this.plague1);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.getMilitarySkill()).toBe(3);
            expect(this.challenger.getPoliticalSkill()).toBe(3);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shadows],
                defenders: [this.challenger, this.kuwanan, this.yoshi]
            });
            expect(this.challenger.getMilitarySkill()).toBe(2);
            expect(this.challenger.getPoliticalSkill()).toBe(2);

            this.player2.clickCard(this.plague4);
            this.player2.clickCard(this.shadows);

            expect(this.challenger.getMilitarySkill()).toBe(2);
            expect(this.challenger.getPoliticalSkill()).toBe(2);

            let length = this.player1.conflictDeck.length;

            this.player1.clickCard(this.plague1);

            // Only characters on the enemy side can be infected.
            expect(this.player1).not.toBeAbleToSelect(this.shadows);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            this.player1.clickCard(this.yoshi);

            // The dishonor is a cost, and only a friendly participating Shinobi pays it.
            expect(this.player1).toHavePrompt('Select character to dishonor');
            expect(this.player1).toBeAbleToSelect(this.shadows);
            expect(this.player1).not.toBeAbleToSelect(this.serpent);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
            this.player1.clickCard(this.shadows);
            expect(this.shadows.isDishonored).toBe(true);

            expect(this.plague2.parent).toBe(this.yoshi);
            expect(this.challenger.getMilitarySkill()).toBe(1);
            expect(this.challenger.getPoliticalSkill()).toBe(1);
            expect(this.yoshi.getMilitarySkill()).toBe(0);
            expect(this.yoshi.getPoliticalSkill()).toBe(4);

            expect(this.player1.conflictDeck.length).toBe(length - 1);

            expect(this.getChatLogs(10)).toContain('player1 uses A Plague of Yokai, dishonoring Adept of Shadows to infect Kakita Yoshi');
            expect(this.getChatLogs(10)).toContain('player1 is shuffling their conflict deck');
        });

        it('does not search the discard pile', function () {
            this.player1.moveCard(this.plague2, 'conflict discard pile');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shadows],
                defenders: [this.challenger]
            });
            this.player2.pass();

            this.player1.clickCard(this.plague1);
            this.player1.clickCard(this.challenger);
            expect(this.plague1.parent).toBe(this.challenger);

            this.player2.pass();

            // Only copies in the conflict deck can be found.
            this.player1.clickCard(this.plague1);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.plague2.location).toBe('conflict discard pile');
        });

        it('cannot be used without a friendly participating Shinobi', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.serpent],
                defenders: [this.challenger]
            });
            this.player2.pass();

            this.player1.clickCard(this.plague1);
            this.player1.clickCard(this.challenger);
            expect(this.plague1.parent).toBe(this.challenger);

            this.player2.pass();

            this.player1.clickCard(this.plague1);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.plague2.location).toBe('conflict deck');
        });
    });
});
