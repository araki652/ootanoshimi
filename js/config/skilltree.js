// スキルツリー定義（職業ごとの習得スキル構造）
const skillTreeConfig = {
    warrior: {
        name: "戦士",
        nodes: [
            {
                id: "w1",
                name: "大斬撃",
                level: 1,
                mp: 0,
                cost: 1,
                type: "atkUp",
                desc: "攻撃力150%で通常攻撃",
                prerequisites: [],
                icon: "⚔️"
            },
            {
                id: "w2",
                name: "連撃",
                level: 3,
                mp: 6,
                cost: 2,
                type: "doubleAtk",
                desc: "2回攻撃する",
                prerequisites: ["w1"],
                icon: "🔥"
            },
            {
                id: "w3",
                name: "鉄壁",
                level: 2,
                mp: 5,
                cost: 1,
                type: "defense",
                desc: "防御力大幅UP",
                prerequisites: [],
                icon: "🛡️"
            },
            {
                id: "w4",
                name: "全力斬撃",
                level: 5,
                mp: 8,
                cost: 3,
                type: "finalBlow",
                desc: "超高威力攻撃（会心率50%）",
                prerequisites: ["w1", "w2"],
                icon: "⚡"
            }
        ]
    },
    mage: {
        name: "魔法使い",
        nodes: [
            {
                id: "m1",
                name: "ファイアボール",
                level: 1,
                mp: 10,
                cost: 1,
                type: "fire",
                desc: "敵に炎のダメージ",
                prerequisites: [],
                icon: "🔥"
            },
            {
                id: "m2",
                name: "フリーズ",
                level: 2,
                mp: 8,
                cost: 1,
                type: "freeze",
                desc: "敵を麻痺状態に",
                prerequisites: [],
                icon: "❄️"
            },
            {
                id: "m3",
                name: "マナストール",
                level: 3,
                mp: 5,
                cost: 2,
                type: "mpRestore",
                desc: "敵からMP吸収",
                prerequisites: ["m1", "m2"],
                icon: "💫"
            },
            {
                id: "m4",
                name: "メテオ",
                level: 6,
                mp: 25,
                cost: 3,
                type: "holyLight",
                desc: "全体に大ダメージ",
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
                name: "ホーリーシールド",
                level: 1,
                mp: 8,
                cost: 1,
                type: "shield",
                desc: "防御とHP回復",
                prerequisites: [],
                icon: "🛡️"
            },
            {
                id: "p2",
                name: "聖なる一撃",
                level: 2,
                mp: 10,
                cost: 1,
                type: "holyStrike",
                desc: "攻撃+吸収回復",
                prerequisites: [],
                icon: "✨"
            },
            {
                id: "p3",
                name: "リザレクション",
                level: 4,
                mp: 15,
                cost: 2,
                type: "resurrect",
                desc: "復活と状態異常解除",
                prerequisites: ["p1"],
                icon: "💚"
            },
            {
                id: "p4",
                name: "聖域",
                level: 5,
                mp: 18,
                cost: 3,
                type: "blessing",
                desc: "敵の攻撃力を低下",
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
                name: "急速剣",
                level: 1,
                mp: 3,
                cost: 1,
                type: "quickStrike",
                desc: "素早い連続攻撃",
                prerequisites: [],
                icon: "⚡"
            },
            {
                id: "a2",
                name: "影分身",
                level: 2,
                mp: 4,
                cost: 1,
                type: "shadowClone",
                desc: "敵の攻撃を回避",
                prerequisites: [],
                icon: "👻"
            },
            {
                id: "a3",
                name: "致命の一撃",
                level: 3,
                mp: 8,
                cost: 2,
                type: "finalBlow",
                desc: "高クリティカル率",
                prerequisites: ["a1"],
                icon: "💀"
            },
            {
                id: "a4",
                name: "暗殺剣",
                level: 6,
                mp: 12,
                cost: 3,
                type: "dimensionDoor",
                desc: "即座に敵を倒す可能性",
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
                name: "聖光",
                level: 1,
                mp: 12,
                cost: 1,
                type: "holyLight",
                desc: "攻撃と回復同時",
                prerequisites: [],
                icon: "💫"
            },
            {
                id: "b2",
                name: "祝福",
                level: 2,
                mp: 6,
                type: "blessing",
                desc: "全ステ一時UP",
                prerequisites: [],
                icon: "✨"
            },
            {
                id: "b3",
                name: "次元の扉",
                level: 4,
                mp: 15,
                cost: 2,
                type: "dimensionDoor",
                desc: "完全復旧",
                prerequisites: ["b1", "b2"],
                icon: "🌀"
            },
            {
                id: "b4",
                name: "神の加護",
                level: 5,
                mp: 20,
                cost: 3,
                type: "resurrect",
                desc: "HPを最大値に完全回復",
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
    }
};
