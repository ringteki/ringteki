describe('Utaku Takeko', function () {
    integration(function () {
        describe('action ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['assassination'],
                        inPlay: ['utaku-takeko', 'moto-youth'],
                        dynastyDiscard: [
                            'border-rider',
                            'moto-ariq',
                            'akodo-toturi-2',
                            'shinjo-yasamura',
                            'moto-youth'
                        ],
                        conflictDiscard: ['shinjo-ambusher']
                    },
                    player2: {
                        hand: ['assassination'],
                        inPlay: ['border-rider'],
                        dynastyDiscard: ['forthright-ide'],
                        conflictDiscard: ['shiksha-scout']
                    }
                });

                this.assassinationP1 = this.player1.findCardByName('assassination');
                this.utakuTakeko = this.player1.findCardByName('utaku-takeko');
                this.motoYouthStatingDiscarded = this.player1.filterCardsByName('moto-youth')[0];
                this.motoYouthStartingInPlay = this.player1.filterCardsByName('moto-youth')[1];

                this.discardBorderRider = this.player1.findCardByName('border-rider');
                this.discardMotoAriq = this.player1.findCardByName('moto-ariq');
                this.discardAkodoToturi = this.player1.findCardByName('akodo-toturi-2');
                this.discardAmbusher = this.player1.findCardByName('shinjo-ambusher');
                this.yasamura = this.player1.findCardByName('shinjo-yasamura');

                this.discardForthrightIde = this.player2.findCardByName('forthright-ide');
                this.discardShikshaScout = this.player2.findCardByName('shiksha-scout');
                this.assassinationP2 = this.player2.findCardByName('assassination');
                this.borderRiderP2 = this.player2.findCardByName('border-rider');
            });

            it('should allow you to pick a 1 glory or higher unicorn character from your dynasty discard pile and play it', function () {
                this.player1.clickCard(this.utakuTakeko);

                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.discardBorderRider); //Unicorn with 1 glory
                expect(this.player1).not.toBeAbleToSelect(this.discardMotoAriq); //Unicorn with 0 glory
                expect(this.player1).not.toBeAbleToSelect(this.discardAmbusher); //Unicorn with 1 glory but conflict discard
                expect(this.player1).not.toBeAbleToSelect(this.discardAkodoToturi); // not a unicorn
                expect(this.player1).not.toBeAbleToSelect(this.discardForthrightIde); // not in player discard pile
                expect(this.player1).not.toBeAbleToSelect(this.discardShikshaScout); // not in player discard pile
                expect(this.player1).not.toBeAbleToSelect(this.yasamura); // unicorn with 1 glory but unique

                const initialPLayerFate = this.player1.fate;
                this.player1.clickCard(this.discardBorderRider);
                this.player1.clickPrompt('1');

                expect(this.player1.fate).toBe(initialPLayerFate - 3); // 2 fate base + 1 extra fate placed
                expect(this.discardBorderRider.location).toBe('play area');
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Utaku Takeko to recall a distant relative who is a Border Rider'
                );
            });

            it('should allow you to pick a 1 glory or higher unicorn character from your dynasty discard pile and play it at home during a conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.utakuTakeko],
                    defenders: [],
                    type: 'political',
                    ring: 'air'
                });

                this.player2.pass();
                this.player1.clickCard(this.utakuTakeko);

                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.discardBorderRider); //Unicorn with 1 glory
                expect(this.player1).not.toBeAbleToSelect(this.discardMotoAriq); //Unicorn with 0 glory
                expect(this.player1).not.toBeAbleToSelect(this.discardAmbusher); //Unicorn with 1 glory but conflict discard
                expect(this.player1).not.toBeAbleToSelect(this.discardAkodoToturi); // not a unicorn
                expect(this.player1).not.toBeAbleToSelect(this.discardForthrightIde); // not in player discard pile
                expect(this.player1).not.toBeAbleToSelect(this.discardShikshaScout); // not in player discard pile
                expect(this.player1).not.toBeAbleToSelect(this.yasamura); // unicorn with 1 glory but unique

                const initialPLayerFate = this.player1.fate;
                this.player1.clickCard(this.discardBorderRider);
                this.player1.clickPrompt('1');

                expect(this.player1.fate).toBe(initialPLayerFate - 3); // 2 fate base + 1 extra fate placed
                expect(this.discardBorderRider.location).toBe('play area');
                expect(this.discardBorderRider.isParticipating()).toBe(false);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Utaku Takeko to recall a distant relative who is a Border Rider'
                );
            });

            it('does not allow playing characters who were discarded in the same phase', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.utakuTakeko],
                    defenders: [],
                    type: 'political',
                    ring: 'air'
                });

                this.player2.clickCard(this.assassinationP2);
                this.player2.clickCard(this.motoYouthStartingInPlay);

                this.player1.clickCard(this.assassinationP1);
                this.player1.clickCard(this.borderRiderP2);

                this.player2.pass();

                this.player1.clickCard(this.utakuTakeko);

                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.discardBorderRider); //Unicorn with 1 glory
                expect(this.player1).not.toBeAbleToSelect(this.motoYouthStartingInPlay); // unicorn with 1 glory but just got discarded
                expect(this.player1).not.toBeAbleToSelect(this.motoYouthStatingDiscarded); // unicorn with 1 glory but was already discarded

                const initialPLayerFate = this.player1.fate;
                this.player1.clickCard(this.discardBorderRider);
                this.player1.clickPrompt('1');

                expect(this.player1.fate).toBe(initialPLayerFate - 3); // 2 fate base + 1 extra fate placed
                expect(this.discardBorderRider.location).toBe('play area');
                expect(this.discardBorderRider.isParticipating()).toBe(false);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Utaku Takeko to recall a distant relative who is a Border Rider'
                );
            });
        });
    });
});
