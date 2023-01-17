export enum Locations {
    Any = 'any',
    Hand = 'hand',
    ConflictDeck = 'conflict deck',
    DynastyDeck = 'dynasty deck',
    ConflictDiscardPile = 'conflict discard pile',
    DynastyDiscardPile = 'dynasty discard pile',
    PlayArea = 'play area',
    Provinces = 'province',
    ProvinceOne = 'province 1',
    ProvinceTwo = 'province 2',
    ProvinceThree = 'province 3',
    ProvinceFour = 'province 4',
    StrongholdProvince = 'stronghold province',
    ProvinceDeck = 'province deck',
    RemovedFromGame = 'removed from game',
    UnderneathStronghold = 'underneath stronghold',
    OutsideTheGame = 'outside the game',
    BeingPlayed = 'being played',
    Role = 'role'
};

export enum CharacterStatus {
    Honored = 'honored',
    Dishonored = 'dishonored',
    Tainted = 'tainted'
}

export enum Decks {
    ConflictDeck = 'conflict deck',
    DynastyDeck = 'dynasty deck'
};

export enum EffectNames {
    AbilityRestrictions = 'abilityRestrictions',
    AddElementAsAttacker = 'addElementAsAttacker',
    AddFaction = 'addFaction',
    AddKeyword = 'addKeyword',
    AddTrait = 'addTrait',
    AttachmentCardCondition = 'attachmentCardCondition',
    AttachmentFactionRestriction = 'attachmentFactionRestriction',
    AttachmentLimit = 'attachmentLimit',
    AttachmentMyControlOnly = 'attachmentMyControlOnly',
    AttachmentOpponentControlOnly = 'attachmentOpponentControlOnly',
    AttachmentRestrictTraitAmount = 'attachmentRestrictTraitAmount',
    AttachmentTraitRestriction = 'attachmentTraitRestriction',
    AttachmentUniqueRestriction = 'attachmentUniqueRestriction',
    Blank = 'blank',
    CalculatePrintedMilitarySkill = 'calculatePrintedMilitarySkill',
    CanBeSeenWhenFacedown = 'canBeSeenWhenFacedown',
    CanBeTriggeredByOpponent = 'canBeTriggeredByOpponent',
    CanOnlyBeDeclaredAsAttackerWithElement = 'canOnlyBeDeclaredAsAttackerWithElement',
    CannotApplyLastingEffects = 'cannotApplyLastingEffects',
    CannotBeAttacked = 'cannotBeAttacked',
    CannotBidInDuels = 'cannotBidInDuels',
    CannotContribute = 'cannotContribute',
    CannotHaveConflictsDeclaredOfType = 'cannotHaveConflictsDeclaredOfType',
    CannotHaveOtherRestrictedAttachments = 'cannotHaveOtherRestrictedAttachments',
    CannotParticipateAsAttacker = 'cannotParticipateAsAttacker',
    CannotParticipateAsDefender = 'cannotParticipateAsDefender',
    CardCostToAttackMilitary = 'cardCostToAttackMilitary',
    ChangeContributionFunction = 'changeContributionFunction',
    ChangeType = 'changeType',
    CopyCharacter = 'copyCharacter',
    CustomEffect = 'customEffect',
    CustomProvinceRefillEffect = 'customProvinceRefillEffect',
    DelayedEffect = 'delayedEffect',
    DoesNotBow = 'doesNotBow',
    DoesNotReady = 'doesNotReady',
    EntersPlayWithStatus = "entersPlayWithStatus",
    EntersPlayForOpponent = 'entersPlayForOpponent',
    FateCostToAttack = 'fateCostToAttack',
    HonorCostToDeclare = 'honorCostToDeclare',
    FateCostToRingToDeclareConflictAgainst = 'fateCostToRingToDeclareConflictAgainst',
    FateCostToTarget = 'fateCostToTarget',
    GainAbility = 'gainAbility',
    GainAllAbilities = 'gainAllAbilities',
    GainAllAbilitiesDynamic = 'gainAllAbilitiesDynamic',
    GainExtraFateWhenPlayed = 'gainExtraFateWhenPlayed',
    GainPlayAction = 'gainPlayAction',
    HideWhenFaceUp = 'hideWhenFaceUp',
    HonorStatusDoesNotAffectLeavePlay = 'honorStatusDoesNotAffectLeavePlay',
    HonorStatusDoesNotModifySkill = 'honorStatusDoesNotModifySkill',
    TaintedStatusDoesNotCostHonor = 'taintedStatusDoesNotCostHonor',
    HonorStatusReverseModifySkill = 'honorStatusReverseModifySkill',
    IncreaseLimitOnAbilities = 'increaseLimitOnAbilities',
    IncreaseLimitOnPrintedAbilities = 'IncreaseLimitOnPrintedAbilities',
    LegendaryFate = 'legendaryFate',
    LoseKeyword = 'loseKeyword',
    ModifyBaseMilitarySkillMultiplier = 'modifyBaseMilitarySkillMultiplier',
    ModifyBasePoliticalSkillMultiplier = 'modifyBasePoliticalSkillMultiplier',
    ModifyBaseProvinceStrength = 'modifyBaseProvinceStrength',
    ModifyBothSkills = 'modifyBothSkills',
    ModifyGlory = 'modifyGlory',
    ModifyMilitarySkill = 'modifyMilitarySkill',
    AttachmentMilitarySkillModifier = 'attachmentMilitarySkillModifier',
    ModifyMilitarySkillMultiplier = 'modifyMilitarySkillMultiplier',
    ModifyPoliticalSkill = 'modifyPoliticalSkill',
    AttachmentPoliticalSkillModifier = 'attachmentPoliticalSkillModifier',
    ModifyPoliticalSkillMultiplier = 'modifyPoliticalSkillMultiplier',
    ModifyProvinceStrengthBonus = 'modifyProvinceStrengthBonus',
    ModifyProvinceStrength = 'modifyProvinceStrength',
    ModifyProvinceStrengthMultiplier = 'modifyProvinceStrengthMultiplier',
    ModifyRestrictedAttachmentAmount = 'modifyRestrictedAttachmentAmount',
    MustBeChosen = 'mustBeChosen',
    MustBeDeclaredAsAttacker = 'mustBeDeclaredAsAttacker',
    MustBeDeclaredAsAttackerIfType = 'mustBeDeclaredAsAttackerifType',
    MustBeDeclaredAsDefender = 'mustBeDeclaredAsDefender',
    SetApparentFate = 'setApparentFate',
    SetBaseDash = 'setBaseDash',
    SetBaseMilitarySkill = 'setBaseMilitarySkill',
    SetBasePoliticalSkill = 'setBasePoliticalSkill',
    SetBaseProvinceStrength = 'setBaseProvinceStrength',
    SetConflictDeclarationType = 'setConflictDeclarationType',
    ProvideConflictDeclarationType = 'provideConflictDeclarationType',
    ForceConflictDeclarationType = 'forceConflictDeclarationType',
    SetConflictTotalSkill = 'setConflictTotalSkill',
    SetDash = 'setDash',
    SetGlory = 'setGlory',
    SetMilitarySkill = 'setMilitarySkill',
    SetPoliticalSkill = 'setPoliticalSkill',
    SetProvinceStrengthBonus = 'setProvinceStrengthBonus',
    SetProvinceStrength = 'setProvinceStrength',
    SwitchBaseSkills = 'switchBaseSkills',
    SuppressEffects = 'suppressEffects',
    TakeControl = 'takeControl',
    TerminalCondition = 'terminalCondition',
    UnlessActionCost = 'unlessActionCost',
    AddElement = 'addElement',
    CannotDeclareRing = 'cannotDeclare',
    ConsiderRingAsClaimed = 'considerAsClaimed',
    AdditionalAction = 'additionalAction',
    AdditionalCardPlayed = 'additionalCardPlayed',
    AdditionalCharactersInConflict = 'additionalCharactersInConflict',
    AdditionalConflict = 'additionalConflict',
    AdditionalTriggerCost = 'additionalTriggerCost',
    AdditionalPlayCost = 'additionalPlayCost',
    AlternateFatePool = 'alternateFatePool',
    CannotDeclareConflictsOfType = 'cannotDeclareConflictsOfType',
    CanPlayFromOwn = 'canPlayFromOwn',
    CanPlayFromOutOfPlay = 'canPlayFromOutOfPlay',
    CanPlayFromOpponents = 'canPlayFromOpponents',
    CannotResolveRings = "cannotResolveRings",
    ChangePlayerGloryModifier = 'gloryModifier',
    ChangePlayerSkillModifier = 'conflictSkillModifier',
    GainActionPhasePriority = 'actionPhasePriority',
    CostReducer = 'costReducer',
    ModifyCardsDrawnInDrawPhase = 'modifyCardsDrawnInDrawPhase',
    SetMaxConflicts = 'maxConflicts',
    ShowTopConflictCard = 'showTopConflictCard',
    ShowTopDynastyCard = 'showTopDynastyCard',
    ContributeToConflict = 'contribute',
    CanContributeWhileBowed = 'canContributeWhileBowed',
    CanContributeGloryWhileBowed = 'canContributeGloryWhileBowed',
    ChangeConflictSkillFunction = 'skillFunction',
    ModifyConflictElementsToResolve = 'modifyConflictElementsToResolve',
    RestrictNumberOfDefenders = 'restrictNumberOfDefenders',
    ResolveConflictEarly = 'resolveConflictEarly',
    SetBaseGlory = "setBaseGlory",
    EventsCannotBeCancelled = 'eventsCannotBeCancelled',
    ForceConflictUnopposed = 'forceConflictUnopposed',
    MustDeclareMaximumAttackers = 'mustDeclareMaximumAttackers',
    RefillProvinceTo = 'refillProvinceTo',
    RestartDynastyPhase = 'restartDynastyPhase',
    StrongholdCanBeAttacked = 'strongholdCanBeAttacked',
    DefendersChosenFirstDuringConflict = 'defendersChosenFirstDuringConflict',
    LimitHonorGainPerPhase = "limitHonorGainPerPhase",
    RegisterToPlayFromOutOfPlay = "registerToPlayFromOutOfPlay",
    CostToDeclareAnyParticipants = 'costToDeclareAnyParticipants',
    LoseAllNonKeywordAbilities = 'loseAllNonKeywordAbilities',
    ParticipatesFromHome = 'participatesFromHome',
    AdditionalAttackedProvince = 'additionalAttackedProvince',
    ReplacePrintedElement = 'replacePrintedElement',
    ProvinceCannotHaveSkillIncreased = 'provinceCannotHaveSkillIncreased',
    ConsideredLessHonorable = 'consideredLessHonorable',
    CustomFatePhaseFateRemoval = 'customFatePhaseFateRemoval',
    WinDuel = 'winDuel',
    ConflictIgnoreStatusTokens = 'conflictIgnoreStatusTokens',
    LimitLegalAttackers = 'limitLegalAttackers',
    ModifyHonorTransferGiven = "modifyHonorTransferGiven",
    ModifyHonorTransferReceived = "modifyHonorTransferReceived",
};

export enum Durations {
    UntilEndOfDuel = 'untilEndOfDuel',
    UntilEndOfConflict = 'untilEndOfConflict',
    UntilEndOfPhase = 'untilEndOfPhase',
    UntilEndOfRound = 'untilEndOfRound',
    UntilPassPriority = 'untilPassPriority',
    UntilOpponentPassPriority = 'untilOpponentPassPriority',
    UntilNextPassPriority = 'untilNextPassPriority',
    Persistent = 'persistent',
    Custom = 'lastingEffect'
};

export enum Stages {
    Cost = 'cost',
    Effect = 'effect',
    PreTarget = 'pretarget',
    Target = 'target'
};

export enum Players {
    Self = 'self',
    Opponent = 'opponent',
    Any = 'any'
};

export enum TargetModes {
    Ring = 'ring',
    Select = 'select',
    Ability = 'ability',
    Token = 'token',
    ElementSymbol = 'elementSymbol',
    AutoSingle = 'autoSingle',
    Exactly = 'exactly',
    ExactlyVariable = 'exactlyVariable',
    MaxStat = 'maxStat',
    Single = 'single',
    Unlimited = 'unlimited',
    UpTo = 'upTo',
    UpToVariable = 'upToVariable'
};

export enum Phases {
    Setup = 'setup',
    Dynasty = 'dynasty',
    Draw = 'draw',
    Conflict = 'conflict',
    Fate = 'fate',
    Regroup = 'regroup'
};

export enum CardTypes {
    Stronghold = 'stronghold',
    Role = 'role',
    Province = 'province',
    Character = 'character',
    Holding = 'holding',
    Event = 'event',
    Attachment = 'attachment'
};

export enum PlayTypes {
    PlayFromHand = 'playFromHand',
    PlayFromProvince = 'playFromProvince',
    Other = 'other'
};

export enum EventNames {
    OnMoveFate = 'onMoveFate',
    OnBeginRound = 'onBeginRound',
    OnCharacterEntersPlay = 'onCharacterEntersPlay',
    OnInitiateAbilityEffects = 'onInitiateAbilityEffects',
    OnCardAbilityInitiated = 'onCardAbilityInitiated',
    OnCardAbilityTriggered = 'onCardAbilityTriggered',
    OnConflictInitiated = 'onConflictInitiated',
    OnDuelInitiated = 'onDuelInitiated',
    OnConflictDeclared = 'onConflictDeclared',
    OnConflictOpportunityAvailable = 'onConflictOpportunityAvailable',
    OnCovertResolved = 'onCovertResolved',
    OnCardRevealed = 'onCardRevealed',
    OnCardTurnedFacedown = 'onCardTurnedFacedown',
    OnDefendersDeclared = 'onDefendersDeclared',
    AfterConflict = 'afterConflict',
    OnBreakProvince = 'onBreakProvince',
    OnRestoreProvince = 'onRestoreProvince',
    OnResolveConflictRing = 'onResolveConflictRing',
    OnResolveRingElement = 'onResolveRingElement',
    OnClaimRing = 'onClaimRing',
    OnRemoveRingFromPlay = 'onRemoveRingFromPlay',
    OnReturnRingtoPlay = 'onRemoveRingFromPlay',
    OnReturnHome = 'onReturnHome',
    OnParticipantsReturnHome = 'onParticipantsReturnHome',
    OnConflictStarted = 'onConflictStarted',
    OnConflictFinished = 'onConflictFinished',
    OnConflictPass = 'onConflictPass',
    OnFavorGloryTied = 'onFavorGloryTied',
    OnPlaceFateOnUnclaimedRings = 'onPlaceFateOnUnclaimedRings',
    OnHonorDialsRevealed = 'onHonorDialsRevealed',
    OnPhaseCreated = 'onPhaseCreated',
    OnPhaseStarted = 'onPhaseStarted',
    OnPhaseEnded = 'onPhaseEnded',
    OnReturnRing = 'onReturnRing',
    OnPassFirstPlayer = 'onPassFirstPlayer',
    OnRoundEnded = 'onRoundEnded',
    OnFateCollected = 'onFateCollected',
    OnCardAttached = 'onCardAttached',
    OnCardDetached = 'onCardDetached',
    OnCardHonored = 'onCardHonored',
    OnCardDishonored = 'onCardDishonored',
    OnCardTainted = 'onCardTainted',
    OnCardBowed = 'onCardBowed',
    OnCardReadied = 'onCardReadied',
    OnCardsDiscarded = 'onCardsDiscarded',
    OnCardsDiscardedFromHand = 'onCardsDiscardedFromHand',
    OnCardLeavesPlay = 'onCardLeavesPlay',
    OnAddTokenToCard = 'onAddTokenToCard',
    OnMoveToConflict = 'onMoveToConflict',
    OnSendHome = 'onSendHome',
    OnCardPlayed = 'onCardPlayed',
    OnDeckShuffled = 'onDeckShuffled',
    AfterDuel = 'afterDuel',
    OnDuelStarted = 'onDuelStarted',
    OnDuelResolution = 'onDuelResolution',
    OnDuelFinished = 'onDuelFinished',
    OnDynastyCardTurnedFaceup = 'onDynastyCardTurnedFaceup',
    OnTransferHonor = 'onTransferHonor',
    OnPassDuringDynasty = 'onPassDuringDynasty',
    OnModifyHonor = 'onModifyHonor',
    OnAbilityResolved = 'onAbilityResolved',
    OnResolveFateCost = 'onResolveFateCost',
    OnCardMoved = 'onCardMoved',
    OnDeckSearch = 'onDeckSearch',
    OnEffectApplied = 'onEffectApplied',
    OnDiscardFavor = 'onDiscardFavor',
    OnStatusTokenDiscarded = 'onStatusTokenDiscarded',
    OnStatusTokenMoved = 'onStatusTokenMoved',
    OnStatusTokenGained = 'onStatusTokenGained',
    OnCardsDrawn = 'onCardsDrawn',
    OnLookAtCards = 'onLookAtCards',
    OnModifyBid = 'onModifyBid',
    OnHonorBid = 'onHonorBid',
    OnModifyFate = 'onModifyFate',
    OnSetHonorDial = 'onSetHonorDial',
    OnSwitchConflictElement = 'onSwitchConflictElement',
    OnSwitchConflictType = 'onSwitchConflictType',
    OnTakeRing = 'onTakeRing',
    OnSpendFate = 'onSpendFate',
    OnPassActionPhasePriority = 'onPassActionPhasePriority',
    OnGloryCount = 'onGloryCount',
    OnClaimFavor = 'onClaimFavor',
    OnFlipFavor = 'onFlipFavor',
    OnConflictMoved = 'onConflictMoved',
    OnConflictDeclaredBeforeProvinceReveal = 'onConflictDeclaredBeforeProvinceReveal',
    OnTheCrashingWave = 'onTheCrashingWave',
    Unnamed = 'unnamedEvent',
    OnAbilityResolverInitiated = 'onAbilityResolverInitiated'
};

export enum AbilityTypes {
    Action = 'action',
    WouldInterrupt = 'cancelinterrupt',
    ForcedInterrupt = 'forcedinterrupt',
    KeywordInterrupt = 'forcedinterrupt',
    Interrupt = 'interrupt',
    KeywordReaction = 'forcedreaction',
    ForcedReaction = 'forcedreaction',
    Reaction = 'reaction',
    Persistent = 'persistent',
    OtherEffects = 'OtherEffects'
};

export enum DuelTypes {
    Military = 'military',
    Political = 'political',
    Glory = 'glory'
};

export enum Elements {
    Fire = 'fire',
    Earth = 'earth',
    Air = 'air',
    Water = 'water',
    Void = 'void',
};

export enum ConflictTypes {
    Military = 'military',
    Political = 'political',
    Passed = 'passed',
    Forced = 'forced'
};

export enum TokenTypes {
    Honor = 'honor'
};

export enum FavorTypes {
    Military = 'military',
    Political = 'political',
    Both = 'both'
};