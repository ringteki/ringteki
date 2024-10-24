describe('Diligent Chaperone', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['diligent-chaperone', 'doji-whisperer', 'brash-samurai'],
                    hand: ['resourcefulness']
                },
                player2: {
                    inPlay: ['bayushi-dairu'],
                    hand: ['way-of-the-scorpion', 'herald-of-jade']
                }
            });
            this.yojimbo = this.player1.findCardByName('diligent-chaperone');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.resourcefulness = this.player1.findCardByName('resourcefulness');

            this.dairu = this.player2.findCardByName('bayushi-dairu');
            this.scorp = this.player2.findCardByName('way-of-the-scorpion');
            this.herald = this.player2.findCardByName('herald-of-jade');

            this.brash.honor();
        });

        it('cannot attack', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.brash, this.yojimbo],
                defenders: [this.dairu]
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.yojimbo.isParticipating()).toBe(false);
        });

        it('rehonors an honored character who is dishonored', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.brash],
                defenders: [this.dairu]
            });

            this.player2.clickCard(this.scorp);
            this.player2.clickCard(this.brash);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            this.player1.clickCard(this.yojimbo);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brash.isHonored).toBe(true);
            expect(this.scorp.location).toBe('conflict discard pile');
            expect(this.yojimbo.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 honors Brash Samurai');
        });

        it('rehonors an honored character after token is removed', function () {
            this.player1.pass();
            this.player2.clickCard(this.herald);
            this.player2.clickPrompt('0');
            this.player2.clickCard(this.herald);
            this.player2.clickCard(this.brash);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            this.player1.clickCard(this.yojimbo);
            expect(this.brash.isHonored).toBe(true);
            expect(this.yojimbo.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 honors Brash Samurai');
        });

        it('does not work while bowed', function () {
            this.yojimbo.bow();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.brash],
                defenders: [this.dairu]
            });

            expect(this.brash.isHonored).toBe(true);
            this.player2.clickCard(this.scorp);
            this.player2.clickCard(this.brash);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.brash.isHonored).toBe(false);
        });

        it('does not work when an orginary character is dishonored', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.brash],
                defenders: [this.dairu]
            });

            this.player2.clickCard(this.scorp);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('rehonors an honored character when their token is moved', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.brash],
                defenders: [this.dairu]
            });

            expect(this.dairu.isHonored).toBe(false);
            this.player2.clickCard(this.dairu);
            this.player2.clickCard(this.brash);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            this.player1.clickCard(this.yojimbo);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brash.isHonored).toBe(true);
            expect(this.dairu.isHonored).toBe(true);
            expect(this.yojimbo.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 honors Brash Samurai');
        });

        it('should cancel dishonoring via fire ring', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dairu],
                defenders: [],
                ring: 'fire'
            });

            this.noMoreActions();

            this.player2.clickCard(this.brash);
            this.player2.clickPrompt('Dishonor Brash Samurai');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            this.player1.clickCard(this.yojimbo);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.brash.isHonored).toBe(true);
            expect(this.yojimbo.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 honors Brash Samurai');
        });

        it('should cancel dishonoring via cost', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.brash],
                defenders: [this.dairu]
            });

            this.player2.pass();
            this.player1.clickCard(this.resourcefulness);
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.brash);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            this.player1.clickCard(this.yojimbo);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.brash.isHonored).toBe(true);
            expect(this.whisperer.isHonored).toBe(true);

            expect(this.getChatLogs(10)).toContain('player1 honors Brash Samurai');
            expect(this.getChatLogs(10)).toContain(
                'player1 plays Resourcefulness, dishonoring Brash Samurai to honor Doji Whisperer'
            );
        });
    });
});