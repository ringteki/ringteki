describe('Conduit of the Elements', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['conduit-of-the-elements'],
                    hand: ['hurricane-punch', 'iron-foundations-stance', 'kyofuki-s-hammer']
                },
                player2: {
                    inPlay: []
                }
            });

            this.conduit = this.player1.findCardByName('conduit-of-the-elements');
            this.punch = this.player1.findCardByName('hurricane-punch');
            this.stance = this.player1.findCardByName('iron-foundations-stance');
            this.hammer = this.player1.findCardByName('kyofuki-s-hammer');
        });

        it('should add elements to rings if you play a kiho', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.conduit],
                defenders: [],
                ring: 'water'
            });
            this.player2.pass();
            expect(this.game.rings.water.hasElement('water')).toBe(true);
            expect(this.game.rings.water.hasElement('air')).toBe(false);

            this.player1.clickCard(this.punch);
            this.player1.clickCard(this.conduit);
            this.player1.clickCard(this.conduit);

            expect(this.game.rings.water.hasElement('water')).toBe(true);
            expect(this.game.rings.water.hasElement('air')).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Conduit of the Elements to add Air to the conflict ring');
        });

        it('should add elements to rings if you play a kiho', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.conduit],
                defenders: [],
                ring: 'water'
            });
            this.player2.pass();
            expect(this.game.rings.water.hasElement('water')).toBe(true);
            expect(this.game.rings.water.hasElement('earth')).toBe(false);

            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.conduit);
            this.player1.clickCard(this.conduit);

            expect(this.game.rings.water.hasElement('water')).toBe(true);
            expect(this.game.rings.water.hasElement('earth')).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Conduit of the Elements to add Earth to the conflict ring');
        });

        it('should not add elements to rings if you play a non-kiho', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.conduit],
                defenders: [],
                ring: 'water'
            });
            this.player2.pass();
            expect(this.game.rings.water.hasElement('water')).toBe(true);
            expect(this.game.rings.water.hasElement('earth')).toBe(false);

            this.player1.clickCard(this.hammer);
            this.player1.clickCard(this.conduit);
            this.player1.clickCard(this.conduit);

            expect(this.game.rings.water.hasElement('water')).toBe(true);
            expect(this.game.rings.water.hasElement('earth')).toBe(false);
        });
    });
});
