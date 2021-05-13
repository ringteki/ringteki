const BaseCard = require('./basecard');

const _ = require('underscore');

const { Locations, EffectNames } = require('./Constants');
const AbilityDsl = require('./abilitydsl.js');
const GameModes = require('../GameModes');

class ProvinceCard extends BaseCard {
    constructor(owner, cardData = { strength: 3, element: [], type: 'province', side: 'province', name: 'Skirmish Province', id: 'skirmish-province' }) {
        super(owner, cardData);

        this.isProvince = true;
        this.isBroken = false;
        this.menu = _([
            { command: 'break', text: 'Break/unbreak this province' },
            { command: 'hide', text: 'Flip face down' },
            { command: 'dishonor', text: 'Dishonor' },
            { command: 'honor', text: 'Honor' },
            { command: 'taint', text: 'Taint/Cleanse' }
        ]);

        this.persistentEffect({
            condition: context => context.source.hasEminent(),
            location: Locations.Any,
            effect: AbilityDsl.effects.cardCannot('turnFacedown')
        });
    }

    get strength() {
        return this.getStrength();
    }

    getStrength() {
        if(this.anyEffect(EffectNames.SetProvinceStrength)) {
            return this.mostRecentEffect(EffectNames.SetProvinceStrength);
        }

        let strength = this.baseStrength + this.sumEffects(EffectNames.ModifyProvinceStrength) + this.getDynastyOrStrongholdCardModifier();
        strength = this.getEffects(EffectNames.ModifyProvinceStrengthMultiplier).reduce((total, value) => total * value, strength);
        return Math.max(0, strength);
    }

    get baseStrength() {
        return this.getBaseStrength();
    }

    getBaseStrength() {
        if(this.anyEffect(EffectNames.SetBaseProvinceStrength)) {
            return this.mostRecentEffect(EffectNames.SetBaseProvinceStrength);
        }
        return this.sumEffects(EffectNames.ModifyBaseProvinceStrength) + (parseInt(this.cardData.strength) ? parseInt(this.cardData.strength) : 0);
    }

    getDynastyOrStrongholdCardModifier() {
        let province = this.controller.getSourceList(this.location);
        return province.reduce((bonus, card) => bonus + card.getProvinceStrengthBonus(), 0);
    }

    get element() {
        return this.getElement();
    }

    getElement() {
        const symbols = this.getCurrentElementSymbols();
        const elementArray = [];
        symbols.forEach(symbol => {
            if (symbol.key.startsWith('province-element')) {
                elementArray.push(symbol.element);
            }
        })

        return elementArray; // this.cardData.element;
    }

    isElement(element) {
        return this.element.includes(element);
    }

    hasElementSymbols() {
        return this.cardData.element && this.cardData.element.length > 0;
    }

    getPrintedElementSymbols() {
        let symbols = [];
        if (this.hasElementSymbols()) {
            let elements = this.cardData.element;
            if (elements === 'all') {
                elements = ['air', 'earth', 'fire', 'void', 'water'];
            }
            elements.forEach((element, index) => {
                symbols.push({
                    key: `province-element-${index}`,
                    prettyName: 'Province Element',
                    element: element
                })
            })
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

    isConflictProvince() {
        return this.game.currentConflict && this.game.currentConflict.getConflictProvinces().includes(this);
    }

    canBeAttacked() {
        let fateCostToAttack = this.getFateCostToAttack();
        let attackers = this.game.isDuringConflict() ? this.game.currentConflict.attackers : [];
        let fateToDeclareAttackers = attackers.reduce((total, card) => total + card.sumEffects(EffectNames.FateCostToAttack), 0);

        return !this.isBroken && !this.anyEffect(EffectNames.CannotBeAttacked) &&
            (!this.controller.opponent || this.controller.opponent.fate >= (fateCostToAttack + fateToDeclareAttackers)) &&
            (this.location !== Locations.StrongholdProvince ||
            this.controller.getProvinces(card => card.isBroken).length > 2 ||
            this.controller.anyEffect(EffectNames.StrongholdCanBeAttacked));
    }

    canDeclare(type, ring) { // eslint-disable-line no-unused-vars
        return this.canBeAttacked() && !this.getEffects(EffectNames.CannotHaveConflictsDeclaredOfType).includes(type);
    }

    getFateCostToAttack() {
        return this.sumEffects(EffectNames.FateCostToRingToDeclareConflictAgainst);
    }

    isBlank() {
        return this.isBroken || this.isDishonored || super.isBlank();
    }

    breakProvince() {
        this.isBroken = true;
        this.removeAllTokens();
        if(this.controller.opponent) {
            this.game.addMessage('{0} has broken {1}!', this.controller.opponent, this);
            if(this.location === Locations.StrongholdProvince || this.game.gameMode === GameModes.Skirmish && this.controller.getProvinces(card => card.isBroken).length > 2) {
                this.game.recordWinner(this.controller.opponent, 'conquest');
            } else {
                let dynastyCards = this.controller.getDynastyCardsInProvince(this.location);
                dynastyCards.forEach(dynastyCard => {
                    if(dynastyCard) {
                        let promptTitle = 'Do you wish to discard ' + (dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard.name) + '?';
                        let choosingPlayer = this.controller.opponent;
                        if(this.game.isDuringConflict() && this.game.currentConflict && this.game.currentConflict.attackingPlayer) {
                            choosingPlayer = this.game.currentConflict.attackingPlayer;
                        }
                        this.game.promptWithHandlerMenu(choosingPlayer, {
                            activePromptTitle: promptTitle,
                            source: 'Break ' + this.name,
                            choices: ['Yes', 'No'],
                            handlers: [
                                () => {
                                    this.game.addMessage('{0} chooses to discard {1}', choosingPlayer, dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard);
                                    this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: dynastyCard });
                                },
                                () => this.game.addMessage('{0} chooses not to discard {1}', choosingPlayer, dynastyCard.isFacedown() ? 'the facedown card' : dynastyCard)
                            ]
                        });
                    }
                });
            }
        }
    }

    restoreProvince() {
        this.isBroken = false;
        this.facedown = false;
    }

    cannotBeStrongholdProvince() {
        return this.hasEminent();
    }

    startsGameFaceup() {
        return this.hasEminent();
    }

    hideWhenFacedown() {
        return false;
    }

    getMenu() {
        let menu = super.getMenu();

        if(menu) {
            if(this.game.isDuringConflict() && !this.isConflictProvince() && this.canBeAttacked()
                && this.game.currentConflict.getConflictProvinces().some(a => a.controller === this.controller)) {
                menu.push({ command: 'move_conflict', text: 'Move Conflict'});
            }

            if(this.controller.getDynastyCardsInProvince(this.location).length <= 0) {
                menu.push({ command: 'refill', text: 'Refill Province'});
            }
        }

        return menu;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isProvince: this.isProvince,
            isBroken: this.isBroken,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            })
        });
    }

    allowAttachment(attachment) {
        if(_.any(this.allowedAttachmentTraits, trait => attachment.hasTrait(trait))) {
            return true;
        }

        return (
            true
        );
    }

    hasEminent() {
        //Facedown provinces are out of play and their effects don't evaluate, so we check for the printed keyword
        return this.hasKeyword('eminent') || (!this.isBlank() && this.hasPrintedKeyword('eminent'));
    }

    isFaceup() {
        if(this.game.gameMode === GameModes.Skirmish) {
            return false;
        }
        return super.isFaceup();
    }

    isFacedown() {
        if(this.game.gameMode === GameModes.Skirmish) {
            return false;
        }
        return super.isFacedown();
    }
}

module.exports = ProvinceCard;
