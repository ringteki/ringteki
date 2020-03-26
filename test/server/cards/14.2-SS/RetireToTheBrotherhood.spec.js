describe('Retire To The Brotherhood', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'shiba-tsukune', 'bayushi-shoju', 'doji-challenger'],
                    dynastyDiscard: ['bayushi-shoju', 'shiba-tsukune', 'imperial-storehouse', 'windswept-yurt', 'dispatch-to-nowhere', 'daidoji-netsu'],
                    hand: ['reprieve']
                },
                player2: {
                    role: ['keeper-of-void'],
                    inPlay: ['doji-whisperer', 'daidoji-uji'],
                    dynastyDiscard: ['kakita-yoshi', 'kakita-toshimoko', 'daidoji-kageyu', 'moto-chagatai'],
                    provinces: ['retire-to-the-brotherhood']
                }
            });

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.tsukune = this.player1.findCardByName('shiba-tsukune', 'play area'); //unique not leaving play
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.shoju = this.player1.findCardByName('bayushi-shoju', 'play area'); //unique leaving play

            this.tsukune2 = this.player1.findCardByName('shiba-tsukune', 'dynasty discard pile');
            this.shoju2 = this.player1.findCardByName('bayushi-shoju', 'dynasty discard pile');
            this.storehouse = this.player1.findCardByName('imperial-storehouse');
            this.yurt = this.player1.findCardByName('windswept-yurt');
            this.dispatch = this.player1.findCardByName('dispatch-to-nowhere');
            this.netsu = this.player1.findCardByName('daidoji-netsu');

            this.player1.reduceDeckToNumber('dynasty deck', 0);

            this.player1.moveCard(this.storehouse, 'dynasty deck');
            this.player1.moveCard(this.shoju2, 'dynasty deck');
            this.player1.moveCard(this.tsukune2, 'dynasty deck');
            this.player1.moveCard(this.yurt, 'dynasty deck');
            this.player1.moveCard(this.dispatch, 'dynasty deck');

            this.retire = this.player2.findCardByName('retire-to-the-brotherhood');

            this.tsukune.fate = 1;
            this.reprieve = this.player1.findCardByName('reprieve');

            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            this.uji = this.player2.findCardByName('daidoji-uji');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.kageyu = this.player2.findCardByName('daidoji-kageyu');
            this.chagatai = this.player2.findCardByName('moto-chagatai');

            this.player2.reduceDeckToNumber('dynasty deck', 0);
            this.player2.player.dynastyDiscardPile.each(a => this.player2.moveCard(a, 'dynasty deck'));
        });

        it('base case', function() {
            this.noMoreActions();
            expect(this.retire.facedown).toBe(true);

            this.initiateConflict({
                attackers: [this.berserker],
                province: this.retire,
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.retire);
            this.player2.clickCard(this.retire);
            expect(this.berserker.location).toBe('dynasty discard pile');
            expect(this.tsukune.location).not.toBe('dynasty discard pile');
            expect(this.shoju.location).toBe('dynasty discard pile');
            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
            expect(this.uji.location).toBe('dynasty discard pile');

            expect(this.getChatLogs(10)).toContain('player2 uses Retire to the Brotherhood to discard Doji Whisperer, Daidoji Uji, Matsu Berserker, Bayushi Shoju and Doji Challenger');
            expect(this.getChatLogs(10)).toContain('player2 reveals Moto Chagatai and Daidoji Kageyu');
            expect(this.getChatLogs(10)).toContain('player1 reveals Dispatch to Nowhere, Windswept Yurt, Shiba Tsukune, Bayushi Shoju and Imperial Storehouse');
            expect(this.getChatLogs(10)).toContain('player2 puts Moto Chagatai and Daidoji Kageyu into play');
            expect(this.getChatLogs(10)).toContain('player1 puts Bayushi Shoju into play');
            expect(this.getChatLogs(10)).toContain('player2 is shuffling their dynasty deck');
            expect(this.getChatLogs(10)).toContain('player1 is shuffling their dynasty deck');

            expect(this.shoju2.location).toBe('play area');
            expect(this.chagatai.location).toBe('play area');
            expect(this.kageyu.location).toBe('play area');

            expect(this.game.currentConflict.attackers).not.toContain(this.shoju2);
            expect(this.game.currentConflict.defenders).not.toContain(this.chagatai);
            expect(this.game.currentConflict.defenders).not.toContain(this.kageyu);
        });

        it('stopping leaving play', function() {
            this.player1.playAttachment(this.reprieve, this.berserker);
            this.noMoreActions();
            expect(this.retire.facedown).toBe(true);

            this.initiateConflict({
                attackers: [this.berserker],
                province: this.retire,
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.retire);
            this.player2.clickCard(this.retire);
            expect(this.getChatLogs(1)).toContain('player2 uses Retire to the Brotherhood to discard Doji Whisperer, Daidoji Uji, Matsu Berserker, Bayushi Shoju and Doji Challenger');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.reprieve);
            this.player1.clickCard(this.reprieve);
            expect(this.berserker.location).not.toBe('dynasty discard pile');
            expect(this.tsukune.location).not.toBe('dynasty discard pile');
            expect(this.shoju.location).toBe('dynasty discard pile');
            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
            expect(this.uji.location).toBe('dynasty discard pile');

            expect(this.getChatLogs(10)).toContain('player1 uses Reprieve to prevent Matsu Berserker from leaving play');
            expect(this.getChatLogs(10)).toContain('player2 reveals Moto Chagatai and Daidoji Kageyu');
            expect(this.getChatLogs(10)).toContain('player1 reveals Dispatch to Nowhere, Windswept Yurt, Shiba Tsukune and Bayushi Shoju');
            expect(this.getChatLogs(10)).toContain('player2 puts Moto Chagatai and Daidoji Kageyu into play');
            expect(this.getChatLogs(10)).toContain('player1 puts Bayushi Shoju into play');
            expect(this.getChatLogs(10)).toContain('player2 is shuffling their dynasty deck');
            expect(this.getChatLogs(10)).toContain('player1 is shuffling their dynasty deck');

            expect(this.shoju2.location).toBe('play area');
            expect(this.chagatai.location).toBe('play area');
            expect(this.kageyu.location).toBe('play area');
        });

        it('Netsu + What happens if you don\'t discard anyone, + what happens if all you do is flip unique dupes', function() {
            this.player1.moveCard(this.netsu, 'play area');
            this.noMoreActions();
            expect(this.retire.facedown).toBe(true);

            this.initiateConflict({
                attackers: [this.berserker],
                province: this.retire,
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.retire);
            this.player2.clickCard(this.retire);

            expect(this.berserker.location).not.toBe('dynasty discard pile');
            expect(this.netsu.location).toBe('dynasty discard pile');
            expect(this.tsukune.location).not.toBe('dynasty discard pile');
            expect(this.shoju.location).not.toBe('dynasty discard pile');
            expect(this.challenger.location).not.toBe('dynasty discard pile');
            expect(this.dojiWhisperer.location).not.toBe('dynasty discard pile');
            expect(this.uji.location).not.toBe('dynasty discard pile');

            expect(this.getChatLogs(10)).toContain('player2 uses Retire to the Brotherhood to discard Doji Whisperer, Daidoji Uji, Matsu Berserker, Bayushi Shoju, Doji Challenger and Daidoji Netsu');
            expect(this.getChatLogs(10)).toContain('player1 reveals Dispatch to Nowhere, Windswept Yurt and Shiba Tsukune');
            expect(this.getChatLogs(10)).toContain('player2 is shuffling their dynasty deck');
            expect(this.getChatLogs(10)).toContain('player1 is shuffling their dynasty deck');

            expect(this.shoju2.location).toBe('dynasty deck');
            expect(this.chagatai.location).toBe('dynasty deck');
            expect(this.kageyu.location).toBe('dynasty deck');
        });

        it('reported bug', function() {
            this.noMoreActions();
            expect(this.retire.facedown).toBe(true);

            this.initiateConflict({
                attackers: [this.berserker],
                province: this.retire,
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.retire);
            this.player2.clickCard(this.retire);
            expect(this.berserker.location).toBe('dynasty discard pile');
            expect(this.tsukune.location).not.toBe('dynasty discard pile');
            expect(this.shoju.location).toBe('dynasty discard pile');
            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
            expect(this.uji.location).toBe('dynasty discard pile');

            expect(this.shoju2.location).toBe('play area');
            expect(this.chagatai.location).toBe('play area');
            expect(this.kageyu.location).toBe('play area');

            expect(this.game.currentConflict.attackers).not.toContain(this.shoju2);
            expect(this.game.currentConflict.attackers).not.toContain(this.chagatai);
            expect(this.game.currentConflict.attackers).not.toContain(this.kageyu);
            expect(this.game.currentConflict.defenders).not.toContain(this.shoju2);
            expect(this.game.currentConflict.defenders).not.toContain(this.chagatai);
            expect(this.game.currentConflict.defenders).not.toContain(this.kageyu);

            expect(this.shoju2.controller).toBe(this.player1.player);
            expect(this.kageyu.controller).toBe(this.player2.player);
            expect(this.chagatai.controller).toBe(this.player2.player);

            expect(this.player1.player.cardsInPlay).toContain(this.shoju2);
            expect(this.player2.player.cardsInPlay).not.toContain(this.shoju2);
            expect(this.player1.player.cardsInPlay).not.toContain(this.kageyu);
            expect(this.player2.player.cardsInPlay).toContain(this.kageyu);
            expect(this.player1.player.cardsInPlay).not.toContain(this.chagatai);
            expect(this.player2.player.cardsInPlay).toContain(this.chagatai);
        });
    });
});
