import { GameModes } from '../../../../../build/server/GameModes.js';

describe('Loyal Warhound', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                gameMode: GameModes.Emerald,

                player1: {
                    inPlay: ['loyal-warhound', 'loyal-warhound', 'doji-challenger', 'aranat', 'eager-scout', 'laughing-thunder'],
                    hand: ['fine-katana'],
                },
                player2: {
                    inPlay: ['togashi-mitsu'],
                    provinces: ['honor-s-reward'],
                    hand: ['let-go', 'assassination']
                }
            });
            this.scout = this.player1.findCardByName('eager-scout');
            this.katana = this.player1.findCardByName('fine-katana');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
            this.hound1 = this.player1.filterCardsByName('loyal-warhound')[0];
            this.hound2 = this.player1.filterCardsByName('loyal-warhound')[1];

            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.letGo = this.player2.findCardByName('let-go');
            this.assassination = this.player2.findCardByName('assassination');
            this.reward = this.player2.findCardByName('honor-s-reward');
        });

        it('happy path', function () {
            this.challenger.fate = 5;
            this.mitsu.fate = 5;
            this.scout.fate = 5;

            this.player1.clickCard(this.hound1);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.hound2);
            expect(this.player1).toBeAbleToSelect(this.scout);
            expect(this.player1).not.toBeAbleToSelect(this.hound1);
            expect(this.player1).not.toBeAbleToSelect(this.aranat);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);

            this.player1.clickCard(this.challenger);

            expect(this.challenger.attachments).toContain(this.hound1);
            expect(this.hound1.type).toBe('attachment');

            expect(this.getChatLogs(5)).toContain('player1 uses Loyal Warhound to attach itself to Doji Challenger');

            this.player2.pass();

            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.hound1);
            expect(this.player1).toHavePrompt('Action Window');

            this.player1.clickCard(this.hound2);
            this.player1.clickCard(this.scout);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.scout],
                defenders: [this.mitsu],
                province: this.reward
            });

            this.challenger.bow();
            this.scout.bow();

            this.player2.clickCard(this.assassination);
            expect(this.player2).not.toBeAbleToSelect(this.hound1);
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.letGo);
            expect(this.player2).toBeAbleToSelect(this.hound1);
            this.player2.clickPrompt('Cancel');

            this.player2.clickCard(this.reward);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.scout);

            this.player2.clickCard(this.challenger);
            this.noMoreActions();

            this.nextPhase();
            this.player1.clickPrompt('Done');
            this.advancePhases('conflict');

            this.noMoreActions();
            this.player2.passConflict();

            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.challenger, this.scout],
                defenders: [this.mitsu],
                province: this.reward
            });

            this.challenger.bow();
            this.scout.bow();

            this.player2.clickCard(this.reward);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.scout);

            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.hound2);
            this.player1.pass();

            this.player2.clickCard(this.reward);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.scout);
            this.player2.clickCard(this.scout);

            this.noMoreActions();

            this.player2.pass();

            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.hound1);
            expect(this.challenger.attachments).not.toContain(this.hound1);
            expect(this.hound1.type).toBe('character');

            expect(this.hound1.location).toBe('play area');

            expect(this.getChatLogs(10)).toContain('player1 uses Loyal Warhound to detatch itself');
        });

        it('hound -> hound -> other', function () {
            this.hound1.fate = 5;
            this.hound1.honor();
            this.player1.playAttachment(this.katana, this.hound1);

            this.player2.pass();

            this.player1.clickCard(this.hound1);
            this.player1.clickCard(this.hound2);

            expect(this.getChatLogs(10)).toContain('Fine Katana is discarded from Loyal Warhound as it is no longer legally attached');
            expect(this.getChatLogs(10)).toContain('5 fate is removed from Loyal Warhound as it can no longer legally have fate');
            expect(this.getChatLogs(10)).toContain('Status tokens are removed from Loyal Warhound as it can no longer legally have status tokens');

            expect(this.hound2.attachments).toContain(this.hound1);
            expect(this.hound1.type).toBe('attachment');
            expect(this.hound1.fate).toBe(0);
            expect(this.hound1.isHonored).toBe(false);
            expect(this.hound1.attachments).toEqual([]);
            expect(this.katana.location).toBe('conflict discard pile');

            this.player2.pass();

            this.player1.clickCard(this.hound2);
            this.player1.clickCard(this.challenger);

            expect(this.hound2.attachments).toEqual([]);
            expect(this.hound1.type).toBe('character');

            expect(this.hound1.location).toBe('dynasty discard pile');
            expect(this.hound2.type).toBe('attachment');
            expect(this.challenger.attachments).toContain(this.hound2);
        });
    });
});
