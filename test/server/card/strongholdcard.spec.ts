import { StrongholdCard } from '../../../server/game/StrongholdCard.js';
import type { CardData } from '../../../server/game/types/CardData.js';

function makeGame() {
    const game = jasmine.createSpyObj('game', ['raiseEvent', 'getCurrentAbilityContext', 'getFrameworkContext', 'getPlayers']);
    game.getFrameworkContext.and.returnValue(null);
    game.getPlayers.and.returnValue([]);
    return game;
}

function makeOwner(game: ReturnType<typeof makeGame>) {
    const owner = jasmine.createSpyObj('owner', ['getCardSelectionState', 'allowGameAction', 'getShortSummary', 'checkRestrictions']);
    owner.getCardSelectionState.and.returnValue({});
    owner.allowGameAction.and.returnValue(true);
    owner.checkRestrictions.and.returnValue(true);
    owner.game = game;
    return owner;
}

describe('StrongholdCard', () => {
    let game: ReturnType<typeof makeGame>;
    let owner: ReturnType<typeof makeOwner>;
    let card: StrongholdCard;
    let cardData: CardData;

    beforeEach(() => {
        game = makeGame();
        owner = makeOwner(game);

        cardData = {
            id: 'stronghold-test',
            name: 'Test Stronghold',
            type: 'stronghold',
            clan: 'crab',
            fate: 7,
            honor: 10,
            influence_pool: 12,
            strength_bonus: '3'
        };

        card = new StrongholdCard(owner, cardData);
    });

    describe('construction', () => {
        it('marks the card as a stronghold', () => {
            expect(card.isStronghold).toBe(true);
        });

        it('starts unbowed', () => {
            expect(card.bowed).toBe(false);
        });

        it('includes a bow command in the context menu', () => {
            expect(card.menu).toContain(jasmine.objectContaining({ command: 'bow' }));
        });
    });

    describe('getFate()', () => {
        it('returns the fate value from card data', () => {
            expect(card.getFate()).toBe(7);
        });

        it('returns the correct value when fate differs', () => {
            const other = new StrongholdCard(owner, { ...cardData, fate: 9 });
            expect(other.getFate()).toBe(9);
        });
    });

    describe('getStartingHonor()', () => {
        it('returns the starting honor from card data', () => {
            expect(card.getStartingHonor()).toBe(10);
        });

        it('returns the correct value when honor differs', () => {
            const other = new StrongholdCard(owner, { ...cardData, honor: 13 });
            expect(other.getStartingHonor()).toBe(13);
        });
    });

    describe('getInfluence()', () => {
        it('returns the influence pool from card data', () => {
            expect(card.getInfluence()).toBe(12);
        });

        it('returns the correct value when influence pool differs', () => {
            const other = new StrongholdCard(owner, { ...cardData, influence_pool: 8 });
            expect(other.getInfluence()).toBe(8);
        });
    });

    describe('getProvinceStrengthBonus()', () => {
        it('returns the strength bonus as an integer', () => {
            expect(card.getProvinceStrengthBonus()).toBe(3);
        });

        it('parses a string value to integer', () => {
            const other = new StrongholdCard(owner, { ...cardData, strength_bonus: '5' });
            expect(other.getProvinceStrengthBonus()).toBe(5);
        });

        it('returns 0 when strength_bonus is 0', () => {
            const other = new StrongholdCard(owner, { ...cardData, strength_bonus: '0' });
            expect(other.getProvinceStrengthBonus()).toBe(0);
        });
    });

    describe('bow()', () => {
        it('sets bowed to true', () => {
            card.bow();
            expect(card.bowed).toBe(true);
        });

        it('does not change other card state', () => {
            card.bow();
            expect(card.isStronghold).toBe(true);
            expect(card.facedown).toBe(false);
        });
    });

    describe('ready()', () => {
        beforeEach(() => {
            card.bow();
        });

        it('sets bowed to false', () => {
            card.ready();
            expect(card.bowed).toBe(false);
        });
    });

    describe('flipFaceup()', () => {
        beforeEach(() => {
            card.facedown = true;
        });

        it('sets facedown to false', () => {
            card.flipFaceup();
            expect(card.facedown).toBe(false);
        });
    });

    describe('getSummary()', () => {
        let summary: ReturnType<StrongholdCard['getSummary']>;

        beforeEach(() => {
            summary = card.getSummary(owner);
        });

        it('includes the isStronghold flag', () => {
            expect(summary.isStronghold).toBe(true);
        });

        it('includes the bowed state when unbowed', () => {
            expect(summary.bowed).toBe(false);
        });

        it('includes the bowed state when bowed', () => {
            card.bow();
            expect(card.getSummary(owner).bowed).toBe(true);
        });

        it('includes a childCards array', () => {
            expect(summary.childCards).toBeDefined();
            expect(Array.isArray(summary.childCards)).toBe(true);
        });

        it('reflects base card summary fields', () => {
            expect((summary as Record<string, unknown>).uuid).toBeDefined();
        });
    });
});
