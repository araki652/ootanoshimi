// ショップアイテム（共通装備削除版）
const shopItems = [
    // 消耗品
    { id: 'p1', name: '回復薬', type: 'heal', val: 50, cost: 30, bought: false, repeatable: true },
    { id: 'p2', name: '回復薬DX', type: 'heal', val: 999, cost: 100, bought: false, repeatable: true },
    { id: 'p3', name: 'MP回復薬', type: 'mpRestore', val: 30, cost: 50, bought: false, repeatable: true },
    { id: 'p4', name: 'MP回復薬DX', type: 'mpRestore', val: 999, cost: 150, bought: false, repeatable: true },
    
    // ステータス異常対策
    { id: 'antiPoison', name: '解毒薬', type: 'ailment', val: 'poison', cost: 100, bought: false, repeatable: true },
    { id: 'antiParalysis', name: 'マヒ回復薬', type: 'ailment', val: 'paralysis', cost: 120, bought: false, repeatable: true },
    { id: 'antiSleep', name: '目覚まし草', type: 'ailment', val: 'sleep', cost: 80, bought: false, repeatable: true },
    { id: 'antiConfusion', name: '正気の薬', type: 'ailment', val: 'confusion', cost: 150, bought: false, repeatable: true },
    
    // 戦士専用
    { id: 'ws1', name: '戦士の大剣', type: 'atk', val: 35, cost: 800, bought: false, jobs: ['warrior'] },
    { id: 'ws2', name: '鋼の大剣', type: 'atk', val: 50, cost: 1500, bought: false, jobs: ['warrior'] },
    { id: 'ws3', name: '破壊王の剣', type: 'atk', val: 85, cost: 4500, bought: false, jobs: ['warrior'] },
    { id: 'wa1', name: '戦士の盾', type: 'def', val: 20, cost: 500, bought: false, jobs: ['warrior'] },
    { id: 'wa2', name: '鋼鉄の盾', type: 'def', val: 40, cost: 1200, bought: false, jobs: ['warrior'] },
    { id: 'wa3', name: '不動の鎧', type: 'def', val: 65, cost: 3500, bought: false, jobs: ['warrior'] },
    { id: 'wa4', name: 'ダイヤモンド鎧', type: 'def', val: 90, cost: 6000, bought: false, jobs: ['warrior'] },
    { id: 'wr1', name: '力の指輪', type: 'atk', val: 15, cost: 700, bought: false, jobs: ['warrior'] },
    { id: 'wr2', name: '堅牢の指輪', type: 'def', val: 25, cost: 900, bought: false, jobs: ['warrior'] },
    { id: 'dws1', name: 'ドラゴンスレイヤー', type: 'atk', val: 70, cost: 3000, bought: false, jobs: ['warrior'], set: 'dragoon' },
    { id: 'dwa1', name: 'ドラゴンアーマー', type: 'def', val: 55, cost: 3000, bought: false, jobs: ['warrior'], set: 'dragoon' },
    
    // 魔法使い専用
    { id: 'wm1', name: '魔法の杖', type: 'matk', val: 15, cost: 300, bought: false, jobs: ['mage'] },
    { id: 'wm2', name: 'スペルブック', type: 'matk', val: 35, cost: 900, bought: false, jobs: ['mage'] },
    { id: 'wm3', name: '秘奥の書', type: 'matk', val: 60, cost: 2200, bought: false, jobs: ['mage'] },
    { id: 'wm4', name: '魔導書アルケミア', type: 'matk', val: 90, cost: 4800, bought: false, jobs: ['mage'] },
    { id: 'wm5', name: '終焉の魔書', type: 'matk', val: 130, cost: 7000, bought: false, jobs: ['mage'] },
    { id: 'am1', name: 'ローブ', type: 'def', val: 8, cost: 150, bought: false, jobs: ['mage'] },
    { id: 'am2', name: '魔術師のローブ', type: 'def', val: 20, cost: 600, bought: false, jobs: ['mage'] },
    { id: 'am3', name: 'スターロック', type: 'def', val: 40, cost: 1800, bought: false, jobs: ['mage'] },
    { id: 'mp1', name: 'MP容器', type: 'mpUp', val: 10, cost: 400, bought: false, jobs: ['mage'], repeatable: true },
    { id: 'mp2', name: 'MP容器DX', type: 'mpUp', val: 25, cost: 1000, bought: false, jobs: ['mage'], repeatable: true },
    { id: 'mp3', name: 'マナの結晶', type: 'mpUp', val: 50, cost: 2500, bought: false, jobs: ['mage'], repeatable: true },
    { id: 'mm1', name: '魔力の指輪', type: 'matk', val: 20, cost: 800, bought: false, jobs: ['mage'] },
    { id: 'mm2', name: 'MP吸収のペンダント', type: 'mpRecover', val: 1, cost: 2000, bought: false, jobs: ['mage'] },
    { id: 'dms1', name: '秘奥の書セージ', type: 'matk', val: 80, cost: 3200, bought: false, jobs: ['mage'], set: 'sage' },
    { id: 'dam1', name: 'セージローブ', type: 'def', val: 45, cost: 2500, bought: false, jobs: ['mage'], set: 'sage' },
    
    // 聖騎士専用
    { id: 'wp1', name: '聖槍', type: 'atk', val: 25, cost: 600, bought: false, jobs: ['paladin'] },
    { id: 'wp2', name: '光の剣', type: 'atk', val: 45, cost: 1400, bought: false, jobs: ['paladin'] },
    { id: 'wp3', name: '勝利の槍', type: 'atk', val: 70, cost: 3200, bought: false, jobs: ['paladin'] },
    { id: 'ap1', name: '聖なる鎧', type: 'def', val: 35, cost: 1500, bought: false, jobs: ['paladin'] },
    { id: 'ap2', name: '光の盾', type: 'def', val: 50, cost: 2200, bought: false, jobs: ['paladin'] },
    { id: 'ap3', name: '神聖なる鎧', type: 'def', val: 75, cost: 4000, bought: false, jobs: ['paladin'] },
    { id: 'ap4', name: '天界の鎧', type: 'def', val: 95, cost: 6500, bought: false, jobs: ['paladin'] },
    { id: 'pp1', name: '祈りの結晶', type: 'mpUp', val: 15, cost: 500, bought: false, jobs: ['paladin'], repeatable: true },
    { id: 'pp2', name: '聖杯', type: 'mpUp', val: 35, cost: 1800, bought: false, jobs: ['paladin'], repeatable: true },
    { id: 'pp3', name: '聖者の指輪', type: 'def', val: 30, cost: 1200, bought: false, jobs: ['paladin'] },
    { id: 'pp4', name: '回復の首飾り', type: 'heal', val: 20, cost: 1500, bought: false, jobs: ['paladin'], repeatable: true },
    { id: 'dps1', name: 'クルセイダースピア', type: 'atk', val: 60, cost: 2800, bought: false, jobs: ['paladin'], set: 'crusader' },
    { id: 'dpa1', name: 'クルセイダーアーマー', type: 'def', val: 70, cost: 3500, bought: false, jobs: ['paladin'], set: 'crusader' },
    
    // 暗殺者専用
    { id: 'as1', name: 'ダガー', type: 'atk', val: 30, cost: 600, bought: false, jobs: ['assassin'] },
    { id: 'as2', name: '影の刃', type: 'atk', val: 55, cost: 1600, bought: false, jobs: ['assassin'] },
    { id: 'as3', name: 'エターナルダガー', type: 'atk', val: 95, cost: 4800, bought: false, jobs: ['assassin'] },
    { id: 'aa1', name: '軽甲冑', type: 'def', val: 12, cost: 400, bought: false, jobs: ['assassin'] },
    { id: 'aa2', name: 'シャドウレザー', type: 'def', val: 32, cost: 1200, bought: false, jobs: ['assassin'] },
    { id: 'aa3', name: 'スピードアーマー', type: 'def', val: 55, cost: 3000, bought: false, jobs: ['assassin'] },
    { id: 'asr1', name: '速度の指輪', type: 'atk', val: 20, cost: 850, bought: false, jobs: ['assassin'] },
    { id: 'das1', name: 'アサシンの爪', type: 'atk', val: 75, cost: 3100, bought: false, jobs: ['assassin'], set: 'shadow' },
    { id: 'daa1', name: 'シャドウレッグス', type: 'def', val: 50, cost: 2800, bought: false, jobs: ['assassin'], set: 'shadow' },
    
    // ビショップ専用
    { id: 'bb1', name: '司祭の杖', type: 'matk', val: 25, cost: 500, bought: false, jobs: ['bishop'] },
    { id: 'bb2', name: '聖者の書', type: 'matk', val: 50, cost: 1400, bought: false, jobs: ['bishop'] },
    { id: 'bb3', name: '奇跡の書', type: 'matk', val: 80, cost: 3200, bought: false, jobs: ['bishop'] },
    { id: 'ba1', name: '司祭のローブ', type: 'def', val: 15, cost: 500, bought: false, jobs: ['bishop'] },
    { id: 'ba2', name: '聖衣', type: 'def', val: 35, cost: 1500, bought: false, jobs: ['bishop'] },
    { id: 'ba3', name: '奇跡のマント', type: 'def', val: 60, cost: 3500, bought: false, jobs: ['bishop'] },
    { id: 'bp1', name: 'MP支援結晶', type: 'mpUp', val: 30, cost: 1500, bought: false, jobs: ['bishop'], repeatable: true },
    { id: 'bp2', name: '無限のマナ', type: 'mpUp', val: 60, cost: 3500, bought: false, jobs: ['bishop'], repeatable: true },
    { id: 'bsr1', name: '支援者の指輪', type: 'matk', val: 25, cost: 1000, bought: false, jobs: ['bishop'] },
    { id: 'dbs1', name: '司祭の叡智', type: 'matk', val: 90, cost: 3400, bought: false, jobs: ['bishop'], set: 'saint' },
    { id: 'dba1', name: '聖衣ガイア', type: 'def', val: 65, cost: 3200, bought: false, jobs: ['bishop'], set: 'saint' }
];
