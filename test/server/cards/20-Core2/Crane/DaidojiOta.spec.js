describe('Daidoji Ota', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['daidoji-ota', 'brash-samurai'],
                    hand: ['a-perfect-cut', 'a-perfect-cut', 'a-perfect-cut', 'a-perfect-cut']
                },
                player2: {
                    inPlay: ['togashi-mitsu'],
                    hand: ['hurricane-punch', 'hurricane-punch', 'hurricane-punch',
                        'ujik-tactics', 'unleash-the-djinn',
                        'fine-katana', 'fine-katana', 'fine-katana', 'togashi-acolyte'
                    ]
                }
            });

            this.ota = this.player1.findCardByName('daidoji-ota');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.cuts = this.player1.filterCardsByName('a-perfect-cut');
            this.punches = this.player2.filterCardsByName('hurricane-punch');
            this.katanas = this.player2.filterCardsByName('fine-katana');
            this.acolyte = this.player2.findCardByName('togashi-acolyte');
            this.tactics = this.player2.findCardByName('ujik-tactics');
            this.djinn = this.player2.findCardByName('unleash-the-djinn');
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
        });

        describe('action ability', function() {
            it('should not work outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.ota);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not work if no participating', function() {
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.brash],
                    defenders: [],
                });

                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ota);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should let opponent choose to discard an event or reveal hand', function() {
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.ota],
                    defenders: [],
                });

                this.player2.pass();
                this.player1.clickCard(this.ota);
                expect(this.player2).toHavePrompt('Daidōji Ota');
                expect(this.player2).toHavePromptButton('Discard an event');
                expect(this.player2).toHavePromptButton('Reveal your hand');
            });

            it('discard', function() {
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.ota],
                    defenders: [],
                });

                this.player2.pass();
                this.player1.clickCard(this.ota);
                this.player2.clickPrompt('Discard an event');
                expect(this.player2).toHavePrompt('Choose a card to discard');
                this.punches.forEach(card => expect(this.player2).toBeAbleToSelect(card));
                this.katanas.forEach(card => expect(this.player2).not.toBeAbleToSelect(card));
                expect(this.player2).toBeAbleToSelect(this.tactics);
                expect(this.player2).toBeAbleToSelect(this.djinn);
                expect(this.player2).not.toBeAbleToSelect(this.acolyte);

                this.player2.clickCard(this.punches[0]);
                expect(this.punches[0].location).toBe('conflict discard pile');
                expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Ota to make player2 discard an event');
                expect(this.getChatLogs(10)).toContain('player2 discards Hurricane Punch');
            });

            it('reveal', function() {
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.ota],
                    defenders: [],
                });

                this.player2.pass();
                this.player1.clickCard(this.ota);
                this.player2.clickPrompt('Reveal your hand');
                expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Ota to make player2 reveal their hand');
                expect(this.getChatLogs(10)).toContain('player2 reveals their hand: Fine Katana, Fine Katana, Fine Katana, Hurricane Punch, Hurricane Punch, Hurricane Punch, Togashi Acolyte, Ujik Tactics and Unleash the Djinn');
            });

            it('should not let opponent choose to discard if they have no events', function() {
                this.punches.forEach(card => this.player2.moveCard(card, 'conflict discard pile'));
                this.player2.moveCard(this.tactics, 'conflict discard pile');
                this.player2.moveCard(this.djinn, 'conflict discard pile');

                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.ota],
                    defenders: [],
                });

                this.player2.pass();
                this.player1.clickCard(this.ota);
                expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Ota to make player2 reveal their hand');
                expect(this.getChatLogs(10)).toContain('player2 reveals their hand: Fine Katana, Fine Katana, Fine Katana and Togashi Acolyte');
            });
        });

        describe('tax', function() {
            it('should tax copies based on number in discard pile', function() {
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.ota],
                    defenders: [this.mitsu],
                });

                let fate = this.player1.fate;
                let fate2 = this.player2.fate;

                this.player2.clickCard(this.punches[0]);
                this.player2.clickCard(this.mitsu);
                expect(this.player2.fate).toBe(fate2);

                this.player1.clickCard(this.cuts[0]);
                this.player1.clickCard(this.ota);
                expect(this.player1.fate).toBe(fate);

                this.player2.clickCard(this.punches[1]);
                this.player2.clickCard(this.mitsu);
                expect(this.player2.fate).toBe(fate2 - 1);

                this.player1.clickCard(this.cuts[1]);
                this.player1.clickCard(this.ota);
                expect(this.player1.fate).toBe(fate);

                this.player2.clickCard(this.punches[2]);
                this.player2.clickCard(this.mitsu);
                expect(this.player2.fate).toBe(fate2 - 3);

                this.player1.clickCard(this.cuts[2]);
                this.player1.clickCard(this.ota);
                expect(this.player1.fate).toBe(fate);
            });

            it('should not tax attachments', function() {
                this.player2.moveCard(this.katanas[1], 'conflict discard pile');
                this.player2.moveCard(this.katanas[2], 'conflict discard pile');

                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.ota],
                    defenders: [this.mitsu],
                });

                let fate2 = this.player2.fate;

                this.player2.clickCard(this.katanas[0]);
                this.player2.clickCard(this.mitsu);
                expect(this.player2.fate).toBe(fate2);
            });

            it('should not tax if no cheap character', function() {
                this.player1.moveCard(this.brash, 'dynasty discard pile');
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.ota],
                    defenders: [this.mitsu],
                });

                let fate = this.player1.fate;
                let fate2 = this.player2.fate;

                this.player2.clickCard(this.punches[0]);
                this.player2.clickCard(this.mitsu);
                expect(this.player2.fate).toBe(fate2);

                this.player1.clickCard(this.cuts[0]);
                this.player1.clickCard(this.ota);
                expect(this.player1.fate).toBe(fate);

                this.player2.clickCard(this.punches[1]);
                this.player2.clickCard(this.mitsu);
                expect(this.player2.fate).toBe(fate2);

                this.player1.clickCard(this.cuts[1]);
                this.player1.clickCard(this.ota);
                expect(this.player1.fate).toBe(fate);

                this.player2.clickCard(this.punches[2]);
                this.player2.clickCard(this.mitsu);
                expect(this.player2.fate).toBe(fate2);

                this.player1.clickCard(this.cuts[2]);
                this.player1.clickCard(this.ota);
                expect(this.player1.fate).toBe(fate);
            });
        });

        // it('should search your top 4 cards', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.rusumi],
        //         defenders: [],
        //         type: 'military'
        //     });
        //     this.player2.pass();
        //     this.player1.clickCard(this.rusumi);
        //     expect(this.player1).toHavePrompt('Choose a character to put into play');
        //     expect(this.player1).toHaveDisabledPromptButton('Brash Samurai');
        //     expect(this.player1).toHaveDisabledPromptButton('Paragon of Grace');
        //     expect(this.player1).toHaveDisabledPromptButton('Otomo Sycophant');
        //     expect(this.player1).toHavePromptButton('Doji Whisperer');
        //     expect(this.player1).toHavePromptButton('Take nothing');
        // });

        // it('should put the chosen character into the conflict', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.rusumi],
        //         defenders: [],
        //         type: 'military'
        //     });
        //     this.player2.pass();
        //     this.player1.clickCard(this.rusumi);
        //     this.player1.clickPrompt('Doji Whisperer');
        //     expect(this.game.currentConflict.attackers).toContain(this.whisperer);
        //     expect(this.whisperer.isHonored).toBe(true);
        // });

        // it('chat messages', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.rusumi],
        //         defenders: [],
        //         type: 'military'
        //     });
        //     this.player2.pass();
        //     this.player1.clickCard(this.rusumi);
        //     this.player1.clickPrompt('Doji Whisperer');

        //     expect(this.getChatLogs(6)).toContain('player1 uses Kakita Rusumi to search their dynasty deck for a character to put into play');
        //     expect(this.getChatLogs(6)).toContain('player1 puts Doji Whisperer into play honored');
        // });

        // it('chat messages - taking nothing', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.rusumi],
        //         defenders: [],
        //         type: 'military'
        //     });
        //     this.player2.pass();
        //     this.player1.clickCard(this.rusumi);
        //     this.player1.clickPrompt('Take nothing');

        //     expect(this.getChatLogs(6)).toContain('player1 uses Kakita Rusumi to search their dynasty deck for a character to put into play');
        //     expect(this.getChatLogs(6)).toContain('player1 takes nothing');
        // });

        // it('should shuffle your dynasty deck', function() {
        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.rusumi],
        //         defenders: [],
        //         type: 'military'
        //     });
        //     this.player2.pass();
        //     this.player1.clickCard(this.rusumi);
        //     this.player1.clickPrompt('Doji Whisperer');
        //     expect(this.getChatLogs(6)).toContain('player1 is shuffling their dynasty deck');
        // });
    });
});
