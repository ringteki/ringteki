describe('Yatakabune Port', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka'],
                    hand: ['a-new-name']
                },
                player2: {
                    provinces: ['yatakabune-port']
                }
            });

            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.ann = this.player1.findCardByName('a-new-name');

            this.port = this.player2.findCardByName('yatakabune-port');
        });

        it('should claim favor when broken', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                defenders: [],
                province: this.port,
                type: 'military'
            });

            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.port);

            this.player2.clickCard(this.port);
            this.player2.clickPrompt('military');
            expect(this.player2.player.imperialFavor).toBe('military');
            expect(this.getChatLogs(10)).toContain('player2 claims the Emperor\'s military favor!');
            expect(this.getChatLogs(10)).toContain('player2 uses Yatakabune Port to claim the Emperor\'s favor');
        });
    });
});

describe('Yatakabune Port with Feeding an Army', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    honor: 11,
                    fate: 5,
                    inPlay: ['ethereal-dreamer', 'doji-challenger', 'togashi-mitsu'],
                    hand: ['feeding-an-army'],
                    provinces: ['yatakabune-port', 'manicured-garden', 'magistrate-station', 'public-forum']
                },
                player2: {
                    honor: 11,
                    inPlay: ['iuchi-shahai-2', 'ikoma-ikehata']
                }
            });
            this.dreamer = this.player1.findCardByName('ethereal-dreamer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.feeding = this.player1.findCardByName('feeding-an-army');

            this.port = this.player1.findCardByName('yatakabune-port');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.station = this.player1.findCardByName('magistrate-station');
            this.publicForum = this.player1.findCardByName('public-forum');

            this.port.facedown = false;
            this.publicForum.facedown = false;
            this.garden.facedown = false;

            this.shahai = this.player2.findCardByName('iuchi-shahai-2');
            this.ikehata = this.player2.findCardByName('ikoma-ikehata');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
        });

        it('should trigger on break provinces that you break as a cost', function() {
            this.noMoreActions();
            this.player1.clickCard(this.feeding);
            this.player1.clickCard(this.port);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.port);
            this.player1.clickCard(this.port);
            this.player1.clickPrompt('military');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.getChatLogs(10)).toContain('player1 claims the Emperor\'s military favor!');
            expect(this.getChatLogs(10)).toContain('player1 uses Yatakabune Port to claim the Emperor\'s favor');
        });
    });
});
