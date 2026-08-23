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
                defenders: [this.challenger, this.kuwanan, this.yoshi],
            });
            expect(this.challenger.getMilitarySkill()).toBe(2);
            expect(this.challenger.getPoliticalSkill()).toBe(2);

            this.player2.clickCard(this.plague4);
            this.player2.clickCard(this.shadows);

            expect(this.challenger.getMilitarySkill()).toBe(2);
            expect(this.challenger.getPoliticalSkill()).toBe(2);

            this.player1.clickCard(this.plague1);
            expect(this.player1).toBeAbleToSelect(this.shadows);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).toBeAbleToSelect(this.yoshi);

            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Select where to pull card from');
            expect(this.player1).toHavePromptButton('Discard pile (1)');
            expect(this.player1).toHavePromptButton('Deck (1)');

            let length = this.player1.conflictDeck.length;

            this.player1.clickPrompt('Deck (1)');

            expect(this.plague2.parent).toBe(this.yoshi);
            expect(this.challenger.getMilitarySkill()).toBe(1);
            expect(this.challenger.getPoliticalSkill()).toBe(1);
            expect(this.yoshi.getMilitarySkill()).toBe(0);
            expect(this.yoshi.getPoliticalSkill()).toBe(4);

            expect(this.player1.conflictDeck.length).toBe(length - 1);

            expect(this.getChatLogs(10)).toContain('player1 uses A Plague of Yokai to infect Kakita Yoshi and lose 1 honor');
            expect(this.getChatLogs(10)).toContain('player1 takes from their deck');
            expect(this.getChatLogs(10)).toContain('player1 channels their shadow affinity to prevent the honor loss');
            expect(this.getChatLogs(10)).toContain('player1 is shuffling their conflict deck');

            this.player2.pass();

            this.player1.clickCard(this.plague2);
            expect(this.player1).toBeAbleToSelect(this.shadows);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);

            this.player1.clickCard(this.kuwanan);
            expect(this.player1).toHavePrompt('Select where to pull card from');
            expect(this.player1).toHavePromptButton('Discard pile (1)');
            expect(this.player1).not.toHavePromptButton('Deck (1)');

            let length2 = this.player1.conflictDiscard.length;

            this.player1.clickPrompt('Discard pile (1)');

            expect(this.plague3.parent).toBe(this.kuwanan);
            expect(this.challenger.getMilitarySkill()).toBe(0);
            expect(this.challenger.getPoliticalSkill()).toBe(0);
            expect(this.yoshi.getMilitarySkill()).toBe(0);
            expect(this.yoshi.getPoliticalSkill()).toBe(3);
            expect(this.kuwanan.getMilitarySkill()).toBe(2);
            expect(this.kuwanan.getPoliticalSkill()).toBe(1);

            expect(this.player1.conflictDiscard.length).toBe(length2 - 1);

            expect(this.getChatLogs(10)).toContain('player1 uses A Plague of Yokai to infect Doji Kuwanan and lose 1 honor');
            expect(this.getChatLogs(10)).toContain('player1 takes from their discard pile');
            expect(this.getChatLogs(10)).toContain('player1 channels their shadow affinity to prevent the honor loss');
        });

        it('no affinity', function () {
            this.player1.moveCard(this.serpent, 'dynasty discard pile');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.shadows],
                defenders: [this.challenger, this.kuwanan, this.yoshi],
            });
            let honor = this.player1.honor;
            this.player2.pass();
            this.player1.clickCard(this.plague1);
            this.player1.clickCard(this.challenger);

            this.player2.pass();

            this.player1.clickCard(this.plague1);
            this.player1.clickCard(this.yoshi);
            this.player1.clickPrompt('Deck (1)');
            expect(this.plague2.parent).toBe(this.yoshi);
            expect(this.player1.honor).toBe(honor - 1);
            expect(this.getChatLogs(10)).not.toContain('player1 channels their shadow affinity to prevent the honor loss');
        });
    });
});
