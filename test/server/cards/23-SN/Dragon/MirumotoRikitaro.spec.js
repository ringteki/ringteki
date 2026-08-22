describe('Mirumoto Rikitaro', function () {
    integration(function () {
        describe('Discount', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-rikitaro', 'kakita-yoshi'],
                        hand: ['fine-katana', 'ornate-fan', 'kakita-blade', 'honored-blade', 'tattooed-wanderer'],
                    },
                    player2: {
                        inPlay: ['togashi-initiate'],
                        hand: ['fine-katana', 'ornate-fan', 'kakita-blade', 'fan-of-command']
                    }
                });

                this.rikitaro = this.player1.findCardByName('mirumoto-rikitaro');
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.blade = this.player1.findCardByName('kakita-blade');
                this.honored = this.player1.findCardByName('honored-blade');
                this.wanderer = this.player1.findCardByName('tattooed-wanderer');

                this.initiate = this.player2.findCardByName('togashi-initiate');
                this.katana2 = this.player2.findCardByName('fine-katana');
                this.fan2 = this.player2.findCardByName('ornate-fan');
                this.blade2 = this.player2.findCardByName('kakita-blade');
                this.fan = this.player2.findCardByName('fan-of-command');
            });

            it('should reduce the cost to play an attachment on Rikitaro', function () {
                let fate = this.player1.fate;
                this.player1.clickCard(this.blade);
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.rikitaro);
                this.player1.clickCard(this.rikitaro);

                expect(this.player1.fate).toBe(fate);
                expect(this.rikitaro.attachments).toContain(this.blade);

                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Mirumoto Rikitaro to reduce the cost of their next attachment by 1'
                );
            });

            it('should work with monks played as an attachment', function () {
                let fate = this.player1.fate;
                this.player1.clickCard(this.wanderer);
                this.player1.clickPrompt('Play Tattooed Wanderer as an attachment');
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.rikitaro);
                this.player1.clickCard(this.rikitaro);

                expect(this.player1.fate).toBe(fate);
                expect(this.rikitaro.attachments).toContain(this.wanderer);
            });


            it('should not trigger if attachment costs 0', function () {
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.rikitaro.attachments).toContain(this.katana);
            });

            it('should not trigger if attachment is played a different character', function () {
                let fate = this.player1.fate;
                this.player1.clickCard(this.blade);
                this.player1.clickCard(this.yoshi);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.yoshi.attachments).toContain(this.blade);
                expect(this.player1.fate).toBe(fate - 1);
            });

            it('should not trigger if attachment is played by opponent', function () {
                this.player1.pass();
                this.player2.clickCard(this.blade2);
                this.player2.clickCard(this.rikitaro);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.rikitaro.attachments).toContain(this.blade2);
            });

            it('should still trigger if rikitaro has attachment controlled by opponent', function () {
                let fate = this.player1.fate;
                this.player1.pass();
                this.player2.clickCard(this.blade2);
                this.player2.clickCard(this.rikitaro);

                this.player1.clickCard(this.blade);
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.rikitaro);
                this.player1.clickCard(this.rikitaro);

                expect(this.player1.fate).toBe(fate);
                expect(this.rikitaro.attachments).toContain(this.blade);
                expect(this.rikitaro.attachments).toContain(this.blade2);
            });

            it('should not trigger if rikitaro has attachment controlled by you', function () {
                let fate = this.player1.fate;
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.rikitaro);

                this.player2.pass();

                this.player1.clickCard(this.blade);
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.rikitaro.attachments).toContain(this.blade);
                expect(this.player1.fate).toBe(fate - 1);
            });

            it('should let you play an attachment without any fate', function () {
                this.player1.fate = 0;
                this.player1.clickCard(this.blade);
                expect(this.player1).toBeAbleToSelect(this.rikitaro);
                expect(this.player1).not.toBeAbleToSelect(this.yoshi);
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.rikitaro);
                this.player1.clickCard(this.rikitaro);

                expect(this.rikitaro.attachments).toContain(this.blade);

                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Mirumoto Rikitaro to reduce the cost of their next attachment by 1'
                );
            });

            it('should allow you to pass the activation, keeping your action opportunity', function () {
                this.player1.fate = 0;
                this.player1.clickCard(this.blade);
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickPrompt('Pass');

                expect(this.rikitaro.attachments).not.toContain(this.blade);
                expect(this.blade.location).toBe('hand');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Action ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-rikitaro', 'kakita-yoshi'],
                        hand: ['kakita-blade'],
                    },
                    player2: {
                        inPlay: ['togashi-initiate'],
                        hand: ['fine-katana', 'ornate-fan', 'reinforced-plate', 'a-new-name']
                    }
                });

                this.rikitaro = this.player1.findCardByName('mirumoto-rikitaro');
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.blade = this.player1.findCardByName('kakita-blade');

                this.initiate = this.player2.findCardByName('togashi-initiate');
                this.katana = this.player2.findCardByName('fine-katana');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.ann = this.player2.findCardByName('a-new-name');
                this.plate = this.player2.findCardByName('reinforced-plate');

                this.player1.playAttachment(this.blade, this.rikitaro);
                this.player1.pass();
                this.player2.playAttachment(this.fan, this.initiate);
                this.player1.pass();
                this.player2.playAttachment(this.katana, this.initiate);
                this.player1.pass();
                this.player2.playAttachment(this.plate, this.initiate);
                this.player1.pass();
                this.player2.playAttachment(this.ann, this.initiate);
            });

            it('should target items, armor, and weapons and get +2 from discarding a weapon', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rikitaro],
                    defenders: [this.initiate],
                });

                let mil = this.rikitaro.getMilitarySkill();

                expect(this.katana.parent).toBe(this.initiate);

                this.player2.pass();
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).not.toBeAbleToSelect(this.blade);
                expect(this.player1).toBeAbleToSelect(this.katana);
                expect(this.player1).toBeAbleToSelect(this.fan);
                expect(this.player1).toBeAbleToSelect(this.plate);
                expect(this.player1).not.toBeAbleToSelect(this.ann);

                this.player1.clickCard(this.katana);

                expect(this.rikitaro.getMilitarySkill()).toBe(mil + 2);

                expect(this.getChatLogs(5)).toContain('player1 uses Mirumoto Rikitaro to discard Fine Katana');
                expect(this.getChatLogs(5)).toContain('Mirumoto Rikitaro gains +2military due to discarding a weapon!');
            });

            it('should target items, armor, and weapons and not get +2 from discarding a non weapon', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rikitaro],
                    defenders: [this.initiate],
                });

                let mil = this.rikitaro.getMilitarySkill();

                expect(this.katana.parent).toBe(this.initiate);

                this.player2.pass();
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).not.toBeAbleToSelect(this.blade);
                expect(this.player1).toBeAbleToSelect(this.katana);
                expect(this.player1).toBeAbleToSelect(this.fan);
                expect(this.player1).toBeAbleToSelect(this.plate);
                expect(this.player1).not.toBeAbleToSelect(this.ann);

                this.player1.clickCard(this.fan);

                expect(this.rikitaro.getMilitarySkill()).toBe(mil);

                expect(this.getChatLogs(5)).not.toContain('Mirumoto Rikitaro gains +2military due to discarding a weapon!');
            });

            it('should require participating', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yoshi],
                    defenders: [this.initiate],
                });

                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.rikitaro);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
