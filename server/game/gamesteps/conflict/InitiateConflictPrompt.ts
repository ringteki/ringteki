import { UiPrompt } from '../UiPrompt.js';
import { Location, CardType, ConflictType, Element } from '../../Constants.js';
import AttackersMatrix from './AttackersMatrix.js';
import { AbilityContext } from '../../AbilityContext.js';
import CovertAbility from '../../KeywordAbilities/CovertAbility.js';
import { GameModes } from '../../../GameModes.js';
import type Player from '../../Player.js';
import type Game from '../../Game.js';
import type Ring from '../../Ring.js';
import type BaseCard from '../../BaseCard.js';
import type DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import type { Conflict } from '../../Conflict.js';

const capitalize: Record<string, string> = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class InitiateConflictPrompt extends UiPrompt {
    conflict: Conflict;
    choosingPlayer: Player;
    attackerChoosesRing: boolean;
    canPass: boolean;
    selectedDefenders: DrawCard[];
    covertRemaining: boolean;
    attackerMatrix: AttackersMatrix;

    constructor(game: Game, conflict: Conflict, choosingPlayer: Player, attackerChoosesRing = true, canPass = attackerChoosesRing, attackerMatrix: AttackersMatrix | null = null) {
        super(game);
        this.conflict = conflict;
        this.choosingPlayer = choosingPlayer;
        this.attackerChoosesRing = attackerChoosesRing;
        this.canPass = canPass;
        this.selectedDefenders = [];
        this.covertRemaining = false;

        if (attackerMatrix === null) {
            this.attackerMatrix = new AttackersMatrix(this.choosingPlayer, this.choosingPlayer.cardsInPlay, this.game);
            if (!this.attackerMatrix.canPass) {
                this.canPass = false;
            }
        } else {
            this.attackerMatrix = attackerMatrix;
        }

        if (this.conflict.conflictProvince) {
            this.conflict.conflictProvince.inConflict = true;
        }

        this.checkForMustSelect();
    }

    continue(): boolean {
        if (!this.isComplete()) {
            this.highlightSelectableRings();
        }

        return super.continue();
    }

    checkForMustSelect(): void {
        if (this.attackerMatrix.forcedNumberOfAttackers > 0 && this.attackerMatrix.defaultRing) {
            const ring = this.attackerMatrix.defaultRing;
            this.conflict.ring = ring;
            ring.resetRing();
            ring.contested = true;
            if (ring.conflictType !== this.attackerMatrix.defaultType) {
                ring.flipConflictType();
            }
            for (const card of this.attackerMatrix.getForcedAttackers(ring, ring.conflictType, this.conflict.conflictProvince)) {
                if (this.checkCardCondition(card) && !this.conflict.attackers.includes(card)) {
                    this.selectCard(card);
                }
            }
        }
    }

    highlightSelectableRings(): void {
        let selectableRings = Object.values(this.game.rings).filter((ring: Ring) => {
            return this.checkRingCondition(ring);
        });
        this.choosingPlayer.setSelectableRings(selectableRings);
    }

    activeCondition(player: Player): boolean {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons: Array<{ text: string; arg: string }> = [];
        let menuTitle = '';
        let promptTitle = '';

        if (this.canPass) {
            buttons.push({ text: 'Pass Conflict', arg: 'pass' });
        }

        const ring = this.conflict.ring;
        if (!ring) {
            menuTitle = this.conflict.forcedDeclaredType ? 'Choose an elemental ring' : 'Choose an elemental ring\n(click the ring again to change conflict type)';
            promptTitle = 'Initiate Conflict';
        } else {
            promptTitle = capitalize[this.conflict.conflictType as ConflictType] + ' ' + capitalize[this.conflict.element as Element] + ' Conflict';
            if (!this.conflict.conflictProvince && !this.conflict.isSinglePlayer) {
                menuTitle = 'Choose province to attack';
            } else if (this.conflict.attackers.length === 0) {
                menuTitle = 'Choose attackers';
            } else {
                if (this.covertRemaining && this.game.gameMode !== GameModes.Emerald) {
                    menuTitle = 'Choose defenders to Covert';
                } else {
                    menuTitle = capitalize[this.conflict.conflictType as ConflictType] + ' skill: '.concat(String(this.conflict.attackerSkill));
                }
                if (this.conflict.attackers.length === this.attackerMatrix.requiredNumberOfAttackers || this.attackerMatrix.requiredNumberOfAttackers <= 0) {
                    buttons.unshift({ text: 'Initiate Conflict', arg: 'done' });
                }
            }
        }

        return {
            selectRing: true,
            menuTitle: menuTitle,
            buttons: buttons,
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to declare conflict' };
    }

    onCardClicked(player: Player, card: BaseCard): boolean {
        return player === this.choosingPlayer && this.checkCardCondition(card) && this.selectCard(card);
    }

    onRingClicked(player: Player, ring: Ring): boolean {
        return player === this.choosingPlayer && this.checkRingCondition(ring) && this.selectRing(ring);
    }

    selectRing(ring: Ring): boolean {
        let player = this.choosingPlayer;

        if (this.conflict.ring === ring) {
            ring.flipConflictType();
        } else {
            const type = ring.conflictType;

            let polValid = this.attackerMatrix.isCombinationValid(ring, ConflictType.Political, this.conflict.conflictProvince);
            let milValid = this.attackerMatrix.isCombinationValid(ring, ConflictType.Military, this.conflict.conflictProvince);

            if (!player.hasLegalConflictDeclaration({ type, ring, province: this.conflict.conflictProvince })) {
                ring.flipConflictType();
            } else if (polValid && !milValid && type === 'military') {
                ring.flipConflictType();
            } else if (milValid && !polValid && type === 'political') {
                ring.flipConflictType();
            } else if (this.conflict.attackers.some((card: DrawCard) => !card.canDeclareAsAttacker(type, ring))) {
                ring.flipConflictType();
            }
            if (this.conflict.ring) {
                this.conflict.ring.resetRing();
            }
            this.conflict.ring = ring;
            ring.contested = true;
        }

        this.conflict.attackers.forEach((card: DrawCard) => {
            if (!card.canDeclareAsAttacker(ring.conflictType, ring)) {
                this.removeFromConflict(card);
            }
        });

        this.attackerMatrix.getForcedAttackers(ring, ring.conflictType, this.conflict.conflictProvince).forEach((card: DrawCard) => {
            if (!this.conflict.attackers.includes(card)) {
                this.selectCard(card);
            }
        });

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    checkRingCondition(ring: Ring): boolean {
        const player = this.choosingPlayer;
        const province = this.conflict.conflictProvince;
        let attackers = this.conflict.attackers;
        this.conflict.attackers = [];
        if (this.conflict.ring === ring) {
            const newType = ring.conflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military;
            if (!player.hasLegalConflictDeclaration({ type: newType, ring, province })) {
                this.conflict.attackers = attackers;
                return false;
            }

            if (!this.attackerMatrix.isCombinationValid(ring, newType, this.conflict.conflictProvince)) {
                this.conflict.attackers = attackers;
                return false;
            }

            this.conflict.attackers = attackers;
            return true;
        }
        let result = this.attackerChoosesRing && player.hasLegalConflictDeclaration({ ring, province }) && (this.attackerMatrix.isCombinationValid(ring, ConflictType.Political) || this.attackerMatrix.isCombinationValid(ring, ConflictType.Military));
        this.conflict.attackers = attackers;
        return result;
    }

    checkCardCondition(card: BaseCard): boolean {
        if (card.isProvince && card.controller !== this.choosingPlayer) {
            return card === this.conflict.conflictProvince || this.choosingPlayer.hasLegalConflictDeclaration({
                type: this.conflict.conflictType,
                ring: this.conflict.ring,
                province: card as ProvinceCard
            });
        } else if (card.type === CardType.Character && card.location === Location.PlayArea) {
            const drawCard = card as DrawCard;
            if (card.controller === this.choosingPlayer) {
                if (this.conflict.attackers.includes(drawCard)) {
                    let forced = this.attackerMatrix.getForcedAttackers(this.conflict.ring as Ring, this.conflict.conflictType as ConflictType, this.conflict.conflictProvince).includes(drawCard);
                    let extraAttackers = this.attackerMatrix.requiredNumberOfAttackers > 0 ? this.conflict.attackers.length > this.attackerMatrix.requiredNumberOfAttackers : false;
                    let enoughForcedRemaining = true;

                    if (forced && extraAttackers) {
                        let forcedRemainingCount = this.conflict.attackers.filter((a: DrawCard) =>
                            this.attackerMatrix.getForcedAttackers(this.conflict.ring as Ring, this.conflict.conflictType as ConflictType, this.conflict.conflictProvince).includes(a)).length - 1; //-1 because we're trying to remove a character from the list
                        if (forcedRemainingCount < this.attackerMatrix.requiredNumberOfAttackers) {
                            enoughForcedRemaining = false;
                        }
                    }

                    return !forced || (extraAttackers && enoughForcedRemaining);
                }
                return this.choosingPlayer.hasLegalConflictDeclaration({
                    type: this.conflict.conflictType,
                    ring: this.conflict.ring,
                    province: this.conflict.conflictProvince,
                    attacker: drawCard
                });
            }

            if (this.selectedDefenders.includes(card as DrawCard)) {
                return true;
            }
            if ((card as DrawCard).isCovert() || !this.covertRemaining || this.game.gameMode === GameModes.Emerald) {
                return false;
            }

            //Make sure the covert is legal
            let attackersWithCovert = this.conflict.attackers.filter((card: DrawCard) => card.isCovert());
            let covertContexts = attackersWithCovert.map((card: DrawCard) => new AbilityContext({
                game: this.game,
                player: this.conflict.attackingPlayer,
                source: card,
                ability: new CovertAbility()
            }));

            let targetable = false;

            for (const context of covertContexts) {
                if (context.player.checkRestrictions('initiateKeywords', context)) {
                    if ((card as DrawCard).canBeBypassedByCovert(context) && card.checkRestrictions('target', context)) {
                        targetable = true;
                    }
                }
            }

            return this.covertRemaining && targetable;

        }
        return false;
    }

    recalculateCovert(): void {
        let attackersWithCovert = this.conflict.attackers.filter((card: DrawCard) => card.isCovert()).length;
        this.covertRemaining = attackersWithCovert > this.selectedDefenders.length;
    }

    selectCard(card: BaseCard): boolean {
        if (card.isProvince) {
            if (this.conflict.conflictProvince) {
                this.conflict.conflictProvince.inConflict = false;
                this.conflict.conflictProvince = null;
            } else {
                const province = card as ProvinceCard;
                this.conflict.conflictProvince = province;
                province.inConflict = true;
            }
        } else if (card.type === CardType.Character) {
            const character = card as DrawCard;
            if (card.controller === this.choosingPlayer) {
                if (!this.conflict.attackers.includes(character)) {
                    this.conflict.addAttacker(character);
                } else {
                    this.removeFromConflict(character);
                }
                this.conflict.attackers.forEach((card: DrawCard) => {
                    if (!card.canDeclareAsAttacker(this.conflict.conflictType || 'military', this.conflict.ring || this.game.rings['air'], this.conflict.conflictProvince, this.conflict.attackers)) {
                        this.removeFromConflict(card);
                    }
                });
            } else {
                if (!this.selectedDefenders.includes(card as DrawCard)) {
                    this.selectedDefenders.push(card as DrawCard);
                    (card as DrawCard).covert = true;
                } else {
                    this.selectedDefenders = this.selectedDefenders.filter((c: DrawCard) => c !== card);
                    (card as DrawCard).covert = false;
                }
            }
        }

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    removeFromConflict(card: DrawCard): void {
        if (card.isCovert() && !this.covertRemaining) {
            const removedDefender = this.selectedDefenders.pop();
            if (removedDefender) {
                removedDefender.covert = false;
            }
        }
        this.conflict.removeFromConflict(card);
    }

    menuCommand(_player: Player, arg: string): boolean {
        if (arg === 'done') {
            if (!this.conflict.ring || this.game.rings[this.conflict.element as Element] !== this.conflict.ring ||
                (!this.conflict.isSinglePlayer && !this.conflict.conflictProvince) || this.conflict.attackers.length === 0) {
                return false;
            }
            this.conflict.setDeclarationComplete(true);
            this.complete();
            this.conflict.declaredRing = this.conflict.ring;
            this.conflict.declaredType = this.conflict.ring.conflictType;
            return true;
        } else if (arg === 'pass') {
            this.game.promptWithHandlerMenu(this.choosingPlayer, {
                activePromptTitle: 'Are you sure you want to pass your conflict opportunity?',
                source: 'Pass Conflict',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.complete();
                        this.conflict.passConflict();
                    },
                    () => true
                ]
            });
            return true;
        }
        return false;
    }
}

export default InitiateConflictPrompt;
