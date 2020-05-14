describe('Silent Ones Monastery', function() {
    integration(function() {
        describe('functionality from an opponent standpoint', function () {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 30,
                        inPlay: ['daidoji-uji'],
                        dynastyDiscard: ['ikoma-prodigy', 'ikoma-prodigy', 'ikoma-prodigy', 'a-season-of-war'],
                        provinces: ['manicured-garden', 'shameful-display', 'fertile-fields']
                    },
                    player2: {
                        provinces: ['silent-ones-monastery'],
                        hand: ['assassination'],
                        dynastyDiscard: ['dispatch-to-nowhere']
                    }
                });

                this.manicured = this.player1.findCardByName('manicured-garden', 'province 1');
                this.prodigy1 = this.player1.findCardByName('ikoma-prodigy', 'dynasty discard pile');
                this.player1.placeCardInProvince(this.prodigy1, 'province 1');
                this.prodigy2 = this.player1.findCardByName('ikoma-prodigy', 'dynasty discard pile');
                this.player1.placeCardInProvince(this.prodigy2, 'province 2');
                this.prodigy3 = this.player1.findCardByName('ikoma-prodigy', 'dynasty discard pile');
                this.player1.placeCardInProvince(this.prodigy3, 'province 3');
                this.asow = this.player1.placeCardInProvince('a-season-of-war', 'province 4');
                this.uji = this.player1.findCardByName('daidoji-uji');

                this.silentOnesMonastery = this.player2.findCardByName('silent-ones-monastery', 'province 1');
                this.dispatch = this.player2.placeCardInProvince('dispatch-to-nowhere', 'province 4');
            });

            it('should limit the phate gained by the opponent in one phase to 2', function() {
                this.preProdigiesHonor = this.player1.honor;

                expect(this.silentOnesMonastery.facedown).toBe(false);

                this.player1.clickCard(this.prodigy1);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy1);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 1);
                this.player2.pass();

                this.player1.clickCard(this.prodigy2);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy2);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 2);

                this.player1.clickCard(this.prodigy3);
                this.player1.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy3);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 2); // no increase as Silent Ones Monastery has kicked in
            });

            it('should reset between fases', function() {
                this.preProdigiesHonor = this.player1.honor;

                expect(this.silentOnesMonastery.facedown).toBe(false);

                this.player1.clickCard(this.prodigy1);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy1);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 1);
                this.player2.pass();

                this.player1.clickCard(this.prodigy2);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy2);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 2);

                this.player1.clickCard(this.prodigy3);
                this.player1.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy3);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 2); // no increase as Silent Ones Monastery has kicked in

                this.player1.pass(); // move on to draw phase

                this.preDrawBidHonor = this.player1.honor;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5'); // 1 to 5 bid, player 1 should technically gain 4, but SOM prevents all but 2
                expect(this.player1.honor).toBe(this.preDrawBidHonor + 2);
            });

            it('should not prevent the owner from giving more during a transfer of honor than the opponent could gain', function() {
                this.player1.pass();
                this.player2.pass(); // move on to draw phase

                this.preDrawBidHonor = this.player1.honor;
                this.preDrawBidHonorSOMPlayer = this.player2.honor;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1.honor).toBe(this.preDrawBidHonor + 2);
                expect(this.player2.honor).toBe(this.preDrawBidHonorSOMPlayer - 2); // 1 to 5 bid, player 2 should technically pay 4, but SOM prevents all but 2
            });

            it('should count a new dynasty (or other) phase started by an effect like A Season of War as a new phase to count against', function() {
                this.preProdigiesHonor = this.player1.honor;

                expect(this.silentOnesMonastery.facedown).toBe(false);

                this.player1.clickCard(this.prodigy1);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy1);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 1);
                this.player2.pass();

                this.player1.clickCard(this.prodigy2);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy2);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 2);

                this.player1.clickCard(this.asow);
                this.player1.placeCardInProvince(this.prodigy3, 'province 3');

                this.player1.clickCard(this.prodigy3);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy3);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 3);
            });

            it('should not count lost honor as lowering "honor gained"', function() {
                this.preProdigiesHonor = this.player1.honor;

                expect(this.silentOnesMonastery.facedown).toBe(false);

                this.player1.clickCard(this.prodigy1);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy1);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 1);

                this.prodigy1.fate = 0;
                this.prodigy1.dishonor();
                this.player2.clickCard(this.dispatch);
                this.player2.clickCard(this.prodigy1);
                expect(this.player1.honor).toBe(this.preProdigiesHonor);

                this.player1.clickCard(this.prodigy2);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy2);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 1);
                this.player2.pass();

                this.player1.clickCard(this.prodigy3);
                this.player1.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.prodigy3);
                expect(this.player1.honor).toBe(this.preProdigiesHonor + 1);
                /* even though player1 only has gained 1 honor ontop of his starting total, he did gain 2 honor in total.
                   and thus should not be able to gain honor anymore */
            });
        });
        describe('functionality when the honor gain would surpass the limit', function () {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 30,
                        inPlay: ['daidoji-uji','ikoma-prodigy'],
                        provinces: ['manicured-garden', 'shameful-display', 'fertile-fields']
                    },
                    player2: {
                        provinces: ['silent-ones-monastery'],
                        hand: ['assassination']
                    }
                });

                this.manicured = this.player1.findCardByName('manicured-garden', 'province 1');
                this.prodigy1 = this.player1.findCardByName('ikoma-prodigy');
                this.uji = this.player1.findCardByName('daidoji-uji');

                this.silentOnesMonastery = this.player2.findCardByName('silent-ones-monastery', 'province 1');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('should still reward up to the cap and not completely ignore it.', function() {
                this.prodigy1.honor();
                this.startingHonor = this.player1.honor;

                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.prodigy1, this.uji],
                    defenders: [],
                    ring: 'air'
                });

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.prodigy1);
                expect(this.player1.honor).toBe(this.startingHonor + 1);

                this.player1.pass();
                this.player2.pass();

                this.player1.clickPrompt('Gain 2 honor');
                expect(this.player1.honor).toBe(this.startingHonor + 2); // didn't gain the 2 full honor, but got up to the cap of the phase: 2.
            });
        });
    });
});
