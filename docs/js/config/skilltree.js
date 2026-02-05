// スキルツリー定義（職業ごとの習得スキル構造）
const skillTreeConfig = {
    warrior: {
        name: "戦士",
        nodes: [
            {
                id: "w1",
                name: "上段斬り",
                level: 1,
                mp: 3,
                cost: 1,
                type: "atkUp",
                desc: "攻撃力130%の上級剣技",
                prerequisites: [],
                icon: "⚔️"
            },
            {
                id: "w2",
                name: "双剣舞",
                level: 3,
                mp: 8,
                cost: 2,
                type: "doubleAtk",
                desc: "2本の剣で素早い連撃",
                prerequisites: ["w1"],
                icon: "⚔️⚔️"
            },
            {
                id: "w3",
                name: "鋼の盾",
                level: 2,
                mp: 4,
                cost: 1,
                type: "defense",
                desc: "防御力150%に上昇",
                prerequisites: [],
                icon: "🛡️"
            },
            {
                id: "w4",
                name: "滅殺無双剣",
                level: 5,
                mp: 10,
                cost: 3,
                type: "finalBlow",
                desc: "究極の剣技（会心率70%）",
                prerequisites: ["w1", "w2"],
                icon: "💥"
            }
        ]
    },
    mage: {
        name: "魔法使い",
        nodes: [
            {
                id: "m1",
                name: "炎爆",
                level: 1,
                mp: 12,
                cost: 1,
                type: "fire",
                desc: "強力な炎の魔法",
                prerequisites: [],
                icon: "🔥"
            },
            {
                id: "m2",
                name: "絶対零度",
                level: 2,
                mp: 10,
                cost: 1,
                type: "freeze",
                desc: "敵を凍結させる",
                prerequisites: [],
                icon: "❄️"
            },
            {
                id: "m3",
                name: "魔力吸引",
                level: 3,
                mp: 6,
                cost: 2,
                type: "mpRestore",
                desc: "敵のMPを大量吸収",
                prerequisites: ["m1", "m2"],
                icon: "✨"
            },
            {
                id: "m4",
                name: "隕石落下",
                level: 6,
                mp: 30,
                cost: 3,
                type: "holyLight",
                desc: "全体に超大ダメージ",
                prerequisites: ["m1", "m3"],
                icon: "☄️"
            }
        ]
    },
    paladin: {
        name: "聖騎士",
        nodes: [
            {
                id: "p1",
                name: "聖盾",
                level: 1,
                mp: 6,
                cost: 1,
                type: "shield",
                desc: "盾で敵を守る＆回復",
                prerequisites: [],
                icon: "✨"
            },
            {
                id: "p2",
                name: "神聖斬撃",
                level: 2,
                mp: 8,
                cost: 1,
                type: "holyStrike",
                desc: "聖なる力の剣撃＋吸収",
                prerequisites: [],
                icon: "⚔️"
            },
            {
                id: "p3",
                name: "復活の光",
                level: 4,
                mp: 18,
                cost: 2,
                type: "resurrect",
                desc: "瀕死者を救う奇跡",
                prerequisites: ["p1"],
                icon: "👼"
            },
            {
                id: "p4",
                name: "聖域展開",
                level: 5,
                mp: 12,
                cost: 3,
                type: "blessing",
                desc: "敵全体を弱体化",
                prerequisites: ["p1", "p2"],
                icon: "🙏"
            }
        ]
    },
    assassin: {
        name: "暗殺者",
        nodes: [
            {
                id: "a1",
                name: "鋭い連続斬り",
                level: 1,
                mp: 4,
                cost: 1,
                type: "quickStrike",
                desc: "高速多段攻撃",
                prerequisites: [],
                icon: "⚡"
            },
            {
                id: "a2",
                name: "影潜み",
                level: 2,
                mp: 3,
                cost: 1,
                type: "shadowClone",
                desc: "敵の攻撃を回避率UP",
                prerequisites: [],
                icon: "👻"
            },
            {
                id: "a3",
                name: "一閃必殺",
                level: 3,
                mp: 6,
                cost: 2,
                type: "finalBlow",
                desc: "会心率90%の一撃",
                prerequisites: ["a1"],
                icon: "💀"
            },
            {
                id: "a4",
                name: "暗黒剣技",
                level: 6,
                mp: 14,
                cost: 3,
                type: "dimensionDoor",
                desc: "敵を即死させる可能性大",
                prerequisites: ["a2", "a3"],
                icon: "🔪"
            }
        ]
    },
    bishop: {
        name: "ビショップ",
        nodes: [
            {
                id: "b1",
                name: "聖光の矢",
                level: 1,
                mp: 10,
                cost: 1,
                type: "holyLight",
                desc: "敵にダメージ＆味方回復",
                prerequisites: [],
                icon: "💫"
            },
            {
                id: "b2",
                name: "加護の盾",
                level: 2,
                mp: 5,
                cost: 1,
                type: "blessing",
                desc: "全ステータス小UP",
                prerequisites: [],
                icon: "✨"
            },
            {
                id: "b3",
                name: "時空転移",
                level: 4,
                mp: 16,
                cost: 2,
                type: "dimensionDoor",
                desc: "全状態異常を解除",
                prerequisites: ["b1", "b2"],
                icon: "🌀"
            },
            {
                id: "b4",
                name: "神聖復活",
                level: 5,
                mp: 22,
                cost: 3,
                type: "resurrect",
                desc: "全員を完全に蘇生",
                prerequisites: ["b3"],
                icon: "👑"
            }
        ]
    }
};

// 難易度設定
const difficultyConfig = {
    easy: {
        name: "イージー",
        enemyHpMultiplier: 0.7,
        enemyAtkMultiplier: 0.6,
        enemyDefMultiplier: 0.8,
        expMultiplier: 1.5,
        goldMultiplier: 1.2,
        desc: "敵が弱い。初心者向け"
    },
    normal: {
        name: "ノーマル",
        enemyHpMultiplier: 1.0,
        enemyAtkMultiplier: 1.0,
        enemyDefMultiplier: 1.0,
        expMultiplier: 1.0,
        goldMultiplier: 1.0,
        desc: "標準的な難易度"
    },
    hard: {
        name: "ハード",
        enemyHpMultiplier: 1.5,
        enemyAtkMultiplier: 1.3,
        enemyDefMultiplier: 1.2,
        expMultiplier: 0.8,
        goldMultiplier: 0.8,
        desc: "敵が強い。上級者向け"
    },
    lunatic: {
        name: "ルナティック",
        enemyHpMultiplier: 2.2,
        enemyAtkMultiplier: 1.8,
        enemyDefMultiplier: 1.5,
        expMultiplier: 2.0,
        goldMultiplier: 2.5,
        desc: "敵が極めて強い。上級者のみ推奨。ドロップ率大幅UP"
    },
    inferno: {
        name: "インフェルノ",
        enemyHpMultiplier: 3.0,
        enemyAtkMultiplier: 2.5,
        enemyDefMultiplier: 2.0,
        expMultiplier: 3.5,
        goldMultiplier: 4.0,
        desc: "究極の難易度。最高の報酬。覚悟を決めよ。"
    }
};
