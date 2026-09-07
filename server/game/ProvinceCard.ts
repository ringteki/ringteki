import { GameModes } from '../GameModes.js';
import { EffectName, Element, Location } from './Constants.js';
import type { ElementSymbolInfo } from './ElementSymbol.js';
import AbilityDsl from './abilitydsl.js';
import BaseCard from './BaseCard.js';
import { AttachmentManager } from './AttachmentManager.js';
import type Player from './Player.js';
import type DrawCard from './DrawCard.js';
import StatModifier from './StatModifier.js';
import type { CardData } from './types/CardData.js';

export class ProvinceCard extends BaseCard {
    isProvince = true;
    isBroken = false;
    menu = [
        { command: 'break', text: 'Break/unbreak this province' },
        { command: 'hide', text: 'Flip face down' },
        { command: 'dishonor', text: 'Dishonor' },
        { command: 'honor', text: 'Honor' },
        { command: 'taint', text: 'Taint/Cleanse' }
    ];
    private attachmentHost = new AttachmentManager(this);

    get attachments(): DrawCard[] {
        return this.attachmentHost.attachments;
    }

    set attachments(value: DrawCard[]) {
        this.attachmentHost.attachments = value;
    }

    removeAttachment(attachment: DrawCard): void {
        this.attachmentHost.remove(attachment);
    }

    override checkForIllegalAttachments(): boolean {
        return this.attachmentHost.checkForIllegalAttachments();
    }

    constructor(
        owner: Player,
        cardData: CardData = {
            strength: 3,
            elements: [],
            type: 'province',
            side: 'province',
            name: 'Skirmish Province',
            id: 'skirmish-province'
        }
    ) {
        super(owner, cardData);
        this.persistentEffect({
            condition: (context) => context.source.hasEminent(),
            location: Location.Any,
            effect: AbilityDsl.effects.cardCannot('turnFacedown')
        });
    }

    get strength() {
        return this.getStrength();
    }

    getStrength(): number {
        if(this.anyEffect(EffectName.SetProvinceStrength)) {
            return this.mostRecentEffect(EffectName.SetProvinceStrength);
        }

        const strength =
            this.baseStrength +
            this.sumEffects(EffectName.ModifyProvinceStrength) +
            this.getDynastyOrStrongholdCardModifier();
        const multipliedStrength = this.getEffects(EffectName.ModifyProvinceStrengthMultiplier).reduce(
            (total: number, value: number) => total * value,
            strength
        );
        return Math.max(0, multipliedStrength);
    }

    get baseStrength() {
        return this.getBaseStrength();
    }

    get printedStrength() {
        const parsed = parseInt(String(this.cardData.strength ?? ''), 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    getCardStrength(): number {
        let copyEffect = this.mostRecentEffect(EffectName.CopyProvince);
        const cardStrengthString = copyEffect ? copyEffect.cardData.strength : this.cardData.strength;
        const cardStrength = (parseInt(String(cardStrengthString ?? '')) || 0);

        return cardStrength;
    }

    getBaseStrength(): number {
        if(this.anyEffect(EffectName.SetBaseProvinceStrength)) {
            return this.mostRecentEffect(EffectName.SetBaseProvinceStrength);
        }
        return (
            this.sumEffects(EffectName.ModifyBaseProvinceStrength) +
            this.getCardStrength()
        );
    }

    getDynastyOrStrongholdCardModifier(): number {
        const province = this.controller.getSourceList(this.location);
        const canBeIncreased = !this.anyEffect(EffectName.ProvinceCannotHaveSkillIncreased);

        return province.reduce((bonus, card) => {
            let s = card.getProvinceStrengthBonus();
            if(!canBeIncreased && s > 0) {
                s = 0;
            }
            return bonus + s;
        }, 0);
    }

    getStrengthModifiers(): StatModifier[] {
        const modifiers: StatModifier[] = [];

        // Set effects override everything
        const setEffects = this.getRawEffects().filter((e) => e.type === EffectName.SetProvinceStrength);
        if(setEffects.length > 0) {
            const effect = setEffects[setEffects.length - 1];
            modifiers.push(StatModifier.fromEffect(effect.getValue(this), effect, true, StatModifier.getEffectName(effect)));
            return modifiers;
        }

        // Base strength
        const setBaseEffects = this.getRawEffects().filter((e) => e.type === EffectName.SetBaseProvinceStrength);
        if(setBaseEffects.length > 0) {
            const effect = setBaseEffects[setBaseEffects.length - 1];
            modifiers.push(StatModifier.fromEffect(effect.getValue(this), effect, true, StatModifier.getEffectName(effect)));
        } else {
            modifiers.push(new StatModifier(this.getCardStrength(), 'Printed', false, undefined));
            for(const effect of this.getRawEffects().filter((e) => e.type === EffectName.ModifyBaseProvinceStrength)) {
                modifiers.push(StatModifier.fromEffect(effect.getValue(this), effect, false));
            }
        }

        // Province strength modifiers
        for(const effect of this.getRawEffects().filter((e) => e.type === EffectName.ModifyProvinceStrength)) {
            modifiers.push(StatModifier.fromEffect(effect.getValue(this), effect, false));
        }

        // Dynasty/stronghold card bonus
        const dynastyBonus = this.getDynastyOrStrongholdCardModifier();
        if(dynastyBonus !== 0) {
            modifiers.push(new StatModifier(dynastyBonus, 'Cards in Province', false, undefined));
        }

        return modifiers;
    }

    get strengthSummary(): { stat?: string; modifiers?: StatModifier[] } {
        if(this.facedown) {
            return {};
        }
        const modifiers = this.getStrengthModifiers().map((modifier) => Object.assign({}, modifier));
        const strength = this.getStrength();
        return {
            stat: strength.toString(),
            modifiers: modifiers
        };
    }

    get element() {
        return this.getElement();
    }

    getElement(): Element[] {
        let copyEffect = this.mostRecentEffect(EffectName.CopyProvince);
        if(copyEffect) {
            return (copyEffect as ProvinceCard).getElement();
        }

        const symbols = this.getCurrentElementSymbols();
        const elementArray: Element[] = [];
        symbols.forEach((symbol) => {
            if(symbol.key.startsWith('province-element')) {
                elementArray.push(symbol.element);
            }
        });

        return elementArray;
    }

    isElement(element: string): boolean {
        return (this.element as string[]).includes(element);
    }

    hasElementSymbols(): boolean {
        return !!this.cardData.elements && this.cardData.elements.length > 0;
    }

    getPrintedElementSymbols(): ElementSymbolInfo[] {
        const symbols: ElementSymbolInfo[] = [];
        if(this.hasElementSymbols()) {
            const elements =
                this.cardData.elements === 'all' ? ['air', 'earth', 'fire', 'void', 'water'] : this.cardData.elements;
            elements?.forEach((element: string, index: number) => {
                symbols.push({
                    key: `province-element-${index}`,
                    prettyName: 'The Province\'s Element',
                    element: element as Element
                });
            });
        }
        return symbols;
    }

    flipFaceup() {
        this.facedown = false;
    }

    leavesPlay() {
        this.removeAllTokens();
        this.makeOrdinary();
        super.leavesPlay();
    }

    isConflictProvince(): boolean {
        return !!this.game.currentConflict && this.game.currentConflict.getConflictProvinces().includes(this);
    }

    canBeAttacked() {
        const fateCostToAttack = this.getFateCostToAttack();
        const attackers = this.game.isDuringConflict() && this.game.currentConflict ? this.game.currentConflict.attackers : [];
        const fateToDeclareAttackers = attackers.reduce(
            (total, card) => total + card.sumEffects(EffectName.FateCostToAttack),
            0
        );

        return (
            !this.isBroken &&
            !this.anyEffect(EffectName.CannotBeAttacked) &&
            (!this.controller.opponent || this.controller.opponent.fate >= fateCostToAttack + fateToDeclareAttackers) &&
            (this.location !== Location.StrongholdProvince ||
                this.controller.getProvinces((card) => card.isBroken).length > 2 ||
                this.controller.anyEffect(EffectName.StrongholdCanBeAttacked))
        );
    }

    canDeclare(type: string, _ring: unknown): boolean {
        return this.canBeAttacked() && !this.getEffects(EffectName.CannotHaveConflictsDeclaredOfType).includes(type);
    }

    getFateCostToAttack() {
        return this.sumEffects(EffectName.FateCostToRingToDeclareConflictAgainst);
    }

    isBlank(): boolean {
        const ignoreTokens =
            this.game.currentConflict &&
            this.game.currentConflict.anyEffect(EffectName.ConflictIgnoreStatusTokens) &&
            this.isConflictProvince();
        const dishonored = this.isDishonored && !ignoreTokens;
        return this.isBroken || dishonored || super.isBlank();
    }

    breakProvince(): void {
        this.isBroken = true;
        this.removeAllTokens();
        if(!this.controller.opponent) {
            return;
        }

        this.game.addMessage('{0} has broken {1}!', this.controller.opponent, this);

        if(
            this.location === Location.StrongholdProvince ||
            (this.game.gameMode === GameModes.Skirmish &&
                this.controller.getProvinces((card: ProvinceCard) => card.isBroken).length > 2)
        ) {
            this.game.recordWinner(this.controller.opponent, 'conquest');
            return;
        }

        if(!this.game.isDuringConflict()) {
            return;
        }

        for(const dynastyCard of this.cardsInSelf()) {
            if(!dynastyCard) {
                // Why?
                continue;
            }

            const choosingPlayer =
                this.game.isDuringConflict() && this.game.currentConflict?.attackingPlayer
                    ? this.game.currentConflict.attackingPlayer
                    : this.controller.opponent;
            this.game.promptWithHandlerMenu(choosingPlayer, {
                activePromptTitle: `Do you wish to discard ${dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard.name
                }?`,
                source: `Break ${this.name}`,
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.game.addMessage(
                            '{0} chooses to discard {1}',
                            choosingPlayer,
                            dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard
                        );
                        this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: dynastyCard });
                    },
                    () =>
                        this.game.addMessage(
                            '{0} chooses not to discard {1}',
                            choosingPlayer,
                            dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard
                        )
                ]
            });
        }
    }

    restoreProvince(): void {
        this.isBroken = false;
        this.facedown = false;
    }

    cannotBeStrongholdProvince(): boolean {
        return this.hasEminent();
    }

    startsGameFaceup(): boolean {
        return this.hasEminent();
    }

    hideWhenFacedown(): boolean {
        return false;
    }

    getMenu() {
        const menu = super.getMenu();

        if(menu) {
            if(
                this.game.isDuringConflict() &&
                !this.isConflictProvince() &&
                this.canBeAttacked() &&
                this.game.currentConflict?.getConflictProvinces().some((a) => a.controller === this.controller)
            ) {
                menu.push({ command: 'move_conflict', text: 'Move Conflict' });
            }

            if(this.cardsInSelf().length <= 0) {
                menu.push({ command: 'refill', text: 'Refill Province' });
            }
        }

        return menu;
    }

    getSummary(activePlayer: Player, hideWhenFaceup: boolean) {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);
        return {
            ...baseSummary,
            isProvince: this.isProvince,
            isBroken: this.isBroken,
            strengthSummary: this.strengthSummary,
            attachments: this.attachments.map((attachment) => attachment.getSummary(activePlayer, hideWhenFaceup))
        };
    }

    allowAttachment(attachment: DrawCard): boolean {
        if(this.allowedAttachmentTraits.some((trait) => attachment.hasTrait(trait))) {
            return true;
        }

        return true;
    }

    hasEminent(): boolean {
        //Facedown provinces are out of play and their effects don't evaluate, so we check for the printed keyword
        return this.hasKeyword('eminent') || (!this.isBlank() && this.hasPrintedKeyword('eminent'));
    }

    isFaceup(): boolean {
        if(this.game.gameMode === GameModes.Skirmish) {
            return false;
        }
        return super.isFaceup();
    }

    isFacedown(): boolean {
        return this.game.gameMode !== GameModes.Skirmish && super.isFacedown();
    }

    cardsInSelf(): DrawCard[] {
        return this.controller.getDynastyCardsInProvince(this.location);
    }
}

export function isProvinceCard(card: BaseCard): card is ProvinceCard {
    return card.isProvince;
}
