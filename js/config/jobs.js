// 職業定義（5職業：戦士、魔法使い、聖騎士、暗殺者、ビショップ）
const jobs = {
    warrior: { 
        name: "戦士", color: "#f1c40f",
        hp: 120, mp: 10, atk: 28, def: 8, matk: 15,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "大斬撃", mp: 0, type: "atkUp", desc: "攻撃力150%で通常攻撃" },
            { name: "連撃", mp: 6, type: "doubleAtk", desc: "2回攻撃する" },
            { name: "鉄壁", mp: 5, type: "defense", desc: "防御力UP" }
        ]
    },
    mage: { 
        name: "魔法使い", color: "#3498db",
        hp: 80, mp: 30, atk: 15, def: 3, matk: 40,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "ファイアボール", mp: 10, type: "fire", desc: "敵に炎のダメージ" },
            { name: "フリーズ", mp: 8, type: "freeze", desc: "敵を麻痺状態に" },
            { name: "マナストール", mp: 5, type: "mpRestore", desc: "敵からMP吸収" }
        ]
    },
    paladin: { 
        name: "聖騎士", color: "#2ecc71",
        hp: 110, mp: 20, atk: 22, def: 12, matk: 20,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "ホーリーシールド", mp: 8, type: "shield", desc: "防御とHP回復" },
            { name: "聖なる一撃", mp: 10, type: "holyStrike", desc: "攻撃+吸収回復" },
            { name: "リザレクション", mp: 15, type: "resurrect", desc: "復活と状態異常解除" }
        ]
    },
    assassin: { 
        name: "暗殺者", color: "#e74c3c",
        hp: 85, mp: 8, atk: 35, def: 5, matk: 12,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "急速剣", mp: 3, type: "quickStrike", desc: "素早い連続攻撃" },
            { name: "影分身", mp: 4, type: "shadowClone", desc: "敵の攻撃を回避" },
            { name: "致命の一撃", mp: 8, type: "finalBlow", desc: "高クリティカル率" }
        ]
    },
    bishop: { 
        name: "ビショップ", color: "#9b59b6",
        hp: 70, mp: 50, atk: 12, def: 4, matk: 35,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "聖光", mp: 12, type: "holyLight", desc: "攻撃と回復同時" },
            { name: "祝福", mp: 6, type: "blessing", desc: "全ステ一時UP" },
            { name: "次元の扉", mp: 15, type: "dimensionDoor", desc: "完全復旧" }
        ]
    }
};

// ステータス異常管理
const statusAilment = {
    poison: { name: "毒", turnDamage: 3, color: "#9b59b6" },
    paralysis: { name: "麻痺", speedDown: 0.5, color: "#f39c12" },
    sleep: { name: "睡眠", blockAction: true, color: "#3498db" },
    confusion: { name: "混乱", confuse: true, color: "#e74c3c" }
};

// 装備セット効果
const equipmentSets = {
    dragoon: { items: ['dws1', 'dwa1'], bonusAtk: 20, bonusDef: 15 },
    sage: { items: ['dms1', 'dam1'], bonusMatk: 25, bonusMp: 10 },
    crusader: { items: ['dps1', 'dpa1'], bonusAtk: 15, bonusDef: 25 }
};
