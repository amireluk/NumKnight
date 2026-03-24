export const LANG_KEY = 'numknight_lang'

export const T = {
  en: {
    // StartScreen
    yourName: 'YOUR NAME',
    namePlaceholder: 'Enter your name...',
    difficulty: 'DIFFICULTY',
    startAdventure: 'START ADVENTURE',
    diffLabel: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    questions: 'questions',

    // WorldMapScreen
    fight: 'Go!',
    tapToFight: '⚔ TAP TO FIGHT',

    // BattleIntro
    round: 'ROUND',
    finalRound: 'FINAL ROUND',
    go: 'Go!',

    // BattleScreen
    roundLabel: (n, total) => `Round ${n}/${total}`,
    trophyLabel: { gold: 'PERFECT!', silver: 'GREAT!', bronze: 'SURVIVED!' },
    pts: 'pts',
    ptsLabel: (n) => `${n} pts`,
    timeBonusLabel: (n) => `${n} time bonus`,
    timeBonus: 'time bonus',
    chronicleBonusLabel: (n) => `📜 +${n} chronicle bonus`,
    tapToContinue: 'TAP TO CONTINUE',

    // Boss mechanic
    bossShieldUp: 'SHIELD UP',
    bossShieldCrack: 'SHIELD CRACK!',
    bossShieldCrackHint: 'one more!',
    bossShieldShatter: 'SHATTERED!',
    bossShieldShatterHint: 'hit landed!',

    // AreaClearedScreen
    areaCleared: 'Area Cleared',
    tapReveal: 'Tap to reveal score',
    roundScore: 'ROUND SCORE',
    previous: 'PREVIOUS',
    newTotal: 'NEW TOTAL',
    continueCta: 'CONTINUE',

    // VictoryScreen
    victoryLine1: 'REALM',
    victoryLine2: 'CONQUERED',
    victorySubtitle: (name) => name ? `${name} — your legend is written` : 'Your legend is written',
    hallOfFame: 'ENTER THE HALL OF FAME',

    // ResultScreen
    defeated: 'DEFEATED',
    fellAt: (name) => `Fell at ${name}`,
    finalScore: 'FINAL SCORE',
    seeScores: 'SEE SCORES',

    // LeaderboardScreen
    newBadge: 'NEW',
    hallOfFameTitle: 'HALL OF FAME',
    kingdomRecords: 'Kingdom Records',
    leaderboard: 'Leaderboard',
    yourScore: 'YOUR SCORE',
    conquered: 'CONQUERED',
    fellAtShort: (name) => `Fell at ${name}`,
    noScores: 'No scores yet — be the first!',
    clearBoard: 'Clear',
    confirmClear: '⚠ YES, ERASE ALL',
    clearWarning: '! This will permanently erase all scores',
    playAgain: 'PLAY AGAIN',
    back: 'BACK',
    newGame: 'NEW GAME',
    continueRun: 'CONTINUE',

    // World names (by id)
    worldName: {
      forest: 'Forest',
      swamp: 'Swamp',
      mountains: 'Mountains',
      castle: 'Castle',
      dragonLair: 'Dragon Lair',
    },

    // OptionsScreen
    optionsTitle: 'OPTIONS',
    optionsName: 'YOUR NAME',
    optionsLanguage: 'LANGUAGE',
    optionsGraphics: 'GRAPHICS',
    optionsGraphicsSvg: 'Classic',
    optionsGraphicsImg: 'Illustrated',
    optionsDifficulty: 'DIFFICULTY',
    optionsSound: 'SOUND',
    optionsSoundOn: 'On',
    optionsSoundOff: 'Off',
    optionsViewLog: 'View Game Log',

    // CampfireScreen
    campfireTitle: 'The Dragon Lair Awaits',
    campfireSubtitle: 'Choose one boon before you enter',
    campfireEnter: 'ENTER THE LAIR →',
    campfireHint: 'TAP A BOON TO ENTER THE LAIR',
    boostWeakSpotName: 'Dragon is Weaker',
    boostWeakSpotDesc: '−1 Dragon HP',
    boostSteadyNervesName: 'More Time for Each Question',
    boostSteadyNervesDesc: '+3 seconds on every question timer',
    boostChronicleName: 'Extra Bonus Points',
    boostChronicleDesc: '+100 bonus points per battle won',
  },

  he: {
    // StartScreen
    yourName: 'שם',
    namePlaceholder: 'הכנס שם...',
    difficulty: 'רמת קושי',
    startAdventure: 'התחל הרפתקה',
    diffLabel: { easy: 'קל', medium: 'בינוני', hard: 'קשה' },
    questions: 'שאלות',

    // WorldMapScreen
    fight: 'קדימה!',
    tapToFight: '⚔ לחץ להילחם',

    // BattleIntro
    round: 'סיבוב',
    finalRound: 'סיבוב אחרון',
    go: '!קדימה',

    // BattleScreen
    roundLabel: (n, total) => `סיבוב ${n}/${total}`,
    trophyLabel: { gold: '!מושלם', silver: '!כל הכבוד', bronze: '!שרדת' },
    pts: 'נק׳',
    ptsLabel: (n) => `נק׳ ${n}`,
    timeBonusLabel: (n) => `בונוס זמן ${n}`,
    timeBonus: 'בונוס זמן',
    chronicleBonusLabel: (n) => `📜 +${n} בונוס כרוניקה`,
    tapToContinue: 'לחץ להמשך',

    // Boss mechanic
    bossShieldUp: 'המגן פעיל',
    bossShieldCrack: '!המגן נסדק',
    bossShieldCrackHint: '!עוד אחד',
    bossShieldShatter: '!המגן התנפץ',
    bossShieldShatterHint: '!מכה',

    // AreaClearedScreen
    areaCleared: 'האזור נוקה',
    tapReveal: 'לחץ לגילוי הניקוד',
    roundScore: 'ניקוד סיבוב',
    previous: 'קודם',
    newTotal: 'סך הכל',
    continueCta: 'המשך',

    // VictoryScreen
    victoryLine1: 'ממלכה',
    victoryLine2: 'נכבשה',
    victorySubtitle: (name) => name ? `${name} — האגדה שלך נכתבה` : 'האגדה שלך נכתבה',
    hallOfFame: 'היכנס להיכל התהילה',

    // ResultScreen
    defeated: 'הובסת',
    fellAt: (name) => `נפלת ב${name}`,
    finalScore: 'ניקוד סופי',
    seeScores: 'צפה בשיאים',

    // LeaderboardScreen
    newBadge: 'חדש',
    hallOfFameTitle: 'היכל התהילה',
    kingdomRecords: 'שיאי הממלכה',
    leaderboard: 'טבלת שיאים',
    yourScore: 'הניקוד שלך',
    conquered: 'ניצחון',
    fellAtShort: (name) => `נפל ב${name}`,
    noScores: 'אין שיאים עדיין — היה הראשון!',
    clearBoard: 'נקה',
    confirmClear: '⚠ כן, מחק הכל',
    clearWarning: '! זה ימחק לצמיתות את כל השיאים',
    playAgain: 'שחק שוב',
    back: 'חזור',
    newGame: 'משחק חדש',
    continueRun: 'המשך',

    // World names (by id)
    worldName: {
      forest: 'יער',
      swamp: 'ביצה',
      mountains: 'הרים',
      castle: 'טירה',
      dragonLair: 'מאורת הדרקון',
    },

    // OptionsScreen
    optionsTitle: 'הגדרות',
    optionsName: 'שם',
    optionsLanguage: 'שפה',
    optionsGraphics: 'גרפיקה',
    optionsGraphicsSvg: 'קלאסי',
    optionsGraphicsImg: 'מאוייר',
    optionsDifficulty: 'רמת קושי',
    optionsSound: 'צליל',
    optionsSoundOn: 'פועל',
    optionsSoundOff: 'כבוי',
    optionsViewLog: 'יומן המשחק',

    // CampfireScreen
    campfireTitle: 'מאורת הדרקון מחכה',
    campfireSubtitle: 'בחר ברכה לפני הכניסה',
    campfireEnter: 'כנס למאורה →',
    campfireHint: 'לחץ על ברכה כדי להיכנס למאורה',
    boostWeakSpotName: 'הדרקון חלש יותר',
    boostWeakSpotDesc: 'לדרקון חיה אחת פחות',
    boostSteadyNervesName: 'יותר זמן לכל שאלה',
    boostSteadyNervesDesc: '+3 שניות לכל שאלה',
    boostChronicleName: 'נקודות בונוס נוספות',
    boostChronicleDesc: '+100 נקודות בונוס לכל קרב',
  },
}
