describe('Rustling Whispers', function () {
    integration(function () {
        describe('Rustling Whispers\'s persistent ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDeck: ['akodo-toturi'],
                        dynastyDiscard: [
                            'shintao-monastery',
                            'shintao-monastery',
                            'shintao-monastery',
                            'shintao-monastery'
                        ],
                        inPlay: ['tattooed-wanderer', 'togashi-mitsu-2'],
                        hand: [
                            'seeker-of-knowledge',
                            'fine-katana',
                            'charge',
                            'restored-heirloom',
                            'chasing-the-sun'
                        ]
                    },
                    player2: {
                        role: 'keeper-of-water',
                        provinces: ['pledge-of-loyalty', 'entrenched-position'],
                        dynastyDiscard: ['rustling-whispers'],
                        inPlay: [],
                        hand: ['display-of-power'],
                        dynastyDeck: ['keeper-initiate']
                    }
                });
                this.player1.placeCardInProvince(
                    this.player1.findCardByName(
                        'shintao-monastery',
                        'dynasty discard pile'
                    ),
                    'province 1'
                );
                this.player1.placeCardInProvince(
                    this.player1.findCardByName(
                        'shintao-monastery',
                        'dynasty discard pile'
                    ),
                    'province 2'
                );
                this.player1.placeCardInProvince(
                    this.player1.findCardByName(
                        'shintao-monastery',
                        'dynasty discard pile'
                    ),
                    'province 3'
                );
                this.player1.placeCardInProvince(
                    this.player1.findCardByName(
                        'shintao-monastery',
                        'dynasty discard pile'
                    ),
                    'province 4'
                );

                this.player2.placeCardInProvince(
                    this.player2.findCardByName(
                        'rustling-whispers',
                        'dynasty discard pile'
                    ),
                    'province 1'
                );

                this.game.checkGameState(true);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['togashi-mitsu-2'],
                    ring: 'earth',
                    defenders: [],
                    province: 'pledge-of-loyalty'
                });
                this.player2.pass();
                this.player1.clickCard('seeker-of-knowledge');
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Home');
                this.player2.pass();
            });

            describe('When the province is not broken', function () {
                it('should cancel the effects of the conflict ring', function () {
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Action Window');
                    expect(this.getChatLogs(1)).toContain(
                        'Rustling Whispers cancels the ring effect'
                    );
                });

                it('should cancel conflict ring resolution due to card effects', function () {
                    this.player1.pass();
                    this.player2.pass();
                    this.player2.clickCard('display-of-power');
                    expect(this.player1).toHavePrompt('Action Window');
                    expect(this.getChatLogs(1)).toContain(
                        'Rustling Whispers cancels the ring effect'
                    );
                });

                //Repro: Togashi Mitsu (2)
                it('should cancel other ring effects resolved by cards', function () {
                    this.player1.clickCard('togashi-mitsu-2');
                    this.player1.clickRing('fire');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.getChatLogs(3)).toContain(
                        'Rustling Whispers cancels the ring effect'
                    );
                });

                it('should take effect before interrupts can trigger', function () {
                    this.player1.clickCard('togashi-mitsu-2');
                    this.player1.clickRing('water');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.getChatLogs(3)).toContain(
                        'Rustling Whispers cancels the ring effect'
                    );
                });
            });

            describe('when the province is broken', function () {
                beforeEach(function () {
                    this.player1.clickCard('fine-katana');
                    this.player1.clickCard('togashi-mitsu-2');
                    this.player2.pass();
                    this.player1.pass();
                });

                describe('when the attacker discards the holding from the province', function () {
                    it('should not cancel the effects of the conflict ring', function () {
                        this.player2.pass();
                        this.player1.clickPrompt('Yes');
                        expect(this.player1).toHavePrompt('Earth Ring');
                    });

                    it('should not cancel conflict ring resolution due to card effects', function () {
                        this.player2.clickCard('display-of-power');
                        this.player1.clickPrompt('Yes');
                        expect(this.player2).toHavePrompt('Earth Ring');
                    });
                });

                describe('when the attacker does not discard the holding from the province', function () {
                    it('should cancel the effects of the conflict ring', function () {
                        this.player2.pass();
                        this.player1.clickPrompt('No');
                        expect(this.player1).toHavePrompt('Action Window');
                        expect(this.getChatLogs(1)).toContain(
                            'Rustling Whispers cancels the ring effect'
                        );
                    });

                    it('should cancel conflict ring resolution due to card effects', function () {
                        this.player2.clickCard('display-of-power');
                        this.player1.clickPrompt('No');
                        expect(this.player1).toHavePrompt('Action Window');
                        expect(this.getChatLogs(1)).toContain(
                            'Rustling Whispers cancels the ring effect'
                        );
                    });
                });
            });

            describe('when the conflict is moved elsewhere', function () {
                beforeEach(function () {
                    this.player1.clickCard('chasing-the-sun');
                    this.player1.clickCard(
                        this.player2.findCardByName('entrenched-position')
                    );
                    this.player2.pass();
                });

                it('should not cancel the effects of the conflict ring', function () {
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Earth Ring');
                });

                it('should not cancel conflict ring resolution due to card effects', function () {
                    this.player1.pass();
                    this.player2.clickCard('display-of-power');
                    expect(this.player2).toHavePrompt('Earth Ring');
                });

                it('should not cancel other ring effects resolved by cards', function () {
                    this.player1.clickCard('togashi-mitsu-2');
                    this.player1.clickRing('fire');
                    expect(this.player1).toHavePrompt('Fire Ring');
                });
            });
        });

        describe('Rustling Whispers\'s province filling ability', function () {
            // @TODO BASED ON WESTERN WIND

            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 30,
                        dynastyDiscard: [
                            'rustling-whispers',
                            'imperial-storehouse',
                            'a-season-of-war',
                            'dispatch-to-nowhere',
                            'aranat'
                        ],
                        provinces: [
                            'manicured-garden',
                            'endless-plains',
                            'fertile-fields',
                            'magistrate-station'
                        ]
                    }
                });

                this.player1.reduceDeckToNumber('dynasty deck', 0);
                this.rustlingWhispers = this.player1.findCardByName(
                    'rustling-whispers',
                    'dynasty discard pile'
                );

                this.player1.placeCardInProvince(
                    this.rustlingWhispers,
                    'province 1'
                );
                this.storehouse = this.player1.moveCard(
                    'imperial-storehouse',
                    'dynasty deck'
                );
                this.season = this.player1.moveCard(
                    'a-season-of-war',
                    'dynasty deck'
                );
                this.dispatch = this.player1.moveCard(
                    'dispatch-to-nowhere',
                    'dynasty deck'
                );

                this.p1 = this.player1.findCardByName('manicured-garden');
            });

            describe('when the top card is a holding', function () {
                beforeEach(function () {
                    this.imperialStorehouse = this.player1.moveCard(
                        'imperial-storehouse',
                        'dynasty deck'
                    );
                    this.player1.clickCard(this.rustlingWhispers);
                });

                it('pay 1 honor and discard the holding', function () {
                    expect(this.imperialStorehouse.location).toBe(
                        'dynasty discard pile'
                    );
                    expect(this.getChatLogs(5)).toContain(
                        'player1 uses Rustling Whispers, losing 1 honor to refill their province — but the spirits are angry and destroy Imperial Storehouse'
                    );
                });
            });

            describe('when the top card is a character', function () {
                beforeEach(function () {
                    this.aranat = this.player1.moveCard(
                        'aranat',
                        'dynasty deck'
                    );
                    this.player1.clickCard(this.rustlingWhispers);
                });

                it('pay 1 honor and refill the province faceup with the character', function () {
                    expect(this.aranat.location).toBe('province 1');
                    expect(this.getChatLogs(5)).toContain(
                        'player1 uses Rustling Whispers, losing 1 honor to refill their province — the spirits are calm, and let them find Aranat'
                    );
                });
            });

            describe('when the top card is a dynasty event', function () {
                beforeEach(function () {
                    this.dispatchToNowhere = this.player1.moveCard(
                        'dispatch-to-nowhere',
                        'dynasty deck'
                    );
                    this.player1.clickCard(this.rustlingWhispers);
                });

                it('pay 1 honor and refill the province faceup with the event', function () {
                    expect(this.dispatchToNowhere.location).toBe('province 1');
                    expect(this.getChatLogs(5)).toContain(
                        'player1 uses Rustling Whispers, losing 1 honor to refill their province — the spirits are silent, and bring Dispatch to Nowhere'
                    );
                });
            });

            describe('when the top card is a dynasty event with rally', function () {
                beforeEach(function () {
                    this.dispatchToNowhere = this.player1.moveCard(
                        'dispatch-to-nowhere',
                        'dynasty deck'
                    );
                    this.seasonOfWar = this.player1.moveCard(
                        'a-season-of-war',
                        'dynasty deck'
                    );
                    this.player1.clickCard(this.rustlingWhispers);
                });

                it('pay 1 honor and refill the province faceup with the event but do not resolve rally', function () {
                    expect(this.seasonOfWar.location).toBe('province 1');
                    expect(this.dispatch.location).toBe('dynasty deck');
                    expect(this.getChatLogs(5)).toContain(
                        'player1 uses Rustling Whispers, losing 1 honor to refill their province — the spirits are silent, and bring A Season of War'
                    );
                });
            });
        });
    });
});
