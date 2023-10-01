describe('Kakita Blade 2', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['daidoji-ambusher', 'doji-whisperer', 'brash-samurai'],
                    hand: ['kakita-blade-2', 'kakita-blade-2', 'a-perfect-cut']
                },
                player2: {
                    inPlay: ['bayushi-dairu', 'doji-challenger'],
                    hand: ['kakita-blade-2', 'kakita-blade-2'],
                }
            });
            this.ambusher = this.player1.findCardByName('daidoji-ambusher');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.dairu = this.player2.findCardByName('bayushi-dairu');
            this.cut = this.player1.findCardByName('a-perfect-cut');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.blade1 = this.player1.filterCardsByName('kakita-blade-2')[0];
            this.blade2 = this.player1.filterCardsByName('kakita-blade-2')[1];
            this.blade3 = this.player2.filterCardsByName('kakita-blade-2')[0];
            this.blade4 = this.player2.filterCardsByName('kakita-blade-2')[1];

            this.brash.honor();
            this.player1.playAttachment(this.blade1, this.ambusher);
            this.player2.playAttachment(this.blade3, this.challenger);
            this.player1.playAttachment(this.blade2, this.brash);
            this.player2.playAttachment(this.blade4, this.dairu);
        });

        it('attacking - should give you an additional action as the first action', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.ambusher],
                defenders: [this.dairu]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ambusher);

            this.player1.clickCard(this.ambusher);

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.ambusher);
            this.player1.clickCard(this.dairu);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('two when attacking - should give you two actions', function () {            
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash, this.ambusher],
                defenders: [this.dairu]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ambusher);
            expect(this.player1).toBeAbleToSelect(this.brash);

            this.player1.clickCard(this.ambusher);
            this.player1.clickCard(this.brash);

            expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Ambusher\'s gained ability from Kakita Blade to take an action at the start of the conflict');
            expect(this.getChatLogs(10)).toContain('player1 uses Brash Samurai\'s gained ability from Kakita Blade to take an action at the start of the conflict');

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.ambusher);
            this.player1.clickCard(this.dairu);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.cut);
            this.player1.clickCard(this.brash);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('each player triggers, should still give first action to player1', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.ambusher],
                defenders: [this.challenger]
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ambusher);
            this.player1.clickCard(this.ambusher);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.challenger);
            this.player2.clickCard(this.challenger);

            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
