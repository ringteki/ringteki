import { GameModes } from '../../../../../build/server/GameModes.js';

describe('Laughing Thunder', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['laughing-thunder'],
                    hand: ['centered-breath', 'hurricane-punch', 'centered-breath', 'let-go'],
                    conflictDiscard: ['mantra-of-air']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'political-rival', 'tattooed-wanderer'],
                    hand: ['way-of-the-lion', 'fine-katana', 'voice-of-honor']
                },
                gameMode: GameModes.Emerald,
            });

            this.thunder = this.player1.findCardByName('laughing-thunder');
            this.breath = this.player1.filterCardsByName('centered-breath')[0];
            this.breath2 = this.player1.filterCardsByName('centered-breath')[1];
            this.punch = this.player1.findCardByName('hurricane-punch');
            this.air = this.player1.findCardByName('mantra-of-air');
            this.letgo = this.player1.findCardByName('let-go');

            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.wotl = this.player2.findCardByName('way-of-the-lion');
            this.katana = this.player2.findCardByName('fine-katana');
            this.rival = this.player2.findCardByName('political-rival');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');
            this.voice = this.player2.findCardByName('voice-of-honor');
        });

        it('happy path', function () {
            this.player1.clickCard(this.thunder);
            expect(this.player1).toHavePrompt('Laughing Thunder');
            expect(this.player1).toBeAbleToSelect(this.breath);
            expect(this.player1).toBeAbleToSelect(this.breath2);
            expect(this.player1).toBeAbleToSelect(this.punch);
            expect(this.player1).not.toBeAbleToSelect(this.air);
            expect(this.player1).not.toBeAbleToSelect(this.letgo);

            this.player1.clickCard(this.breath);
            expect(this.breath.getType()).toBe('attachment');
            expect(this.thunder.attachments).toContain(this.breath);

            expect(this.getChatLogs(5)).toContain('player1 uses Laughing Thunder to claim the effects of Centered Breath as its own!');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.thunder],
                defenders: [this.toturi, this.wanderer],
                type: 'military'
            });

            this.player2.pass();

            this.player1.clickCard(this.thunder);
            expect(this.player1).toBeAbleToSelect(this.thunder);
            this.player1.clickCard(this.thunder);

            expect(this.getChatLogs(5)).toContain('player1 uses Laughing Thunder\'s gained ability from Centered Breath to add an additional use to each of Laughing Thunder\'s printed abilities');

            this.player2.pass();

            this.player1.clickCard(this.thunder);
            expect(this.player1).toHavePrompt('Laughing Thunder');
            expect(this.player1).not.toBeAbleToSelect(this.breath);
            expect(this.player1).not.toBeAbleToSelect(this.breath2);
            expect(this.player1).toBeAbleToSelect(this.punch);
            expect(this.player1).not.toBeAbleToSelect(this.air);
            expect(this.player1).not.toBeAbleToSelect(this.letgo);

            this.player1.clickCard(this.punch);
            expect(this.getChatLogs(5)).toContain('player1 uses Laughing Thunder to claim the effects of Hurricane Punch as its own!');

            this.player2.pass();

            this.player1.clickCard(this.thunder);
            expect(this.player1).toBeAbleToSelect(this.thunder);
            this.player1.clickCard(this.thunder);

            expect(this.getChatLogs(5)).toContain('player1 uses Laughing Thunder\'s gained ability from Hurricane Punch to grant 2 military skill to Laughing Thunder and draw a card');
        });

        it('no cancels', function () {
            this.player1.clickCard(this.thunder);
            this.player1.clickCard(this.breath);

            this.toturi.honor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.thunder],
                defenders: [this.toturi, this.wanderer],
                type: 'military'
            });

            this.player2.pass();

            this.player1.clickCard(this.thunder);
            expect(this.player1).toBeAbleToSelect(this.thunder);
            this.player1.clickCard(this.thunder);

            expect(this.getChatLogs(5)).toContain('player1 uses Laughing Thunder\'s gained ability from Centered Breath to add an additional use to each of Laughing Thunder\'s printed abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('cannot trigger ability on the now-attachment', function () {
            this.player1.clickCard(this.thunder);
            this.player1.clickCard(this.breath);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.thunder],
                defenders: [this.toturi, this.wanderer],
                type: 'military'
            });

            this.player2.pass();

            expect(this.player1).toHavePrompt('Conflict Action Window')
            this.player1.clickCard(this.breath);
            expect(this.player1).toHavePrompt('Conflict Action Window')

            this.player1.clickCard(this.thunder);
            expect(this.player1).toBeAbleToSelect(this.thunder);
            this.player1.clickCard(this.thunder);

            expect(this.getChatLogs(5)).toContain('player1 uses Laughing Thunder\'s gained ability from Centered Breath to add an additional use to each of Laughing Thunder\'s printed abilities');
        });

        it('discard should change it back to an event', function () {
            this.player1.clickCard(this.thunder);
            this.player1.clickCard(this.breath);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.thunder],
                defenders: [this.toturi, this.wanderer],
                type: 'military'
            });

            this.player2.pass();

            this.player1.clickCard(this.letgo);
            this.player1.clickCard(this.breath);
            expect(this.breath.location).toBe('conflict discard pile');
            expect(this.breath.getType()).toBe('event');

            this.player2.pass();

            expect(this.player1).toHavePrompt('Conflict Action Window')
            this.player1.clickCard(this.thunder);
            expect(this.player1).toHavePrompt('Conflict Action Window')
        });
    });
});
