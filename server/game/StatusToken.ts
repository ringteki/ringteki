import { CardType, CharacterStatus, EffectName } from './Constants.js';
import EffectSource from './EffectSource.js';
import AbilityDsl from './abilitydsl.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type Effect from './Effects/Effect.js';
import type { EffectFactory } from './Effects/EffectBuilder.js';
import type Game from './Game.js';
import type Player from './Player.js';

interface StatusTokenEffect {
    match: BaseCard | Player;
    effect: EffectFactory;
    ref: Effect[];
    condition?: () => boolean;
}

export class StatusToken extends EffectSource {
    persistentEffects: StatusTokenEffect[] = [];
    printedType = 'token';
    overrideStatus?: CharacterStatus;

    constructor(
        public game: Game,
        public card: BaseCard | null,
        private initialStatus: CharacterStatus,
        title: string
    ) {
        super(game, title);
        this.applyEffects();
    }

    static create(game: Game, card: BaseCard, tokenType: CharacterStatus): StatusToken {
        switch(tokenType) {
            case CharacterStatus.Tainted:
                return new StatusToken(game, card, CharacterStatus.Tainted, 'Tainted Token');
            case CharacterStatus.Honored:
                return new StatusToken(game, card, CharacterStatus.Honored, 'Honored Token');
            case CharacterStatus.Dishonored:
                return new StatusToken(game, card, CharacterStatus.Dishonored, 'Dishonored Token');
        }
    }

    get controller() {
        return this.card?.controller;
    }

    get grantedStatus() {
        return this.overrideStatus ?? this.initialStatus;
    }

    get grantedStatusName(): string {
        switch(this.grantedStatus) {
            case CharacterStatus.Honored:
                return 'Honorable';
            case CharacterStatus.Dishonored:
                return 'Dishonorable';
            case CharacterStatus.Tainted:
                return 'Tainter';
            default:
                return '';
        }
    }

    applyEffects(): void {
        switch(this.grantedStatus) {
            case CharacterStatus.Honored:
                return this.applyHonoredEffect();
            case CharacterStatus.Dishonored:
                return this.applyDishonoredEffect();
            case CharacterStatus.Tainted:
                return this.applyTaintedEffect();
        }
    }

    removeEffects() {
        for(const effect of this.persistentEffects) {
            this.removeEffectFromEngine(effect.ref);
            effect.ref = [];
        }
        this.persistentEffects = [];
    }

    setCard(card: BaseCard | null) {
        this.removeEffects();
        this.card = card;
        this.applyEffects();
    }

    applyDishonoredEffect() {
        if(!this.card || this.card.type !== CardType.Character) {
            return;
        }
        const effect: StatusTokenEffect = {
            match: this.card,
            effect: AbilityDsl.effects.modifyBothSkills((card: DrawCard) => -card.getGlory()),
            ref: []
        };
        this.persistentEffects.push(effect);
        effect.ref = this.addEffectToEngine(effect);
    }

    applyHonoredEffect() {
        if(!this.card || this.card.type !== CardType.Character) {
            return;
        }
        const effect: StatusTokenEffect = {
            match: this.card,
            effect: AbilityDsl.effects.modifyBothSkills((card: DrawCard) => card.getGlory()),
            ref: []
        };
        this.persistentEffects.push(effect);
        effect.ref = this.addEffectToEngine(effect);
    }

    applyTaintedEffect() {
        if(!this.card) {
            return;
        }
        const effects =
            this.card.type === CardType.Character
                ? this.#taintEffectsOnCharacters()
                : this.card.type === CardType.Province
                    ? this.#taintEffectsOnProvinces()
                    : [];

        effects.forEach((effect: StatusTokenEffect) => {
            this.persistentEffects.push(effect);
            effect.ref = this.addEffectToEngine(effect);
        });
    }

    #taintEffectsOnCharacters(): StatusTokenEffect[] {
        const card = this.card;
        if(!card) {
            return [];
        }
        return [
            {
                match: card,
                effect: AbilityDsl.effects.modifyBothSkills(2),
                ref: []
            },
            {
                match: card,
                condition: () => !card.anyEffect(EffectName.TaintedStatusDoesNotCostHonor),
                effect: AbilityDsl.effects.honorCostToDeclare({
                    amount: 1,
                    dueToStatusToken: true
                }),
                ref: []
            }
        ];
    }

    #taintEffectsOnProvinces(): StatusTokenEffect[] {
        const card = this.card;
        if(!card) {
            return [];
        }
        return [
            {
                match: card,
                condition: () =>
                    !(
                        card.game.currentConflict &&
                        card.game.currentConflict.anyEffect(EffectName.ConflictIgnoreStatusTokens) &&
                        card.isConflictProvince()
                    ),
                effect: AbilityDsl.effects.modifyProvinceStrength(2),
                ref: []
            },
            {
                match: card.controller,
                condition: () => card.isConflictProvince(),
                effect: AbilityDsl.effects.costToDeclareAnyParticipants({
                    type: 'defenders',
                    message: 'loses 1 honor',
                    cost: (player: Player) =>
                        AbilityDsl.actions.loseHonor({
                            target: player,
                            amount: 1,
                            dueToStatusToken: true
                        })
                }),
                ref: []
            }
        ];
    }
}
