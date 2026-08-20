describe('Cloud Hands', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ancient-master', 'loyal-challenger', 'togashi-mitsu'],
                    hand: ['banzai', 'cloud-hands', 'kakita-blade']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'political-rival', 'tattooed-wanderer'],
                    hand: ['way-of-the-lion', 'fine-katana']
                }
            });

            this.am = this.player1.findCardByName('ancient-master');
            this.loyalChallenger = this.player1.findCardByName('loyal-challenger');
            this.banzai = this.player1.findCardByName('banzai');
            this.cloudHands = this.player1.findCardByName('cloud-hands');
            this.kakitaBlade = this.player1.findCardByName('kakita-blade');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');

            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.wotl = this.player2.findCardByName('way-of-the-lion');
            this.katana = this.player2.findCardByName('fine-katana');
            this.rival = this.player2.findCardByName('political-rival');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.am, this.loyalChallenger],
                defenders: [this.toturi, this.rival, this.wanderer],
                type: 'political'
            });
        });

        it('should only allow targeting participating monk you control', function () {
            this.player2.pass();
            this.player1.clickCard(this.cloudHands);
            expect(this.player1).toHavePrompt('Choose a monk character');
            expect(this.player1).toBeAbleToSelect(this.am);
            expect(this.player1).not.toBeAbleToSelect(this.loyalChallenger);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.rival);
            expect(this.player1).not.toBeAbleToSelect(this.wanderer);
        });

        it('should allow you to choose a participating character your opponent controls', function () {
            this.player2.pass();
            this.player1.clickCard(this.cloudHands);
            this.player1.clickCard(this.am);
            expect(this.player1).toHavePrompt('Choose an opponent\'s character');
            expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
            expect(this.player1).not.toBeAbleToSelect(this.loyalChallenger);
            expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
            expect(this.player1).toBeAbleToSelect(this.toturi);
            expect(this.player1).toBeAbleToSelect(this.rival);
            expect(this.player1).toBeAbleToSelect(this.wanderer);
        });

        it('should set its base mil skill to chosen character\'s base skill and honor monk', function () {
            this.toturi.honor();

            this.player2.pass();
            this.player1.clickCard(this.cloudHands);
            this.player1.clickCard(this.am);
            this.player1.clickCard(this.toturi);

            expect(this.getChatLogs(3)).toContain('player1 plays Cloud Hands to honor Ancient Master and set their base skills to equal Akodo Toturi\'s base skills');
            expect(this.am.getBaseMilitarySkill()).toBe(this.toturi.getBaseMilitarySkill());
            expect(this.am.getBasePoliticalSkill()).toBe(this.toturi.getBasePoliticalSkill());
            expect(this.am.isHonored).toBe(true);
        });

        it('should set as military dash if target is military dash', function () {
            this.player2.pass();
            this.player1.clickCard(this.cloudHands);
            this.player1.clickCard(this.am);
            this.player1.clickCard(this.rival);
            expect(this.am.hasDash('military')).toBe(true);
        });

        describe('Skill Pumps', function () {
            it('should maintain skill pumps already played', function () {
                this.am.honor();
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.am);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player1.clickCard(this.am);
                this.player1.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard(this.cloudHands);
                this.player1.clickCard(this.am);
                this.player1.clickCard(this.toturi);
                expect(this.am.getBaseMilitarySkill()).toBe(this.toturi.getBaseMilitarySkill());
                expect(this.am.getMilitarySkill()).toBe(this.am.getBaseMilitarySkill() + 2 + 4);
            });

            it('should copy effects that change base skill', function () {
                this.player2.clickCard(this.wotl);
                this.player2.clickCard(this.toturi);
                this.player1.clickCard(this.cloudHands);
                this.player1.clickCard(this.am);
                this.player1.clickCard(this.toturi);

                expect(this.am.getBaseMilitarySkill()).toBe(this.toturi.getMilitarySkill());
            });
        });
    });
});
