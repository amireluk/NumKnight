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
    chronicleBonusLabel: (n) => `📜 +${n} boon bonus`,
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
    clearBoard: 'Clear scores',
    confirmClear: '⚠ YES, ERASE ALL',
    clearWarning: 'This will permanently delete all your scores and rankings. This cannot be undone.',
    clearStats: 'Clear history',
    confirmClearStats: '⚠ YES, CLEAR HISTORY',
    clearStatsWarning: 'This will permanently delete your entire practice history and statistics. This cannot be undone.',
    playAgain: 'PLAY AGAIN',
    back: 'BACK',
    newGame: 'START GAME',
    continueRun: 'CONTINUE RUN',

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

    // Practice mode
    practice: 'START PRACTICE',
    practicePickerTitle: 'Choose Numbers to Practice',
    practicePickerSubtitle: 'Select up to 4',
    practiceStartBtn: 'START PRACTICE',
    practiceGoodJob: 'GOOD JOB!',
    practiceResultText: (score) => `You got ${score} right!`,
    practiceAgain: (nums) => `PRACTICE AGAIN  ${nums.join(', ')}`,
    practiceNewNumbers: 'NEW NUMBERS',
    practiceQuestionLabel: (n, total) => `${n} / ${total}`,

    // StatsScreen
    statsTitle: 'YOUR NUMBERS',
    statsSubtitle: (name) => name ? `${name}'s progress` : 'Your progress',
    statsNotEnoughData: 'Play more',
    statsMedianTime: (s) => `${s}s`,
    statsRatingWeak: 'Needs work',
    statsRatingMid: 'Getting there',
    statsRatingStrong: 'Strong',
    statsLegendWeak: 'needs work',
    statsLegendMid: 'getting there',
    statsLegendStrong: 'strong',
    statsButton: 'STATS',
    statsTapToSee: 'TAP A NUMBER TO SEE HISTORY',
    statsHistoryTitle: (n, count) => `×${n} — LAST ${count}`,
    statsHistoryClose: 'tap anywhere to close',
    statsPlayMoreToSee: 'play more to see statistics',
    practiceRecommended: 'recommended for you',

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
    fight: '!קדימה',
    tapToFight: '⚔ לחץ להילחם',

    // BattleIntro
    round: 'סיבוב',
    finalRound: 'סיבוב אחרון',
    go: '!קדימה',

    // BattleScreen
    roundLabel: (n, total) => `סיבוב ${n}/${total}`,
    trophyLabel: { gold: 'מושלם!', silver: 'כל הכבוד!', bronze: 'שרדת!' },
    pts: 'נק׳',
    ptsLabel: (n) => `${n} נק׳`,
    timeBonusLabel: (n) => `בונוס זמן ${n}`,
    timeBonus: 'בונוס זמן',
    chronicleBonusLabel: (n) => `📜 +${n} בונוס ברכה`,
    tapToContinue: 'לחץ להמשך',

    // Boss mechanic
    bossShieldUp: 'המגן פעיל',
    bossShieldCrack: 'המגן נסדק\u200F!',
    bossShieldCrackHint: 'עוד אחד\u200F!',
    bossShieldShatter: 'המגן התנפץ\u200F!',
    bossShieldShatterHint: 'מכה\u200F!',

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
    noScores: 'אין שיאים עדיין — היה הראשון\u200F!',
    clearBoard: 'נקה ניקוד',
    confirmClear: '⚠ כן, מחק הכל',
    clearWarning: 'פעולה זו תמחק לצמיתות את כל הניקודים והדירוגים שלך. לא ניתן לבטל.',
    clearStats: 'נקה היסטוריה',
    confirmClearStats: '⚠ כן, נקה היסטוריה',
    clearStatsWarning: 'פעולה זו תמחק לצמיתות את כל היסטוריית התרגול והסטטיסטיקות שלך. לא ניתן לבטל.',
    playAgain: 'שחק שוב',
    back: 'חזור',
    newGame: 'התחל משחק',
    continueRun: 'המשך משחק',

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

    // Practice mode
    practice: 'התחל תרגול',
    practicePickerTitle: 'בחר מספרים לתרגול',
    practicePickerSubtitle: 'בחר עד 4 מספרים',
    practiceStartBtn: 'התחל תרגול',
    practiceGoodJob: 'כל הכבוד\u200F!',
    practiceResultText: (score) => `ענית נכון על ${score}\u200F!`,
    practiceAgain: (nums) => `תרגל שוב  ${nums.join(', ')}`,
    practiceNewNumbers: 'מספרים חדשים',
    practiceQuestionLabel: (n, total) => `${n} / ${total}`,

    // StatsScreen
    statsTitle: 'המספרים שלך',
    statsSubtitle: (name) => name ? `ההתקדמות של ${name}` : 'ההתקדמות שלך',
    statsNotEnoughData: 'שחק עוד',
    statsMedianTime: (s) => `${s}שנ`,
    statsRatingWeak: 'צריך תרגול',
    statsRatingMid: 'בדרך הנכונה',
    statsRatingStrong: 'חזק',
    statsLegendWeak: 'צריך תרגול',
    statsLegendMid: 'בדרך',
    statsLegendStrong: 'חזק',
    statsButton: 'סטטיסטיקות',
    statsTapToSee: 'לחץ על מספר לצפייה בהיסטוריה',
    statsHistoryTitle: (n, count) => `×${n} — ${count} שאלות אחרונות`,
    statsHistoryClose: 'לחץ לסגירה',
    statsPlayMoreToSee: 'שחק עוד כדי לראות סטטיסטיקות',
    practiceRecommended: 'מומלץ עבורך',

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
