describe('Daidoji Hiroteru', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['daidoji-hiroteru', 'akodo-toturi-2'],
                    dynastyDiscard: ['doji-whisperer', 'daidoji-ahma', 'cautious-scout'],
                    hand: ['adept-of-shadows'],
                    fate: 10
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });

            this.dojiWhisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');
            this.ahma = this.player1.placeCardInProvince('daidoji-ahma', 'province 2');
            this.scout = this.player1.placeCardInProvince('cautious-scout', 'province 3');
            this.hiroteru = this.player1.findCardByName('daidoji-hiroteru');
            this.shadows = this.player1.findCardByName('adept-of-shadows');
            this.akodoToturi2 = this.player1.findCardByName('akodo-toturi-2');

            this.brash = this.player2.findCardByName('brash-samurai');

            this.hiroteru.dishonor();
        });

        it('should not let you play characters in hand during the dynasty phase', function () {
            this.player1.clickCard(this.shadows);
            expect(this.player1).not.toHavePrompt('Choose additional fate');
        });

        it('should not discount the characters played from province during the dynasty phase', function () {
            this.player1.clickCard(this.scout);
            this.player1.clickPrompt('0');
            expect(this.scout.location).toBe('play area');
            expect(this.player1.fate).toBe(8);
        });

        it('should let you play properly traited characters as if they were in your hand with discount', function () {
            this.nextPhase();
            this.nextPhase();
            let fate = this.player1.fate;
            expect(this.game.currentPhase).toBe('conflict');
            this.player1.clickCard(this.scout);
            this.player1.clickPrompt('0');
            expect(this.scout.location).toBe('play area');
            expect(this.player1.fate).toBe(fate - 1);
            this.player2.pass();
            this.player1.clickCard(this.ahma);
            this.player1.clickPrompt('1');
            expect(this.ahma.location).toBe('play area');
            expect(this.ahma.fate).toBe(1);
            expect(this.player1.fate).toBe(fate - 2);

            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.dojiWhisperer);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not discount characters played directly from hand', function () {
            this.nextPhase();
            this.nextPhase();
            let fate = this.player1.fate;
            this.player1.clickCard(this.shadows);
            this.player1.clickPrompt('0');
            expect(this.shadows.location).toBe('play area');
            expect(this.player1.fate).toBe(fate - 2);
        });

        it('should not let you play characters as if they were in your hand if Toturi2 is participating', function () {
            this.nextPhase();
            this.nextPhase();
            this.noMoreActions();
            this.player1.player.imperialFavor = 'political';
            expect(this.player1.player.imperialFavor).toBe('political');
            this.initiateConflict({
                attackers: [this.akodoToturi2],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.akodoToturi2);
            this.player2.pass();
            this.player1.clickCard(this.ahma);
            expect(this.player1).not.toHavePrompt('Choose additional fate');
        });

        it('give characters +1/+1', function () {
            this.nextPhase();
            this.nextPhase();
            this.noMoreActions();
            this.player1.player.imperialFavor = 'political';
            expect(this.player1.player.imperialFavor).toBe('political');
            this.initiateConflict({
                attackers: [this.hiroteru, this.akodoToturi2],
                defenders: [this.brash]
            });
            let mil1 = this.hiroteru.getMilitarySkill();
            let pol1 = this.hiroteru.getPoliticalSkill();

            let mil2 = this.akodoToturi2.getMilitarySkill();
            let pol2 = this.akodoToturi2.getPoliticalSkill();

            let mil3 = this.brash.getMilitarySkill();
            let pol3 = this.brash.getPoliticalSkill();

            this.player2.pass();
            this.player1.clickCard(this.hiroteru);

            expect(this.hiroteru.getMilitarySkill()).toBe(mil1 + 1);
            expect(this.hiroteru.getPoliticalSkill()).toBe(pol1 + 1);
            expect(this.akodoToturi2.getMilitarySkill()).toBe(mil2 + 1);
            expect(this.akodoToturi2.getPoliticalSkill()).toBe(pol2 + 1);
            expect(this.brash.getMilitarySkill()).toBe(mil3);
            expect(this.brash.getPoliticalSkill()).toBe(pol3);

            expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Hiroteru to give Daidōji Hiroteru and Akodo Toturi +1/+1');
        });

        it('when not dishonored should not let you play characters', function () {
            this.hiroteru.honor();

            this.nextPhase();
            this.nextPhase();
            expect(this.game.currentPhase).toBe('conflict');
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.scout);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
