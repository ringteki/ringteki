import type { AbilityContext } from '../AbilityContext';
import type BaseCard from '../basecard';
import type { CardTypes } from '../Constants';
import type DrawCard from '../drawcard';
import type { ProvinceCard } from '../ProvinceCard';
import type { RoleCard } from '../RoleCard';
import type { StrongholdCard } from '../StrongholdCard';

export type CardCondition =
    | { cardCondition?: (card: BaseCard, context: AbilityContext) => boolean }
    | { cardType: CardTypes.Stronghold; cardCondition?: (card: StrongholdCard, context: AbilityContext) => boolean }
    | { cardType: CardTypes.Role; cardCondition?: (card: RoleCard, context: AbilityContext) => boolean }
    | { cardType: CardTypes.Province; cardCondition?: (card: ProvinceCard, context: AbilityContext) => boolean }
    | {
          cardType: CardTypes.Character | CardTypes.Holding | CardTypes.Event | CardTypes.Attachment;
          cardCondition?: (card: DrawCard, context: AbilityContext) => boolean;
      };
