describe('Governors Spy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['governor-s-spy'],
                    dynastyDiscard: ['doji-whisperer', 'doji-challenger', 'doji-kuwanan', 'daidoji-uji', 'kakita-toshimoko', 'kakita-yuri']
                },
                player2: {
                    inPlay: ['bayushi-liar', 'alibi-artist', 'blackmail-artist', 'bayushi-manipulator', 'bayushi-shoju', 'yogo-asami'],
                    dynastyDiscard: ['hantei-xxxviii']
                }
            });

            this.spy = this.player1.findCardByName('governor-s-spy');

            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');
            this.challenger = this.player1.placeCardInProvince('doji-challenger', 'province 2');
            this.kuwanan = this.player1.placeCardInProvince('doji-kuwanan', 'province 3');
            this.uji = this.player1.placeCardInProvince('daidoji-uji', 'province 4');
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.yuri = this.player1.findCardByName('kakita-yuri');

            this.liar = this.player2.placeCardInProvince('bayushi-liar', 'province 1');
            this.alibi = this.player2.placeCardInProvince('alibi-artist', 'province 2');
            this.blackmail = this.player2.placeCardInProvince('blackmail-artist', 'province 3');
            this.manipulator = this.player2.placeCardInProvince('bayushi-manipulator', 'province 4');
            this.shoju = this.player2.findCardByName('bayushi-shoju');
            this.asami = this.player2.findCardByName('yogo-asami');

            this.p1_1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.p1_2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.p1_3 = this.player1.findCardByName('shameful-display', 'province 3');
            this.p1_4 = this.player1.findCardByName('shameful-display', 'province 4');
            this.p1_4 = this.player1.findCardByName('shameful-display', 'province 4');
            this.p1_Stronghold = this.player1.findCardByName('shameful-display', 'stronghold province');

            this.p2_1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.p2_2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.p2_3 = this.player2.findCardByName('shameful-display', 'province 3');
            this.p2_4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.p2_4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.p2_Stronghold = this.player2.findCardByName('shameful-display', 'stronghold province');
        });

        it('should not work out of conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.spy);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should let you choose a player', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.spy],
                defenders: [],
                type: 'political'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.spy);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');
        });

        it('should immediately flip that players dynasty cards facedown', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.spy],
                defenders: [],
                type: 'political'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.spy);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');

            this.player1.clickPrompt('player2');
            expect(this.liar.facedown).toBe(true);
            expect(this.alibi.facedown).toBe(true);
            expect(this.blackmail.facedown).toBe(true);
            expect(this.manipulator.facedown).toBe(true);

            expect(this.getChatLogs(3)).toContain('player1 uses Governor\'s Spy to to turn facedown and rearrange all of player2\'s dynasty cards');
        });

        it('should prompt you to put each card into a province, forcing you to give each province at least one card and then move the cards', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.spy],
                defenders: [],
                type: 'political'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.spy);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');
            this.player1.clickPrompt('player2');

            expect(this.player1).toHavePrompt('Choose a province for Alibi Artist');
            expect(this.player1).toBeAbleToSelect(this.p2_1);
            expect(this.player1).toBeAbleToSelect(this.p2_2);
            expect(this.player1).toBeAbleToSelect(this.p2_3);
            expect(this.player1).toBeAbleToSelect(this.p2_4);
            expect(this.player1).not.toBeAbleToSelect(this.p2_Stronghold);

            this.player1.clickCard(this.p2_4);
            expect(this.getChatLogs(3)).toContain('player1 places a card');

            expect(this.player1).toHavePrompt('Choose a province for Bayushi Liar');
            expect(this.player1).toBeAbleToSelect(this.p2_1);
            expect(this.player1).toBeAbleToSelect(this.p2_2);
            expect(this.player1).toBeAbleToSelect(this.p2_3);
            expect(this.player1).not.toBeAbleToSelect(this.p2_4);
            expect(this.player1).not.toBeAbleToSelect(this.p2_Stronghold);

            this.player1.clickCard(this.p2_1);
            expect(this.getChatLogs(3)).toContain('player1 places a card');

            expect(this.player1).toHavePrompt('Choose a province for Bayushi Manipulator');
            expect(this.player1).not.toBeAbleToSelect(this.p2_1);
            expect(this.player1).toBeAbleToSelect(this.p2_2);
            expect(this.player1).toBeAbleToSelect(this.p2_3);
            expect(this.player1).not.toBeAbleToSelect(this.p2_4);
            expect(this.player1).not.toBeAbleToSelect(this.p2_Stronghold);

            this.player1.clickCard(this.p2_3);
            expect(this.getChatLogs(3)).toContain('player1 places a card');

            expect(this.player1).toHavePrompt('Choose a province for Blackmail Artist');
            expect(this.player1).not.toBeAbleToSelect(this.p2_1);
            expect(this.player1).toBeAbleToSelect(this.p2_2);
            expect(this.player1).not.toBeAbleToSelect(this.p2_3);
            expect(this.player1).not.toBeAbleToSelect(this.p2_4);
            expect(this.player1).not.toBeAbleToSelect(this.p2_Stronghold);

            this.player1.clickCard(this.p2_2);
            expect(this.getChatLogs(3)).toContain('player1 places a card');
            expect(this.getChatLogs(3)).toContain('player1 had finished placing cards');

            expect(this.alibi.location).toBe('province 4');
            expect(this.liar.location).toBe('province 1');
            expect(this.manipulator.location).toBe('province 3');
            expect(this.blackmail.location).toBe('province 2');
        });
    });
});