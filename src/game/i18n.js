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
    timeBonus: 'time bonus',
    tapToContinue: 'TAP TO CONTINUE',

    // AreaClearedScreen
    areaCleared: 'Area Cleared',
    tapReveal: 'Tap to reveal score',
    roundScore: 'ROUND SCORE',
    previous: 'PREVIOUS',
    newTotal: 'NEW TOTAL',
    continueCta: 'CONTINUE',

    // ResultScreen
    defeated: 'DEFEATED',
    fellAt: (name) => `Fell at ${name}`,
    finalScore: 'FINAL SCORE',
    seeScores: 'SEE SCORES',

    // LeaderboardScreen
    kingdomRecords: 'Kingdom Records',
    leaderboard: 'Leaderboard',
    yourScore: 'YOUR SCORE',
    conquered: 'CONQUERED',
    fellAtShort: (name) => `Fell at ${name}`,
    noScores: 'No scores yet — be the first!',
    clearBoard: 'Clear',
    confirmClear: 'Sure?',
    playAgain: 'PLAY AGAIN',

    // World names (by id)
    worldName: {
      forest: 'Forest',
      swamp: 'Swamp',
      mountains: 'Mountains',
      castle: 'Castle',
      dragonLair: 'Dragon Lair',
    },
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
    timeBonus: 'בונוס זמן',
    tapToContinue: 'לחץ להמשך',

    // AreaClearedScreen
    areaCleared: 'האזור נוקה',
    tapReveal: 'לחץ לגילוי הניקוד',
    roundScore: 'ניקוד סיבוב',
    previous: 'קודם',
    newTotal: 'סך הכל',
    continueCta: 'המשך',

    // ResultScreen
    defeated: 'הובסת',
    fellAt: (name) => `נפלת ב${name}`,
    finalScore: 'ניקוד סופי',
    seeScores: 'צפה בשיאים',

    // LeaderboardScreen
    kingdomRecords: 'שיאי הממלכה',
    leaderboard: 'טבלת שיאים',
    yourScore: 'הניקוד שלך',
    conquered: 'ניצחון',
    fellAtShort: (name) => `נפל ב${name}`,
    noScores: 'אין שיאים עדיין — היה הראשון!',
    clearBoard: 'נקה',
    confirmClear: 'בטוח?',
    playAgain: 'שחק שוב',

    // World names (by id)
    worldName: {
      forest: 'יער',
      swamp: 'ביצה',
      mountains: 'הרים',
      castle: 'טירה',
      dragonLair: 'מאורת הדרקון',
    },
  },
}
