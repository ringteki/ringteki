import { matchCardByNameAndPack } from './cardutil.js';
import { detectBinary } from '../../server/util.js';
import { GameModes } from '../../server/GameModes.js';
import type Game from '../../server/game/Game.js';
import type Player from '../../server/game/Player.js';
import type BaseCard from '../../server/game/BaseCard.js';
import type DrawCard from '../../server/game/DrawCard.js';
import type { ProvinceCard } from '../../server/game/ProvinceCard.js';
import type Ring from '../../server/game/Ring.js';

type CardLike = BaseCard | string;

interface InPlayCardSpec {
    card: string;
    fate?: number;
    honor?: 'honored' | 'dishonored';
    bowed?: boolean;
    covert?: boolean;
    attachments?: string[];
}

interface ProvinceContents {
    provinceCard?: CardLike;
    dynastyCards?: CardLike[];
}

class PlayerInteractionWrapper {
    game: Game;
    player: Player;

    constructor(game: Game, player: Player) {
        this.game = game;
        this.player = player;

        player.noTimer = true;
        player.user = {
            username: '',
            settings: {}
        };
    }

    get name(): string {
        return this.player.name;
    }

    get fate(): number {
        return this.player.fate;
    }

    set fate(newFate: number) {
        if(newFate >= 0) {
            this.player.fate = newFate;
        }
    }

    get honor(): number {
        return this.player.honor;
    }

    set honor(newHonor: number) {
        if(newHonor > 0) {
            this.player.honor = newHonor;
        }
    }

    get hand(): BaseCard[] {
        return this.player.hand;
    }

    set hand(cards: any) {
        if(!cards) {
            cards = [];
        }
        const cardsInHand = this.hand;
        cardsInHand.forEach((card) => this.moveCard(card, 'conflict deck'));
        const resolved = this.mixedListToCardList(cards as CardLike[], 'conflict deck');
        resolved.forEach((card) => this.moveCard(card, 'hand'));
    }

    get stronghold(): BaseCard[] {
        return this.player.strongholdProvince;
    }

    get provinces(): Record<string, { provinceCard?: BaseCard; dynastyCards: BaseCard[] }> {
        return {
            'province 1': {
                provinceCard: this.player.provinceOne.find((card) => card.isProvince),
                dynastyCards: this.player.provinceOne.filter((card) => !card.isProvince)
            },
            'province 2': {
                provinceCard: this.player.provinceTwo.find((card) => card.isProvince),
                dynastyCards: this.player.provinceTwo.filter((card) => !card.isProvince)
            },
            'province 3': {
                provinceCard: this.player.provinceThree.find((card) => card.isProvince),
                dynastyCards: this.player.provinceThree.filter((card) => !card.isProvince)
            },
            'province 4': {
                provinceCard: this.player.provinceFour.find((card) => card.isProvince),
                dynastyCards: this.player.provinceFour.filter((card) => !card.isProvince)
            }
        };
    }

    set provinces(newProvinceState: any) {
        if(!newProvinceState) {
            return;
        }
        let normalized: Record<string, ProvinceContents>;
        if(Array.isArray(newProvinceState)) {
            normalized = {};
            newProvinceState.forEach((card: CardLike, index: number) => {
                normalized[`province ${index + 1}`] = { provinceCard: card };
            });
        } else {
            normalized = newProvinceState;
        }
        const allProvinceLocations = Object.keys(this.provinces);
        Object.values(this.provinces).forEach((contents) => {
            if(contents.provinceCard) {
                this.moveCard(contents.provinceCard, 'province deck');
            }
        });
        Object.entries(normalized).forEach(([location, state]) => {
            if(!allProvinceLocations.includes(location)) {
                throw new Error(`${location} is not a valid province`);
            }
            let provinceCard = state.provinceCard;
            const dynastyCards = state.dynastyCards;
            if(provinceCard) {
                provinceCard = this.mixedListToCardList([provinceCard], 'province deck')[0];
                this.moveCard(provinceCard, location);
            }
            if(dynastyCards) {
                const resolved = this.mixedListToCardList(dynastyCards, 'dynasty deck');
                resolved.forEach((card) => this.placeCardInProvince(card, location));
            }
        });
        Object.entries(this.provinces).forEach(([location, state]) => {
            let provinceCard: BaseCard | undefined = state.provinceCard;
            if(!provinceCard) {
                provinceCard = this.provinceDeck[0];
                this.moveCard(provinceCard, location);
            }
        });
    }

    get inPlay(): DrawCard[] {
        return this.player.filterCardsInPlay(() => true);
    }

    set inPlay(newState: any) {
        if(!newState) {
            newState = [];
        }
        this.inPlay.forEach((card) => {
            if(card.isDynasty) {
                this.moveCard(card, 'dynasty deck');
            }
            if(card.isConflict) {
                this.moveCard(card, 'conflict deck');
            }
        });
        (newState as Array<string | InPlayCardSpec>).forEach((entry) => {
            const options: InPlayCardSpec = typeof entry === 'string' ? { card: entry } : entry;
            if(!options.card) {
                throw new Error('You must provide a card name');
            }
            const card = this.findCardByName(options.card, ['dynasty deck', 'conflict deck', 'hand', 'provinces']) as DrawCard;
            this.moveCard(card, 'play area');
            if(options.fate) {
                card.fate = options.fate;
            }
            if(options.honor) {
                if(options.honor === 'honored') {
                    card.honor();
                }
                if(options.honor === 'dishonored') {
                    card.dishonor();
                }
            }
            if(options.bowed !== undefined) {
                options.bowed ? card.bow() : card.ready();
            }
            if(options.covert !== undefined) {
                card.covert = options.covert;
            }
            if(options.attachments) {
                const attachments: BaseCard[] = [];
                options.attachments.forEach((attachmentName) => {
                    const attachment = this.findCardByName(attachmentName, ['conflict deck', 'hand']);
                    attachments.push(attachment);
                });
                const playerAny = this.player as { attach?: (a: BaseCard, b: BaseCard) => void };
                attachments.forEach((attachment) => {
                    if(!playerAny.attach) {
                        throw new Error('player.attach is not implemented');
                    }
                    playerAny.attach(attachment, card);
                });
            }
        });
    }

    get conflictDeck(): DrawCard[] {
        return this.player.conflictDeck;
    }

    get conflictDiscard(): DrawCard[] {
        return this.player.conflictDiscardPile;
    }

    set conflictDiscard(newContents: any) {
        if(!newContents) {
            newContents = [];
        }
        this.conflictDiscard.slice().forEach((card) => {
            this.moveCard(card, 'conflict deck');
        });
        (newContents as string[]).slice().reverse().forEach((name: string) => {
            const card = this.findCardByName(name, 'conflict deck');
            this.moveCard(card, 'conflict discard pile');
        });
    }

    get dynastyDeck(): DrawCard[] {
        return this.player.dynastyDeck;
    }

    get dynastyDiscard(): BaseCard[] {
        return this.player.dynastyDiscardPile;
    }

    set dynastyDiscard(newContents: any) {
        if(!newContents) {
            return;
        }
        this.dynastyDiscard.slice().forEach((card) => {
            this.moveCard(card, 'dynasty deck');
        });
        (newContents as string[]).slice().reverse().forEach((name: string) => {
            const card = this.findCardByName(name, ['dynasty deck', 'provinces']);
            this.moveCard(card, 'dynasty discard pile');
        });
    }

    get provinceDeck(): BaseCard[] {
        return this.player.provinceDeck;
    }

    get firstPlayer(): boolean {
        return this.player.firstPlayer;
    }

    get opponent(): Player | undefined {
        return this.player.opponent;
    }

    currentPrompt(): any {
        return this.player.currentPrompt();
    }

    get currentButtons(): string[] {
        const buttons = this.currentPrompt().buttons;
        return buttons.map((button: { text: string | number }) => button.text.toString());
    }

    get currentActionTargets(): BaseCard[] {
        return this.player.promptState.selectableCards;
    }

    get currentActionRingTargets(): Ring[] {
        return this.player.promptState.selectableRings;
    }

    get selectedCards(): BaseCard[] {
        return this.player.promptState.selectedCards ?? [];
    }

    get canAct(): boolean {
        return !this.hasPrompt('Waiting for opponent to take an action or pass');
    }

    formatPrompt(): string {
        const prompt = this.currentPrompt();
        const selectableCards = this.currentActionTargets;

        if(!prompt) {
            return 'no prompt active';
        }

        return (
            prompt.menuTitle +
            '\n' +
            prompt.buttons.map((button: { text: string | number; disabled?: boolean }) =>
                '[ ' + button.text + (button.disabled ? ' (disabled)' : '') + ' ]'
            ).join('\n') +
            '\n' +
            selectableCards.map((c) => c.name).join('\n')
        );
    }

    findCardByName(name: string, locations: string | string[] = 'any', side?: string): BaseCard {
        return this.filterCardsByName(name, locations, side)[0];
    }

    findAllCardsByName(name: string, locations: string | string[] = 'any', side?: string): BaseCard[] {
        return this.filterCardsByName(name, locations, side);
    }

    filterCardsByName(name: string, locations: string | string[] = 'any', side?: string): BaseCard[] {
        const matchFunc = matchCardByNameAndPack(name);
        let locs: string | string[] = locations;
        if(locs !== 'any') {
            if(!Array.isArray(locs)) {
                locs = [locs];
            }
            if(locs.includes('provinces')) {
                locs = locs.filter((elem) => elem !== 'provinces').concat(
                    'province 1',
                    'province 2',
                    'province 3',
                    'province 4'
                );
            }
        }
        try {
            return this.filterCards(
                (card) => matchFunc(card.cardData) &&
                    (locs === 'any' || (Array.isArray(locs) && locs.includes(card.location))),
                side
            );
        } catch(e) {
            throw new Error(`Name: ${name}, Location: ${String(locs)}. Error thrown: ${String(e)}`);
        }
    }

    findCard(condition: (card: BaseCard) => boolean, side?: string): BaseCard {
        return this.filterCards(condition, side)[0];
    }

    filterCards(condition: (card: BaseCard) => boolean, side?: string): BaseCard[] {
        let player: Player = this.player;
        if(side === 'opponent' && this.opponent) {
            player = this.opponent;
        }
        const cards: BaseCard[] = player.preparedDeck.allCards.filter(condition);
        if(cards.length === 0) {
            throw new Error(`Could not find any matching cards for ${player.name}`);
        }
        return cards;
    }

    placeCardInProvince(card: CardLike, location: string = 'province 1'): BaseCard {
        const resolved: BaseCard = typeof card === 'string' ? this.findCardByName(card) : card;
        if(!['province 1', 'province 2', 'province 3', 'province 4'].includes(location)) {
            throw new Error(`${location} is not a valid province`);
        }
        if(resolved.location !== location) {
            const oldLocation = resolved.location;
            const existing = this.player.getDynastyCardInProvince(location);
            if(existing) {
                this.player.moveCard(existing, 'dynasty deck');
            }
            this.player.moveCard(resolved, location);
            this.player.replaceDynastyCard(oldLocation);
        }
        resolved.facedown = false;
        if(this.game.currentPhase !== 'setup') {
            this.game.checkGameState(true);
        }
        return resolved;
    }

    putIntoPlay(card: CardLike): BaseCard {
        const resolved: BaseCard = typeof card === 'string' ? this.findCardByName(card) : card;
        if(resolved.location !== 'play area') {
            this.player.moveCard(resolved, 'play area');
        }
        resolved.facedown = false;
        return resolved;
    }

    hasPrompt(title: string): boolean {
        const currentPrompt = this.player.currentPrompt();
        return !!(
            currentPrompt &&
            ((currentPrompt.menuTitle && currentPrompt.menuTitle.toLowerCase() === title.toLowerCase()) ||
                (currentPrompt.promptTitle && currentPrompt.promptTitle.toLowerCase() === title.toLowerCase()))
        );
    }

    hasPromptButton(text: string | number): boolean {
        const textStr = text.toString().toLowerCase();
        return this.player.currentPrompt().buttons.some(
            (button) => button.text?.toString().toLowerCase() === textStr && !button.disabled
        );
    }

    selectDeck(deck: unknown): void {
        this.game.selectDeck(this.player.name, deck);
    }

    clickPrompt(text: string | number): void {
        const textStr = text.toString();
        const currentPrompt = this.player.currentPrompt();
        const promptButton = currentPrompt.buttons.find(
            (button) => button.text?.toString().toLowerCase() === textStr.toLowerCase()
        );

        if(!promptButton || promptButton.disabled) {
            throw new Error(
                `Couldn't click on "${textStr}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, promptButton.arg as string, promptButton.uuid as string, promptButton.method as string);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickPromptButtonIndex(index: number): void {
        const currentPrompt = this.player.currentPrompt();

        if(currentPrompt.buttons.length <= index) {
            throw new Error(
                `Couldn't click on Button "${index}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        const promptButton = currentPrompt.buttons[index];

        if(!promptButton || promptButton.disabled) {
            throw new Error(
                `Couldn't click on Button "${index}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, promptButton.arg as string, promptButton.uuid as string, promptButton.method as string);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    chooseCardInPrompt(cardName: string, controlName: string): void {
        const currentPrompt = this.player.currentPrompt();

        const promptControl = currentPrompt.controls.find(
            (control) => (control.name as string).toLowerCase() === controlName.toLowerCase()
        );

        if(!promptControl) {
            throw new Error(
                `Couldn't click card "${cardName}" for ${this.player.name} - unable to find control "${controlName}". Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, cardName, promptControl.uuid as string, promptControl.method as string);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickCard(card: CardLike, location: string | string[] = 'any', side?: string): BaseCard {
        const resolved: BaseCard = typeof card === 'string' ? this.findCardByName(card, location, side) : card;
        this.game.cardClicked(this.player.name, resolved.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
        return resolved;
    }

    clickRing(element: string): void {
        this.game.ringClicked(this.player.name, element);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickMenu(card: CardLike, menuText: string): void {
        const resolved: BaseCard = typeof card === 'string' ? this.findCardByName(card) : card;

        const menu = resolved.getMenu() ?? [];
        const items = menu.filter((item: { text: string }) => item.text === menuText);

        if(items.length === 0) {
            throw new Error(`Card ${resolved.name} does not have a menu item "${menuText}"`);
        }

        this.game.menuItemClick(this.player.name, resolved.uuid, items[0]);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    dragCard(card: BaseCard, targetLocation: string): void {
        this.game.drop(this.player.name, card.uuid, card.location, targetLocation);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    moveCard(card: CardLike, targetLocation: string, searchLocations: string | string[] = 'any'): BaseCard {
        const resolved: BaseCard = typeof card === 'string' ? this.mixedListToCardList([card], searchLocations)[0] : card;
        this.player.moveCard(resolved, targetLocation);
        this.game.continue();
        return resolved;
    }

    claimRing(element: string): void {
        if(!element) {
            return;
        }
        if(!['fire', 'earth', 'water', 'air', 'void'].includes(element)) {
            throw new Error(`${element} is not a valid ring selection`);
        }
        this.game.rings[element].claimRing(this.player);
        this.game.checkGameState(true);
        this.game.continue();
    }

    get claimedRings(): string[] {
        return this.player.getClaimedRings().map((ring) => ring.element);
    }

    togglePromptedActionWindow(window: string, value: boolean): void {
        this.player.promptedActionWindows[window] = value;
    }

    pass(): void {
        if(!this.canAct) {
            throw new Error(`${this.name} can't pass, because they don't have priority`);
        }
        this.clickPrompt('Pass');
    }

    passConflict(): void {
        if(!this.hasPrompt('Initiate Conflict')) {
            throw new Error(
                `${this.name} can't pass their conflict, because they are not being prompted to declare one`
            );
        }
        this.clickPrompt('Pass Conflict');
        this.clickPrompt('Yes');
    }

    selectStrongholdProvince(card: string): void {
        if(this.game.gameMode === GameModes.Skirmish) {
            return;
        }
        if(!this.hasPrompt('Select stronghold province')) {
            throw new Error(`${this.name} is not prompted to select a province`);
        }
        const found = this.findCardByName(card, 'province deck');
        this.clickCard(found);
        this.clickPrompt('Done');
    }

    bidHonor(honoramt: number = 1): void {
        if(!this.currentButtons.includes(honoramt.toString())) {
            throw new Error(`${honoramt} is not a valid selection for ${this.name}`);
        }
        if(honoramt > (this.player.deck.conflictCards?.length ?? 0)) {
            throw new Error(`${this.name} cannot bid ${honoramt}, because they don't have enough cards in the deck`);
        }
        this.clickPrompt(honoramt);
    }

    playFromProvinces(card: string, fate: number = 0): void {
        if(!this.canAct) {
            throw new Error(`${this.name} cannot act`);
        }
        if(fate > 4) {
            throw new Error(`Can't place ${fate} tokens. Currently, up to 4 may be placed`);
        }
        if((this.player.deck.dynastyCards?.length ?? 0) <= 0) {
            throw new Error(
                `${this.name} can't play cards from dynasty, because player has no cards to refill the province with`
            );
        }
        let candidates = this.filterCardsByName(card, 'provinces');
        candidates = candidates.filter((c) => !c.isFacedown());
        if(candidates.length === 0) {
            throw new Error(`${this.name} cannot play the specified card from the provinces`);
        }
        const target = candidates[0];
        this.clickCard(target, 'provinces');
        if(!this.currentButtons.includes(fate.toString())) {
            this.clickPrompt('Cancel');
            throw new Error(`Player ${this.name} does not have enough fate to place ${fate} tokens.`);
        }
        this.clickPrompt(fate);
    }

    playAttachment(attachment: CardLike, target: CardLike): BaseCard {
        const card = this.clickCard(attachment, 'hand');
        if(this.currentButtons.includes('Play ' + card.name + ' as an attachment')) {
            this.clickPrompt('Play ' + card.name + ' as an attachment');
        }
        this.clickCard(target, 'play area');
        return card;
    }

    playCharacterFromHand(card: CardLike, fate: number = 0): BaseCard {
        const resolved: BaseCard = typeof card === 'string' ? this.findCardByName(card, 'hand') : card;
        this.clickCard(resolved, 'hand');
        if(this.currentButtons.includes('Play this character')) {
            this.clickPrompt('Play this character');
        }
        this.clickPrompt(fate.toString());
        return resolved;
    }

    declareConflict(conflictType: string, province?: CardLike, attackers: CardLike[] = [], ring: string = 'void'): void {
        if(!ring || !['void', 'fire', 'water', 'air', 'earth'].includes(ring)) {
            throw new Error(`${ring} is not a valid ring selection`);
        }
        let resolvedProvince: BaseCard;
        if(typeof province === 'string') {
            resolvedProvince = this.findCardByName(province, 'any', 'opponent');
        } else if(!province) {
            resolvedProvince = this.findCard(
                (c) => c.isProvince && c.location === 'province 1',
                'opponent'
            );
        } else {
            resolvedProvince = province;
        }
        if((resolvedProvince as ProvinceCard).isBroken) {
            throw new Error(`Cannot initiate conflict on ${resolvedProvince.name} because it is broken`);
        }
        if(!conflictType || !['military', 'political'].includes(conflictType)) {
            throw new Error(`${conflictType} is not a valid conflict type`);
        }
        let resolvedAttackers = this.mixedListToCardList(attackers, 'play area');
        resolvedAttackers = this.filterUnableToParticipate(resolvedAttackers, conflictType);

        this.clickRing(ring);
        if(this.game.currentConflict && this.game.currentConflict.conflictType !== conflictType) {
            this.clickRing(ring);
        }
        this.clickCard(resolvedProvince);
        if(resolvedAttackers.length > 0) {
            resolvedAttackers.forEach((c) => this.clickCard(c));
            this.clickPrompt('Initiate Conflict');
            if(this.hasPrompt('You still have unused Covert - are you sure?')) {
                this.clickPrompt('Yes');
            }
        }
    }

    assignDefenders(defenders: CardLike[] = []): void {
        if(defenders.length !== 0) {
            const conflictType = this.game.currentConflict?.conflictType ?? '';
            let resolved = this.mixedListToCardList(defenders, 'play area');
            resolved = this.filterUnableToParticipate(resolved, conflictType);
            if(resolved.length === 0) {
                throw new Error(`None of the specified attackers can participate in ${conflictType} conflicts`);
            }
            resolved.forEach((card) => {
                this.clickCard(card);
            });
        }
        this.clickPrompt('Done');
    }

    mixedListToCardList(mixed: CardLike[] | undefined, locations: string | string[] = 'any'): BaseCard[] {
        if(!mixed) {
            return [];
        }
        const cardList: BaseCard[] = mixed.filter((card): card is BaseCard => typeof card !== 'string');
        const names: string[] = mixed.filter((card): card is string => typeof card === 'string');
        names.forEach((name) => {
            const cardObject = this.filterCardsByName(name, locations).find((c) => !cardList.includes(c));
            if(!cardObject) {
                throw new Error(`Could not find card named ${name}`);
            }
            cardList.push(cardObject);
        });
        return cardList;
    }

    filterUnableToParticipate(cardList: BaseCard[], type: string): BaseCard[] {
        return cardList.filter((card) => {
            if(!card) {
                return false;
            }
            return !(card as DrawCard).hasDash(type);
        });
    }

    checkUnserializableGameState(): void {
        const state = this.game.getState(this.player.name);
        const results = detectBinary(state);
        if(results.length !== 0) {
            throw new Error('Unable to serialize game state back to client:\n' + JSON.stringify(results));
        }
    }

    reduceDeckToNumber(deck: string, number: number): void {
        if(deck === 'conflict deck') {
            for(let i = this.conflictDeck.length - 1; i >= number; i--) {
                this.moveCard(this.conflictDeck[i], 'conflict discard pile');
            }
        } else if(deck === 'dynasty deck') {
            for(let i = this.dynastyDeck.length - 1; i >= number; i--) {
                this.moveCard(this.dynastyDeck[i], 'dynasty discard pile');
            }
        }
    }

    setupSkirmishProvinces(): void {
        const p1 = this.player.getProvinceCardInProvince('province 1');
        const p2 = this.player.getProvinceCardInProvince('province 2');
        const p3 = this.player.getProvinceCardInProvince('province 3');
        if(p1) {
            this.provinceDeck.push(p1);
        }
        if(p2) {
            this.provinceDeck.push(p2);
        }
        if(p3) {
            this.provinceDeck.push(p3);
        }
    }
}

export default PlayerInteractionWrapper;
