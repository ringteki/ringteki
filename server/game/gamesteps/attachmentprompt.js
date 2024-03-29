const { UiPrompt } = require('./UiPrompt.js');
const GameActions = require('../GameActions/GameActions');
const { AbilityContext } = require('../AbilityContext');
const { Players } = require('../Constants');

class AttachmentPrompt extends UiPrompt {
    constructor(game, player, attachmentCard, playingType) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
        this.playingType = playingType;
    }

    continue() {
        this.game.promptForSelect(this.player, {
            source: 'Play Attachment',
            activePromptTitle: 'Select target for attachment',
            controller: Players.Self,
            gameAction: GameActions.attach({ attachment: this.attachmentCard }),
            onSelect: (player, card) => {
                GameActions.attach({ attachment: this.attachmentCard }).resolve(card, new AbilityContext({ game: this.game, player: this.player, source: card }));
                return true;
            }
        });
        return true;
    }
}

module.exports = AttachmentPrompt;
