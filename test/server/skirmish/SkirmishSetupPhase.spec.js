describe('Skirmish Setup Phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'setup',
                player1: {
                    inPlay: []
                },
                player2: {
                    inPlay: []
                },
                skirmish: true
            });
        });

        it('should get 6 fate', function() {
            expect(this.player1.fate).toBe(0);
            expect(this.player2.fate).toBe(0);
            this.keepDynasty();
            this.keepConflict();

            expect(this.player1.fate).toBe(6);
            expect(this.player2.fate).toBe(6);
        });

        it('should get 6 honor', function() {
            expect(this.player1.honor).toBe(0);
            expect(this.player2.honor).toBe(0);
            this.keepDynasty();
            this.keepConflict();

            expect(this.player1.honor).toBe(6);
            expect(this.player2.honor).toBe(6);
        });

        it('should get 3 cards pre and post mulligan', function() {
            this.keepDynasty();
            expect(this.player1.hand.length).toBe(3);
            expect(this.player2.hand.length).toBe(3);
            this.keepConflict();
            expect(this.player1.hand.length).toBe(3);
            expect(this.player2.hand.length).toBe(3);
        });
    });
});

describe('Normal Gameplay Setup Phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'setup',
                player1: {
                    inPlay: [],
                    stronghold: 'kyuden-kakita'
                },
                player2: {
                    inPlay: [],
                    stronghold: 'shiro-shinjo'
                }
            });
        });

        it('should get fate equal to that on stronghold', function() {
            expect(this.player1.fate).toBe(0);
            expect(this.player2.fate).toBe(0);
            this.keepDynasty();
            this.keepConflict();

            expect(this.player1.fate).toBe(7);
            expect(this.player2.fate).toBe(6);
        });

        it('should get honor equal to that on stronghold', function() {
            expect(this.player1.honor).toBe(0);
            expect(this.player2.honor).toBe(0);
            this.keepDynasty();
            this.keepConflict();

            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(10);
        });

        it('should get 4 cards pre and post mulligan', function() {
            this.keepDynasty();
            expect(this.player1.hand.length).toBe(4);
            expect(this.player2.hand.length).toBe(4);
            this.keepConflict();
            expect(this.player1.hand.length).toBe(4);
            expect(this.player2.hand.length).toBe(4);
        });
    });
});
