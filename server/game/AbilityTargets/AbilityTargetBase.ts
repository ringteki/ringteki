import { AbilityContext } from "../AbilityContext";
import { Players } from "../Constants";


type Properties = {
    player?: Players | ((context: AbilityContext) => Players);
}

export class AbilityTargetBase {
    protected dependentTarget: any = null;
    protected dependentCost: any = null;
    protected properties: Properties;

    protected getChoosingPlayer(context:AbilityContext) {
        let playerProp = this.properties.player;
        if (typeof playerProp === 'function') {
            playerProp = playerProp(context);
        }
        return playerProp === Players.Opponent ? context.player.opponent : context.player;
    }
}
