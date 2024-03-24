import type { AbilityContext } from '../AbilityContext';
import type BaseCard from '../basecard';
import type { CardTypes } from '../Constants';
import type DrawCard from '../drawcard';
import { GameAction } from '../GameActions/GameAction';
import type { ProvinceCard } from '../ProvinceCard';
import type { RoleCard } from '../RoleCard';
import type { StrongholdCard } from '../StrongholdCard';

export type CardCondition =
    | { cardType?: undefined; cardCondition?: (card: BaseCard, context: AbilityContext) => boolean }
    | { cardType: CardTypes.Stronghold; cardCondition?: (card: StrongholdCard, context: AbilityContext) => boolean }
    | { cardType: CardTypes.Role; cardCondition?: (card: RoleCard, context: AbilityContext) => boolean }
    | { cardType: CardTypes.Province; cardCondition?: (card: ProvinceCard, context: AbilityContext) => boolean }
    | {
          cardType:
              | CardTypes.Character
              | CardTypes.Holding
              | CardTypes.Event
              | CardTypes.Attachment
              | Array<CardTypes.Character | CardTypes.Holding | CardTypes.Event | CardTypes.Attachment>;
          cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
      }
    | {
          cardType: Array<CardTypes.Character | CardTypes.Province>;
          cardCondition?: (card: DrawCard | ProvinceCard, context: AbilityContext) => boolean;
      };

export type GameActionEnforced = { gameAction?: GameAction[] };

export type GameActionUnenforce = { gameAction?: GameAction | GameAction[] };
