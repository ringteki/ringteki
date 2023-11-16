describe('Let Him Go By', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['promising-kohai', 'daidoji-akikore', 'kakita-yoshi', 'bayushi-yojiro', 'matsu-berserker'],
                    hand: [
                        'destiny-revealed',
                        'dutiful-assistant',
                        'way-of-the-crane',
                        'one-with-the-sea',
                        'steward-of-law'
                    ]
                },
                player2: {
                    inPlay: ['kakita-toshimoko', 'shiba-tsukune', 'shosuro-sadako'],
                    hand: ['duel-to-the-death', 'let-him-go-by', 'let-him-go-by']
                },
                gameMode: 'emerald'
            });

            this.kohai = this.player1.findCardByName('promising-kohai');
            this.destiny = this.player1.findCardByName('destiny-revealed');
            this.akikore = this.player1.findCardByName('daidoji-akikore');

            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.yojiro = this.player1.findCardByName('bayushi-yojiro');
            this.assistant = this.player1.findCardByName('dutiful-assistant');
            this.oneWithTheSea = this.player1.findCardByName('one-with-the-sea');
            this.stewardOfLaw = this.player1.findCardByName('steward-of-law');

            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.tsukune = this.player2.findCardByName('shiba-tsukune');
            this.sadako = this.player2.findCardByName('shosuro-sadako');
            this.dttd = this.player2.findCardByName('duel-to-the-death');
            this.goBy = this.player2.filterCardsByName('let-him-go-by')[0];
            this.goBy2 = this.player2.filterCardsByName('let-him-go-by')[1];
        });

        describe('Duel Part', function () {
            it('shouldnt fire on non-duel abilities', function () {
                let hand = this.player1.hand.length;

                this.akikore.dishonor();

                this.player1.clickCard(this.crane);
                this.player1.clickCard(this.akikore);

                expect(this.player2).toHavePrompt('Action Window');
            });

            it('duel challenge', function () {
                let hand = this.player1.hand.length;

                this.akikore.dishonor();

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akikore, this.yoshi],
                    defenders: [this.toshimoko, this.tsukune]
                });

                this.player2.clickCard(this.dttd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.akikore);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kohai);
                this.player1.clickCard(this.kohai);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.goBy);

                this.player2.clickCard(this.goBy);

                expect(this.player1.hand.length).toBe(hand - 1);

                expect(this.getChatLogs(10)).toContain(
                    'player2 plays Let Him Go By to make player1 discard 1 card at random'
                );
            });

            it('duel focus', function () {
                let hand = this.player1.hand.length;

                this.akikore.dishonor();

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akikore, this.yoshi],
                    defenders: [this.toshimoko, this.tsukune],
                    type: 'political'
                });

                this.player2.clickCard(this.dttd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.akikore);

                this.player1.pass();

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.player1.clickCard(this.akikore);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.goBy);

                this.player2.clickCard(this.goBy);

                expect(this.player1.hand.length).toBe(hand - 1);

                expect(this.getChatLogs(10)).toContain(
                    'player2 plays Let Him Go By to make player1 discard 1 card at random'
                );
            });

            it('duel strike', function () {
                let hand = this.player1.hand.length;

                this.akikore.dishonor();

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akikore, this.yoshi],
                    defenders: [this.toshimoko, this.tsukune],
                    type: 'political'
                });

                this.player2.clickCard(this.dttd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.akikore);

                this.player1.pass();

                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');

                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.destiny);
                this.player1.clickCard(this.destiny);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.goBy);

                this.player2.clickCard(this.goBy);

                expect(this.player1.hand.length).toBe(hand - 2);

                expect(this.getChatLogs(10)).toContain(
                    'player2 plays Let Him Go By to make player1 discard 1 card at random'
                );
            });

            it('max 1 per duel', function () {
                let hand = this.player1.hand.length;

                this.akikore.dishonor();

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akikore, this.yoshi],
                    defenders: [this.toshimoko, this.tsukune]
                });

                this.player2.clickCard(this.dttd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.akikore);

                this.player1.clickCard(this.kohai);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.goBy);
                expect(this.player2).toBeAbleToSelect(this.goBy2);
                this.player2.clickCard(this.goBy);
                expect(this.player1.hand.length).toBe(hand - 1);
                expect(this.getChatLogs(10)).toContain(
                    'player2 plays Let Him Go By to make player1 discard 1 card at random'
                );

                expect(this.player2).toHavePrompt('Honor Bid');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.player1.clickCard(this.akikore);

                expect(this.player2).not.toHavePrompt('Triggered Abilities');
            });
        });

        describe('anti-movement reaction', function () {
            it('bows a character that moves into a conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akikore],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.oneWithTheSea);
                this.player1.clickCard(this.yoshi);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.goBy);
                expect(this.getChatLogs(10)).toContain('player2 plays Let Him Go By to bow Kakita Yoshi');
            });

            it('bows a character that is played into a conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akikore],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.stewardOfLaw);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');

                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.goBy);
                expect(this.getChatLogs(10)).toContain('player2 plays Let Him Go By to bow Steward of Law');
            });
        });
    });
});