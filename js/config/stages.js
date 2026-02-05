// ステージ定義（9ステージ）
const stages = [
    {
        name: "迷いの森",
        reqKills: 5, 
        enemies: [
            { name: "スライム", maxHp: 40, atk: 10, def: 2, mdef: 0, exp: 5, gold: 5, rate: 50 },
            { name: "ゴブリン", maxHp: 70, atk: 15, def: 5, mdef: 2, exp: 12, gold: 12, rate: 30 },
            { name: "人食い草", maxHp: 100, atk: 20, def: 0, mdef: 20, exp: 18, gold: 15, rate: 15 },
            { name: "ゴールデンスライム", maxHp: 30, atk: 5, def: 20, mdef: 20, exp: 200, gold: 200, rate: 5, type: 'rare', dropItems: ['dws1'] }
        ],
        boss: { name: "大トレント", maxHp: 300, atk: 30, def: 10, mdef: 5, exp: 100, gold: 100, type: 'boss', dropItems: ['dws1'] }
    },
    {
        name: "静寂の湖畔",
        reqKills: 5,
        hasPuzzle: true,
        enemies: [
            { name: "キラーフィッシュ", maxHp: 90, atk: 25, def: 10, mdef: 5, exp: 18, gold: 15, rate: 40 },
            { name: "リザードマン", maxHp: 120, atk: 30, def: 15, mdef: 5, exp: 25, gold: 20, rate: 35 },
            { name: "セイレーン", maxHp: 80, atk: 20, def: 5, mdef: 40, exp: 28, gold: 30, rate: 20 },
            { name: "水竜の幼体", maxHp: 50, atk: 40, def: 30, mdef: 30, exp: 300, gold: 150, rate: 5, type: 'rare', dropItems: ['dms1'] }
        ],
        boss: { name: "クラーケン", maxHp: 500, atk: 45, def: 15, mdef: 20, exp: 200, gold: 200, type: 'boss', dropItems: ['dms1'] }
    },
    {
        name: "灼熱の洞窟",
        reqKills: 6,
        enemies: [
            { name: "ファイアーバット", maxHp: 80, atk: 25, def: 5, mdef: 5, exp: 20, gold: 18, rate: 40 },
            { name: "ロックゴーレム", maxHp: 150, atk: 35, def: 30, mdef: 0, exp: 35, gold: 25, rate: 30 },
            { name: "フレイム", maxHp: 100, atk: 30, def: 0, mdef: 50, exp: 30, gold: 20, rate: 25 },
            { name: "メタルスライム", maxHp: 10, atk: 10, def: 999, mdef: 999, exp: 500, gold: 10, rate: 5, type: 'rare', dropItems: ['dps1'] }
        ],
        boss: { name: "ドラゴン", maxHp: 700, atk: 55, def: 25, mdef: 15, exp: 350, gold: 350, type: 'boss', dropItems: ['dps1'] }
    },
    {
        name: "天空の塔",
        reqKills: 6,
        hasPuzzle: true,
        enemies: [
            { name: "ハーピー", maxHp: 140, atk: 40, def: 10, mdef: 30, exp: 40, gold: 35, rate: 40 },
            { name: "グリフォン", maxHp: 200, atk: 50, def: 20, mdef: 20, exp: 55, gold: 45, rate: 35 },
            { name: "ガーゴイル", maxHp: 250, atk: 45, def: 40, mdef: 10, exp: 60, gold: 40, rate: 20 },
            { name: "天使の使い", maxHp: 100, atk: 30, def: 50, mdef: 50, exp: 800, gold: 500, rate: 5, type: 'rare', dropItems: ['dwa1'] }
        ],
        boss: { name: "天空の覇者", maxHp: 900, atk: 70, def: 30, mdef: 30, exp: 500, gold: 500, type: 'boss', dropItems: ['dwa1'] }
    },
    {
        name: "滅びの沼",
        reqKills: 7,
        enemies: [
            { name: "沼地のスケルトン", maxHp: 130, atk: 40, def: 15, mdef: 10, exp: 50, gold: 40, rate: 45 },
            { name: "ゾンビ", maxHp: 180, atk: 35, def: 20, mdef: 5, exp: 55, gold: 45, rate: 35 },
            { name: "ボーンロード", maxHp: 200, atk: 50, def: 25, mdef: 10, exp: 70, gold: 60, rate: 15 },
            { name: "古き獣の霊", maxHp: 120, atk: 55, def: 15, mdef: 35, exp: 1000, gold: 800, rate: 5, type: 'rare', dropItems: ['dam1'] }
        ],
        boss: { name: "グレイヴライダー", maxHp: 1100, atk: 80, def: 35, mdef: 20, exp: 700, gold: 600, type: 'boss', dropItems: ['dam1'] }
    },
    {
        name: "氷結の山頂",
        reqKills: 7,
        enemies: [
            { name: "アイスジャイアント", maxHp: 200, atk: 60, def: 40, mdef: 15, exp: 65, gold: 55, rate: 40 },
            { name: "フロストウルフ", maxHp: 140, atk: 55, def: 20, mdef: 25, exp: 60, gold: 50, rate: 35 },
            { name: "ブリザード", maxHp: 110, atk: 50, def: 10, mdef: 60, exp: 75, gold: 65, rate: 20 },
            { name: "霜の女王", maxHp: 150, atk: 45, def: 35, mdef: 70, exp: 1200, gold: 900, rate: 5, type: 'rare', dropItems: ['dpa1'] }
        ],
        boss: { name: "アイスドラゴン", maxHp: 1300, atk: 90, def: 40, mdef: 35, exp: 850, gold: 700, type: 'boss', dropItems: ['dpa1'] }
    },
    {
        name: "影の森",
        reqKills: 8,
        hasPuzzle: true,
        enemies: [
            { name: "シャドウナイト", maxHp: 250, atk: 70, def: 35, mdef: 20, exp: 80, gold: 70, rate: 40 },
            { name: "ダークエルフ", maxHp: 180, atk: 65, def: 25, mdef: 45, exp: 85, gold: 75, rate: 35 },
            { name: "デーモン", maxHp: 220, atk: 75, def: 20, mdef: 40, exp: 95, gold: 80, rate: 20 },
            { name: "混沌の化身", maxHp: 160, atk: 80, def: 30, mdef: 60, exp: 1500, gold: 1200, rate: 5, type: 'rare', dropItems: ['antiPoison'] }
        ],
        boss: { name: "暗黒の君主", maxHp: 1500, atk: 110, def: 45, mdef: 40, exp: 1000, gold: 800, type: 'boss', dropItems: ['antiPoison'] }
    },
    {
        name: "光の祭壇",
        reqKills: 8,
        enemies: [
            { name: "聖なる騎士", maxHp: 280, atk: 75, def: 50, mdef: 30, exp: 100, gold: 85, rate: 40 },
            { name: "天空のウィザード", maxHp: 200, atk: 70, def: 25, mdef: 70, exp: 105, gold: 90, rate: 35 },
            { name: "光の巨人", maxHp: 300, atk: 65, def: 60, mdef: 25, exp: 110, gold: 100, rate: 20 },
            { name: "星降りの賢者", maxHp: 180, atk: 60, def: 45, mdef: 80, exp: 1800, gold: 1500, rate: 5, type: 'rare', dropItems: ['antiParalysis'] }
        ],
        boss: { name: "光の大天使", maxHp: 1800, atk: 120, def: 50, mdef: 50, exp: 1200, gold: 1000, type: 'boss', dropItems: ['antiParalysis'] }
    },
    {
        name: "魔王城",
        reqKills: 10,
        enemies: [
            { name: "ダークナイト", maxHp: 250, atk: 55, def: 30, mdef: 15, exp: 60, gold: 50, rate: 40 },
            { name: "アークデーモン", maxHp: 220, atk: 65, def: 15, mdef: 40, exp: 70, gold: 60, rate: 35 },
            { name: "キラーマシン", maxHp: 300, atk: 70, def: 50, mdef: 20, exp: 90, gold: 70, rate: 25 }
        ],
        boss: { name: "魔王", maxHp: 2500, atk: 130, def: 60, mdef: 50, exp: 2000, gold: 1500, type: 'boss', dropItems: ['antiConfusion', 'antiSleep'] }
    }
];

// 謎解きデータ
const riddles = [
    { q: "「朝は4本、昼は2本、夜は3本の足で歩く生き物は？」", options: ["人間", "スライム", "ドラゴン"], ans: 0 },
    { q: "「切れば切るほど大きくなるものは？」", options: ["借金", "穴", "希望"], ans: 1 },
    { q: "「パンはパンでも食べられないパンは？」", options: ["フライパン", "腐ったパン", "パンツ"], ans: 0 },
    { q: "「世界の中心にいる虫は？」", options: ["ハエ", "カ", "クモ"], ans: 1 },
    { q: "「次の数字の並びの最後は？\n1, 1, 2, 3, 5, ...」", options: ["6", "7", "8"], ans: 2 }
];
