describe('Purveyor Of Rarities', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['purveyor-of-rarities', 'doji-challenger', 'aranat'],
                    hand: ['voice-of-honor', 'way-of-the-unicorn', 'foreign-customs']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'miya-mystic'],
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');

            this.rarities = this.player1.findCardByName('purveyor-of-rarities');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
            this.voice = this.player1.findCardByName('voice-of-honor');
            this.unicorn = this.player1.findCardByName('way-of-the-unicorn');
            this.customs = this.player1.findCardByName('foreign-customs');
        });

        it('in clan', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.rarities],
                defenders: [this.mitsu],
            });
            this.player2.pass();

            let fate = this.player1.fate;
            let mil = this.rarities.getMilitarySkill();
            let pol = this.rarities.getPoliticalSkill();

            this.player1.clickCard(this.rarities);
            this.player1.clickCard(this.unicorn);

            expect(this.rarities.getMilitarySkill()).toBe(mil + 3);
            expect(this.rarities.getPoliticalSkill()).toBe(pol + 3);
            expect(this.player1.fate).toBe(fate);

            expect(this.getChatLogs(5)).toContain('player1 uses Purveyor of Rarities, discarding Way of the Unicorn to give +3military/+3political to Purveyor of Rarities');
        });

        it('out of clan', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.rarities],
                defenders: [this.mitsu],
            });
            this.player2.pass();

            let fate = this.player1.fate;
            let mil = this.rarities.getMilitarySkill();
            let pol = this.rarities.getPoliticalSkill();

            this.player1.clickCard(this.rarities);
            this.player1.clickCard(this.voice);

            expect(this.rarities.getMilitarySkill()).toBe(mil + 1);
            expect(this.rarities.getPoliticalSkill()).toBe(pol + 1);
            expect(this.player1.fate).toBe(fate + 1);

            expect(this.getChatLogs(5)).toContain('player1 uses Purveyor of Rarities, discarding Voice of Honor to give +1military/+1political to Purveyor of Rarities and gain 1 fate');
        });

        it('foreign', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.rarities],
                defenders: [this.mitsu],
            });
            this.player2.pass();

            let fate = this.player1.fate;
            let mil = this.rarities.getMilitarySkill();
            let pol = this.rarities.getPoliticalSkill();

            this.player1.clickCard(this.rarities);
            this.player1.clickCard(this.customs);

            expect(this.rarities.getMilitarySkill()).toBe(mil + 1);
            expect(this.rarities.getPoliticalSkill()).toBe(pol + 1);
            expect(this.player1.fate).toBe(fate + 1);

            expect(this.getChatLogs(5)).toContain('player1 uses Purveyor of Rarities, discarding Foreign Customs to give +1military/+1political to Purveyor of Rarities and gain 1 fate');
        });
    });
});
