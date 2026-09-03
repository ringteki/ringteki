import { GameModes } from '../../../../../build/server/GameModes.js';

describe('Kaiu Scout', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kaiu-scout', 'adept-of-the-waves', 'solemn-scholar']
                },
                player2: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai']
                }
            });

            this.sd1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.kaiu = this.player1.findCardByName('kaiu-scout');
            this.adeptOfTheWaves1 = this.player1.findCardByName('adept-of-the-waves', 'province 1');
            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves', 'play area');
            this.solemnScholar = this.player1.findCardByName('solemn-scholar');

            this.player1.moveCard(this.adeptOfTheWaves, 'province 1');
            this.player2.moveCard(this.solemnScholar, 'province 1');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');

            this.adeptOfTheWaves1.facedown = true;
            this.adeptOfTheWaves.facedown = true;
            this.solemnScholar.facedown = true;
        });

        it('happy path', function () {
            this.player1.clickCard(this.kaiu);
            this.player1.clickCard(this.sd1);

            expect(this.player1).toHavePrompt('Select a card to turn faceup');
            expect(this.player1).toHavePromptButton('Adept of the Waves (2)');
            expect(this.player1).toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Done');

            expect(this.getChatLogs(5)).toContain('player1 uses Kaiu Scout to look at facedown dynasty cards in province 1');

            this.player1.clickPrompt('Adept of the Waves (2)');

            expect(this.player1).toHavePrompt('Select a card to turn faceup');
            expect(this.player1).toHavePromptButton('Adept of the Waves');
            expect(this.player1).not.toHavePromptButton('Adept of the Waves (2)');
            expect(this.player1).toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Solemn Scholar');

            expect(this.player1).toHavePrompt('Select a card to turn faceup');
            expect(this.player1).toHavePromptButton('Adept of the Waves');
            expect(this.player1).not.toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Done');

            expect(this.solemnScholar.facedown).toBe(false);
            expect(this.adeptOfTheWaves1.facedown && this.adeptOfTheWaves.facedown).toBe(false);
            expect(this.adeptOfTheWaves1.facedown || this.adeptOfTheWaves.facedown).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 turns Adept of the Waves and Solemn Scholar faceup');
        });

        it('reveal nothing', function () {
            this.player1.clickCard(this.kaiu);
            this.player1.clickCard(this.sd1);

            expect(this.player1).toHavePrompt('Select a card to turn faceup');
            expect(this.player1).toHavePromptButton('Adept of the Waves (2)');
            expect(this.player1).toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Done');

            expect(this.getChatLogs(5)).toContain('player1 uses Kaiu Scout to look at facedown dynasty cards in province 1');

            this.player1.clickPrompt('Done');

            expect(this.solemnScholar.facedown).toBe(true);
            expect(this.adeptOfTheWaves1.facedown).toBe(true);
            expect(this.adeptOfTheWaves.facedown).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 does not turn any cards faceup');
        });

        it('no facedown cards', function () {
            this.adeptOfTheWaves1.facedown = false;
            this.adeptOfTheWaves.facedown = false;
            this.solemnScholar.facedown = false;

            this.player1.clickCard(this.kaiu);
            expect(this.player1).not.toBeAbleToSelect(this.sd1);
        });

        it('dont prompt faceup cards', function () {
            this.adeptOfTheWaves1.facedown = false;
            this.adeptOfTheWaves.facedown = false;
            this.player1.clickCard(this.kaiu);
            this.player1.clickCard(this.sd1);

            expect(this.player1).toHavePrompt('Select a card to turn faceup');
            expect(this.player1).not.toHavePromptButton('Adept of the Waves (2)');
            expect(this.player1).not.toHavePromptButton('Adept of the Waves');
            expect(this.player1).toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Solemn Scholar');
            expect(this.player2).toHavePrompt('Action Window');

            expect(this.solemnScholar.facedown).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 turns Solemn Scholar faceup');
        });
    });
});

describe('Kaiu Scout - dynasty phase', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                gameMode: GameModes.Emerald,
                player1: {
                    inPlay: ['kaiu-scout', 'adept-of-the-waves']
                },
                player2: {
                    inPlay: ['doji-kuwanan']
                }
            });

            this.sd1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.kaiu = this.player1.findCardByName('kaiu-scout');
            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves', 'play area');

            this.player1.moveCard(this.adeptOfTheWaves, 'province 1');
            this.adeptOfTheWaves.facedown = true;
        });

        it('can be triggered during the dynasty phase in Emerald mode', function () {
            this.player1.clickCard(this.kaiu);
            expect(this.player1).toBeAbleToSelect(this.sd1);

            this.player1.clickCard(this.sd1);
            expect(this.player1).toHavePrompt('Select a card to turn faceup');

            this.player1.clickPrompt('Adept of the Waves');
            expect(this.adeptOfTheWaves.facedown).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 turns Adept of the Waves faceup');
        });
    });
});
