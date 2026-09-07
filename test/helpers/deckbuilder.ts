import fs from 'fs';
import path from 'path';

import { matchCardByNameAndPack } from './cardutil.js';
import { GameModes } from '../../server/GameModes.js';
import type { CardData } from '../../server/game/types/CardData.js';

interface JsonCardData extends CardData {
    pack_code?: string;
}

interface ProvinceSpec {
    provinceCard?: string;
    dynastyCards?: string[];
}

interface InPlayCardSpec {
    card: string;
    attachments?: string[];
}

interface PlayerDeckOptions {
    faction?: string;
    role?: string;
    stronghold?: string;
    strongholdProvince?: string;
    provinces?: string[] | Record<string, ProvinceSpec>;
    dynastyDeck?: string[];
    dynastyDiscard?: string[];
    dynastyDeckSize?: number;
    conflictDeck?: string[];
    conflictDiscard?: string[];
    conflictDeckSize?: number;
    hand?: string[];
    inPlay?: Array<string | InPlayCardSpec>;
}

interface DeckCardCount {
    count: number;
    card: JsonCardData;
}

interface BuiltDeck {
    faction: { value: string };
    stronghold: DeckCardCount[];
    role: DeckCardCount[];
    conflictCards: DeckCardCount[];
    dynastyCards: DeckCardCount[];
    provinceCards: DeckCardCount[];
    outsideTheGameCards: JsonCardData[];
}

const PathToSubModulePacks = path.join(process.cwd(), 'test/json/Card');

const defaultFaction = 'phoenix';
const defaultRole = 'support-of-the-scorpion';
const defaultStronghold = 'city-of-the-open-hand';
const minProvince = 5;
const provinceFiller = 'shameful-display';
const dynastyFiller = 'adept-of-the-waves';
const conflictFiller = 'supernatural-storm';

/**
 * The cards setupTest pads decks with. Specs that read a filler card out of a
 * province (rather than placing their own) must reference these instead of
 * hardcoding the id, so the filler can be changed in one place.
 */
export const fillers = Object.freeze({
    faction: defaultFaction,
    role: defaultRole,
    stronghold: defaultStronghold,
    province: provinceFiller,
    dynasty: dynastyFiller,
    conflict: conflictFiller
});
const dynastyBuffer = 8;
const conflictBuffer = 8;

class DeckBuilder {
    cards: Record<string, JsonCardData>;
    fillers: {
        faction: string;
        role: string;
        stronghold: string;
        province: string;
        dynasty: string;
        conflict: string;
    };

    constructor() {
        this.cards = this.loadCards(PathToSubModulePacks);
        this.fillers = { ...fillers };
    }

    loadCards(directory: string): Record<string, JsonCardData> {
        const cards: Record<string, JsonCardData> = {};

        const jsonCards = fs.readdirSync(directory).filter((file) => file.endsWith('.json'));
        jsonCards.forEach((file) => {
            const cardsInPack: JsonCardData[] = JSON.parse(fs.readFileSync(path.join(PathToSubModulePacks, file), 'utf8'));
            cardsInPack.forEach((card) => {
                cards[card.id] = card;
            });
        });
        return cards;
    }

    customDeck(player: PlayerDeckOptions = {}, gameMode: GameModes = GameModes.Stronghold): BuiltDeck {
        let faction = defaultFaction;
        let role = defaultRole;
        let stronghold = defaultStronghold;
        let provinceDeck: string[] = [];
        const conflictDeck: string[] = [];
        let conflictDeckSize = conflictBuffer;
        const dynastyDeck: string[] = [];
        let dynastyDeckSize = dynastyBuffer;
        const inPlayCards: string[] = [];

        if(player.faction) {
            faction = player.faction;
        }
        if(player.role) {
            role = player.role;
        }
        if(player.stronghold) {
            stronghold = player.stronghold;
        }
        if(player.strongholdProvince && gameMode !== GameModes.Skirmish) {
            provinceDeck.push(player.strongholdProvince);
        }
        if(player.provinces && gameMode !== GameModes.Skirmish) {
            if(Array.isArray(player.provinces)) {
                provinceDeck = provinceDeck.concat(player.provinces);
            } else {
                Object.values(player.provinces).forEach((province) => {
                    if(province.provinceCard) {
                        provinceDeck.push(province.provinceCard);
                    }
                });
            }
        }
        if(gameMode !== GameModes.Skirmish) {
            while(provinceDeck.length < minProvince) {
                provinceDeck.push(provinceFiller);
            }
        }

        let initialDynastySize = 0;
        if(player.dynastyDeckSize) {
            dynastyDeckSize = player.dynastyDeckSize;
        }
        if(player.dynastyDeck) {
            dynastyDeck.push(...player.dynastyDeck);
            initialDynastySize = player.dynastyDeck.length;
        }
        if(player.dynastyDiscard) {
            dynastyDeck.push(...player.dynastyDiscard);
        }
        if(player.provinces && !Array.isArray(player.provinces)) {
            Object.values(player.provinces).forEach((province) => {
                if(province && province.dynastyCards) {
                    dynastyDeck.push(...province.dynastyCards);
                }
            });
        }
        for(let i = initialDynastySize; i < dynastyDeckSize; i++) {
            dynastyDeck.push(dynastyFiller);
        }

        let initialConflictSize = 0;
        if(player.conflictDeckSize) {
            conflictDeckSize = player.conflictDeckSize;
        }
        if(player.conflictDeck) {
            conflictDeck.push(...player.conflictDeck);
            initialConflictSize = player.conflictDeck.length;
        }
        if(player.conflictDiscard) {
            conflictDeck.push(...player.conflictDiscard);
        }
        if(player.hand) {
            conflictDeck.push(...player.hand);
        }
        for(let i = initialConflictSize; i < conflictDeckSize; i++) {
            conflictDeck.push(conflictFiller);
        }

        (player.inPlay || []).forEach((card) => {
            if(typeof card === 'string') {
                inPlayCards.push(card);
            } else {
                inPlayCards.push(card.card);
                if(card.attachments) {
                    inPlayCards.push(...card.attachments);
                }
            }
        });

        const deck = provinceDeck.concat(conflictDeck)
            .concat(dynastyDeck).concat(inPlayCards)
            .concat(gameMode === GameModes.Skirmish ? [] : role).concat(gameMode === GameModes.Skirmish ? [] : stronghold);

        return this.buildDeck(faction, deck);
    }

    buildDeck(faction: string, cardLabels: string[]): BuiltDeck {
        const cardCounts: Record<string, DeckCardCount> = {};
        cardLabels.forEach((label) => {
            const cardData = this.getCard(label);
            if(cardCounts[cardData.id]) {
                cardCounts[cardData.id].count++;
            } else {
                cardCounts[cardData.id] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        return {
            faction: { value: faction },
            stronghold: Object.values(cardCounts).filter((count) => count.card.type === 'stronghold'),
            role: Object.values(cardCounts).filter((count) => count.card.type === 'role'),
            conflictCards: Object.values(cardCounts).filter((count) => count.card.side === 'conflict'),
            dynastyCards: Object.values(cardCounts).filter((count) => count.card.side === 'dynasty'),
            provinceCards: Object.values(cardCounts).filter((count) => count.card.type === 'province'),
            outsideTheGameCards: this.getShadowlandsSummonables()
        };
    }

    getCard(idOrLabelOrName: string): JsonCardData {
        if(this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        const cardsByName = Object.values(this.cards).filter(matchCardByNameAndPack(idOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            const matchingLabels = cardsByName.map((card) => `${card.name} (${card.pack_code})`).join('\n');
            throw new Error(`Multiple cards match the name ${idOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }

    getShadowlandsSummonables(): JsonCardData[] {
        const val: JsonCardData[] = [];

        val.push(this.cards['bloodthirsty-kansen']);
        val.push(this.cards['bog-hag']);
        val.push(this.cards['dark-moto']);
        val.push(this.cards['endless-ranks']);
        val.push(this.cards['fouleye-s-elite']);
        val.push(this.cards['goblin-brawler']);
        val.push(this.cards['insatiable-gaki']);
        val.push(this.cards['lost-samurai']);
        val.push(this.cards['onikage-rider']);
        val.push(this.cards['oni-of-obsidian-and-blood']);
        val.push(this.cards['penanggalan']);
        val.push(this.cards['scavenging-goblin']);
        val.push(this.cards['shambling-servant']);
        val.push(this.cards['skeletal-warrior']);
        val.push(this.cards['undead-horror']);
        val.push(this.cards['wild-ogre']);

        return val;
    }
}

export default DeckBuilder;
