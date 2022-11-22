describe('Paranoid Hososhi', function () {
    integration(function () {
        describe('Static event immunity', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['paranoid-hososhi', 'adept-of-the-waves']
                    }
                });

                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.assassination =
                    this.player1.findCardByName('assassination');
                this.paranoidHososhi =
                    this.player2.findCardByName('paranoid-hososhi');
                this.adeptOfTheWaves =
                    this.player2.findCardByName('adept-of-the-waves');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.tsukune],
                    defenders: [this.adeptOfTheWaves]
                });
                this.player2.pass();
            });

            it('is immune to events', function () {
                this.player1.clickCard(this.assassination);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).not.toBeAbleToSelect(this.paranoidHososhi);
            });
        });

        describe('Fate stealing ability', function () {
            describe('When your opponent have the highest cost character and they have fate', function () {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['paranoid-hososhi']
                        },
                        player2: {
                            inPlay: ['shiba-tsukune']
                        }
                    });

                    this.paranoidHososhi =
                        this.player1.findCardByName('paranoid-hososhi');
                    this.paranoidHososhi.fate = 1;

                    this.tsukune = this.player2.findCardByName('shiba-tsukune');
                    this.tsukune.fate = 1;
                    this.noMoreActions();
                });

                it('is triggerable', function () {
                    let player1FateBefore = this.player1.fate;
                    this.player1.clickCard(this.paranoidHososhi);
                    expect(this.player1).toHavePrompt('Paranoid Hōsōshi');
                    expect(this.player1).toBeAbleToSelect(this.tsukune);
                    expect(this.player1).not.toBeAbleToSelect(
                        this.paranoidHososhi
                    );

                    this.player1.clickCard(this.tsukune);
                    expect(this.paranoidHososhi.bowed).toBe(true);
                    expect(this.tsukune.fate).toBe(0);
                    expect(this.player1.fate).toBe(player1FateBefore + 1);

                    expect(this.getChatLogs(3)).toContain(
                        'player1 uses Paranoid Hōsōshi, bowing Paranoid Hōsōshi to take 1 fate from Shiba Tsukune — evil begone!'
                    );
                });
            });

            describe('When your opponent have the highest cost character and they have no fate', function () {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['paranoid-hososhi']
                        },
                        player2: {
                            inPlay: ['shiba-tsukune']
                        }
                    });

                    this.paranoidHososhi =
                        this.player1.findCardByName('paranoid-hososhi');
                    this.paranoidHososhi.fate = 1;

                    this.tsukune = this.player2.findCardByName('shiba-tsukune');
                    this.tsukune.fate = 0;
                    this.noMoreActions();
                });

                it('is not triggerable', function () {
                    this.player1.clickCard(this.paranoidHososhi);
                    expect(this.player1).not.toHavePrompt('Paranoid Hōsōshi');
                });
            });
        });
    });
});
