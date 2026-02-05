// 職業定義（5職業：戦士、魔法使い、聖騎士、暗殺者、ビショップ）
const jobs = {
    warrior: { 
        name: "戦士", color: "#f1c40f",
        hp: 120, mp: 10, atk: 28, def: 8, matk: 15,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "斬撃", mp: 0, type: "atkUp", desc: "攻撃力110%の剣撃" },
            { name: "防御", mp: 0, type: "defense", desc: "一時的に防御力UP" }
        ]
    },
    mage: { 
        name: "魔法使い", color: "#3498db",
        hp: 80, mp: 30, atk: 15, def: 3, matk: 40,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "火の矢", mp: 5, type: "fire", desc: "敵に初級火魔法" },
            { name: "マジックシールド", mp: 3, type: "mpRestore", desc: "MP少量回復" }
        ]
    },
    paladin: { 
        name: "聖騎士", color: "#2ecc71",
        hp: 110, mp: 20, atk: 22, def: 12, matk: 20,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "聖剣", mp: 5, type: "shield", desc: "中程度ダメージ+小回復" },
            { name: "ホーリーライト", mp: 6, type: "holyStrike", desc: "敵にダメージ＆HP回復" }
        ]
    },
    assassin: { 
        name: "暗殺者", color: "#e74c3c",
        hp: 85, mp: 8, atk: 35, def: 5, matk: 12,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "素早い斬撃", mp: 2, type: "quickStrike", desc: "速度重視の攻撃" },
            { name: "回避技", mp: 2, type: "shadowClone", desc: "敵の攻撃を軽減" }
        ]
    },
    bishop: { 
        name: "ビショップ", color: "#9b59b6",
        hp: 70, mp: 50, atk: 12, def: 4, matk: 35,
        skills: [
            { name: "通常攻撃", mp: 0, type: "normalAttack", desc: "通常の一撃" },
            { name: "光の祈り", mp: 8, type: "holyLight", desc: "敵にダメージ＆中回復" },
            { name: "守りの魔法", mp: 4, type: "blessing", desc: "防御力UP" }
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
    crusader: { items: ['dps1', 'dpa1'], bonusAtk: 15, bonusDef: 25 },
    shadow: { items: ['das1', 'daa1'], bonusAtk: 25, bonusDef: 10 },
    saint: { items: ['dbs1', 'dba1'], bonusMatk: 20, bonusDef: 20, bonusMp: 15 }
};
