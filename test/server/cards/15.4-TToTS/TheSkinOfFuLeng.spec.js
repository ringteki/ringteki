describe('The Skin of Fu Leng', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-toshimoko', 'doji-challenger', 'bayushi-kachiko-2'],
                    hand: ['the-skin-of-fu-leng'],
                },
                player2: {
                    inPlay: ['bayushi-kachiko']
                }
            });

            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
            this.kachiko = this.player2.findCardByName('bayushi-kachiko');
        });

        it('should allow you to attach to a unique character you control', function() {
            this.player1.clickCard(this.skin);
            expect(this.player1).toBeAbleToSelect(this.toshimoko);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.kachiko);
        });
    });
});


/*
    Brash Samurai (I have no participating characters) - Should trigger
    Brash Samurai (I have a character, my opponent just has Brash) - Should not trigger

    Doji Challenger (defending) - While this character is attacking: no trigger.
    Doji Challenger (attacking) - While this character is attacking: should trigger.  I should choose their character

    Guardian Kami (defending) (sacrifice cost) - Should trigger
    Guardian Kami (attacking) - no trigger

    Hida O-Ushi (defending, opponent wins conflict) - no trigger
    Hida O-Ushi (defending, I win conflict) - no trigger
    Hida O-Ushi (attacking, opponent wins conflict) - no trigger
    Hida O-Ushi (attacking, I win conflict) - should trigger, I get the extra conflict

    Tadaka2 - should use my removed from game pile
    Honored General (via charge) - I should get to choose whether to trigger

    Inferno Guard Invoker (Choose a character you control) - should not be able to choose itself

    Forced
    ======
    Ujina - Should trigger.  I should get to choose the target.

    Cards that refer to their controller's game state
    =============
    Pious Guardian - should check my provinces, not my opponents
    Mitsu2 - should check the number of cards I've played, not my opponent
    Kageyu - should check the number of cards my opponent has played, not myself

    Gained Abilities
    ================
    Should trigger

    Duels
    =====
    Kaezin targeting - My opponent should choose a character they control that is not Kaezin.
    Duel - my bid should apply to Kaezin, my opponent's should apply to their character
    Duel resolution - if I win should move everyone except the two characters.  If they win should move Kaezin home.
    Kyuden Kakita - should trigger and let you choose Kaezin or the other character

    Raitsugu targeting - I should be able to choose a character my opponent controls that is not Raitsugu

    Yakamo with Duelist Training - Should use my honor to determine the "cannot lose a duel"
*/