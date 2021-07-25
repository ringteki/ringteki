import {createHash} from 'crypto';

interface CardEntry {
  count:number;
  card: {
    id:string
  }
}

interface Deck {
  provinceCards: CardEntry[];
  stronghold: CardEntry[];
  role: CardEntry[];
  conflictCards: CardEntry[];
  dynastyCards: CardEntry[];
}

export function hashDeck(deck:Deck) {
  const allCards = [
    ...deck.provinceCards,
    ...deck.stronghold,
    ...deck.role,
    ...deck.conflictCards,
    ...deck.dynastyCards
  ];
  const decklistText = allCards.map((entry) => `${entry.count}x ${entry.card.id}`).sort().join('$$');
  return createHash('sha256').update(decklistText).digest('hex');
}
