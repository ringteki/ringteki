import { RoleCard } from '../../../server/game/RoleCard.js';
import type { CardData } from '../../../server/game/types/CardData.js';
import { Location } from '../../../server/game/Constants.js';

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

describe('RoleCard', () => {
    let game: ReturnType<typeof makeGame>;
    let owner: ReturnType<typeof makeOwner>;
    let card: RoleCard;
    let cardData: CardData;

    beforeEach(() => {
        game = makeGame();
        owner = makeOwner(game);

        cardData = {
            id: 'role-test',
            name: 'Test Role',
            type: 'role',
            clan: 'neutral',
            influence_pool: 3
        };

        card = new RoleCard(owner, cardData);
    });

    describe('construction', () => {
        it('marks the card as a role', () => {
            expect(card.isRole).toBe(true);
        });

        it('initialises influenceModifier to 0', () => {
            expect(card.influenceModifier).toBe(0);
        });
    });

    describe('getInfluence()', () => {
        it('returns the influence pool from card data', () => {
            expect(card.getInfluence()).toBe(3);
        });

        it('adds a positive influenceModifier to influence pool', () => {
            card.influenceModifier = 2;
            expect(card.getInfluence()).toBe(5);
        });

        it('subtracts a negative influenceModifier from influence pool', () => {
            card.influenceModifier = -1;
            expect(card.getInfluence()).toBe(2);
        });

        it('returns the correct value when influence pool differs', () => {
            const other = new RoleCard(owner, { ...cardData, influence_pool: 8 });
            expect(other.getInfluence()).toBe(8);
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

    describe('getElement()', () => {
        it('returns an empty array', () => {
            expect(card.getElement()).toEqual([]);
        });

        it('always returns a new empty array', () => {
            expect(card.getElement()).not.toBe(card.getElement());
        });
    });

    describe('allowGameAction()', () => {
        const illegalActions = [
            'bow', 'ready', 'dishonor', 'honor', 'sacrifice', 'discardFromPlay',
            'moveToConflict', 'sendHome', 'putIntoPlay', 'putIntoConflict',
            'break', 'returnToHand', 'takeControl', 'placeFate', 'removeFate'
        ];

        illegalActions.forEach((action) => {
            it(`blocks the '${action}' action`, () => {
                expect(card.allowGameAction(action)).toBe(false);
            });
        });

        it('allows an action that is not on the illegal list', () => {
            expect(card.allowGameAction('customLegalAction')).toBe(true);
        });

        it('never delegates to the parent for illegal actions', () => {
            spyOn(Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(card))), 'allowGameAction').and.returnValue(true);
            expect(card.allowGameAction('bow')).toBe(false);
        });
    });

    describe('getSummary()', () => {
        let summary: ReturnType<RoleCard['getSummary']>;

        beforeEach(() => {
            card.location = Location.Role;
            summary = card.getSummary(owner);
        });

        it('includes the isRole flag', () => {
            expect(summary.isRole).toBe(true);
        });

        it('includes the current location', () => {
            expect(summary.location).toBe('role');
        });

        it('reflects location changes', () => {
            card.location = Location.RemovedFromGame;
            expect(card.getSummary(owner).location).toBe('removed from game');
        });

        it('reflects base card summary fields', () => {
            expect((summary as Record<string, unknown>).uuid).toBeDefined();
        });
    });
});
