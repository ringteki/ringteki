describe('Kakita\'s First Kata', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['vice-proprietor'],
                    hand: ['a-new-name']
                },
                player2: {
                    inPlay: ['kakita-yoshi', 'doji-challenger', 'hantei-sotorii', 'mirumoto-raitsugu'],
                    hand: ['kakita-s-first-kata', 'a-new-name', 'fine-katana', 'ornate-fan', 'dutiful-assistant']
                }
            });

            this.vice = this.player1.findCardByName('vice-proprietor');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.stance = this.player2.findCardByName('kakita-s-first-kata');
            this.ann2 = this.player1.findCardByName('a-new-name');

            this.ann = this.player2.findCardByName('a-new-name');
            this.katana = this.player2.findCardByName('fine-katana');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.assistant = this.player2.findCardByName('dutiful-assistant');

            this.player1.pass();
            this.player2.playAttachment(this.ann, this.raitsugu);
            this.player1.playAttachment(this.ann2, this.raitsugu);
            this.player2.playAttachment(this.katana, this.raitsugu);
            this.player1.pass();
            this.player2.playAttachment(this.fan, this.sotorii);
            this.player1.pass();
            this.player2.playAttachment(this.assistant, this.yoshi);
        });

        it('should not work in a pol conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi],
                type: 'political'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.stance);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should ask you to bow an attachment on a participating crane or duelist you control', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.challenger, this.sotorii, this.raitsugu],
                type: 'military'
            });

            this.player2.clickCard(this.stance);
            expect(this.player2).toBeAbleToSelect(this.ann);
            expect(this.player2).not.toBeAbleToSelect(this.ann2);
            expect(this.player2).not.toBeAbleToSelect(this.fan);
            expect(this.player2).toBeAbleToSelect(this.katana);
            expect(this.player2).toBeAbleToSelect(this.assistant);
        });


        it('should prevent bowing at the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.challenger],
                type: 'military'
            });

            this.player2.clickCard(this.stance);
            this.player2.clickCard(this.assistant);
            expect(this.getChatLogs(5)).toContain('player2 plays Kakita\'s First Kata, bowing Dutiful Assistant to stop Kakita Yoshi from bowing during conflict resolution');
            this.noMoreActions();
            expect(this.vice.bowed).toBe(true);
            expect(this.challenger.bowed).toBe(true);
            expect(this.yoshi.bowed).toBe(false);
        });

        it('should not prevent bow effects if you were not alone', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.challenger],
                type: 'military'
            });

            this.player2.clickCard(this.stance);
            this.player2.clickCard(this.assistant);
            this.player1.clickCard(this.vice);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.bowed).toBe(true);
        });

        it('should prevent bow effects if you were alone', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi],
                type: 'military'
            });

            this.player2.clickCard(this.stance);
            this.player2.clickCard(this.assistant);
            expect(this.getChatLogs(5)).toContain('player2 plays Kakita\'s First Kata, bowing Dutiful Assistant to stop Kakita Yoshi from bowing during conflict resolution and prevent opponents\' actions from bowing it');
            this.player1.clickCard(this.vice);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.noMoreActions();
            expect(this.vice.bowed).toBe(true);
            expect(this.yoshi.bowed).toBe(false);
        });
    });
});
