// アーティファクトデータベース（50個以上）
const artifacts = [
    // ★5（最高レアリティ） - 1000円ガチャのみ
    { id: 'art_legendary_01', name: '伝説の宝玉', rarity: 5, type: 'multiplier', effect: { atkMult: 1.5 }, tier: 1000, icon: '💎' },
    { id: 'art_legendary_02', name: '神聖なる盾', rarity: 5, type: 'multiplier', effect: { defMult: 1.5 }, tier: 1000, icon: '🛡️' },
    { id: 'art_legendary_03', name: '魔力の源', rarity: 5, type: 'multiplier', effect: { matkMult: 1.5 }, tier: 1000, icon: '✨' },
    { id: 'art_legendary_04', name: '生命の樹', rarity: 5, type: 'multiplier', effect: { hpMult: 1.5 }, tier: 1000, icon: '🌳' },
    { id: 'art_legendary_05', name: '無限の泉', rarity: 5, type: 'multiplier', effect: { mpMult: 1.5 }, tier: 1000, icon: '💧' },
    { id: 'art_legendary_06', name: '黄金の心臓', rarity: 5, type: 'multiplier', effect: { goldMult: 2.0 }, tier: 1000, icon: '❤️' },
    { id: 'art_legendary_07', name: '天の啓示', rarity: 5, type: 'multiplier', effect: { expMult: 2.0 }, tier: 1000, icon: '⚡' },
    { id: 'art_legendary_08', name: '双刃の剣', rarity: 5, type: 'multiplier', effect: { atkMult: 1.8, defMult: 0.8 }, tier: 1000, icon: '⚔️' },
    { id: 'art_legendary_09', name: '至高の魔導書', rarity: 5, type: 'multiplier', effect: { matkMult: 2.0, mpMult: 1.2 }, tier: 1000, icon: '📖' },
    { id: 'art_legendary_10', name: '究極の防壁', rarity: 5, type: 'multiplier', effect: { defMult: 2.0, hpMult: 1.2 }, tier: 1000, icon: '🏰' },
    
    // ★4 - 500円/1000円ガチャ
    { id: 'art_epic_01', name: '覇王の剣', rarity: 4, type: 'multiplier', effect: { atkMult: 1.35 }, tier: 500, icon: '⚔️' },
    { id: 'art_epic_02', name: 'ドラゴンスケイル', rarity: 4, type: 'multiplier', effect: { defMult: 1.35 }, tier: 500, icon: '🐉' },
    { id: 'art_epic_03', name: '妖精の魔法', rarity: 4, type: 'multiplier', effect: { matkMult: 1.35 }, tier: 500, icon: '✨' },
    { id: 'art_epic_04', name: '古龍の血', rarity: 4, type: 'multiplier', effect: { hpMult: 1.35 }, tier: 500, icon: '🩸' },
    { id: 'art_epic_05', name: '魔王の涙', rarity: 4, type: 'multiplier', effect: { mpMult: 1.35 }, tier: 500, icon: '💧' },
    { id: 'art_epic_06', name: '貴族の財宝', rarity: 4, type: 'multiplier', effect: { goldMult: 1.5 }, tier: 500, icon: '💰' },
    { id: 'art_epic_07', name: '英雄の証', rarity: 4, type: 'multiplier', effect: { expMult: 1.5 }, tier: 500, icon: '🏆' },
    { id: 'art_epic_08', name: '黒き翼', rarity: 4, type: 'multiplier', effect: { atkMult: 1.25, matkMult: 1.25 }, tier: 500, icon: '🖤' },
    { id: 'art_epic_09', name: '光の結晶', rarity: 4, type: 'multiplier', effect: { defMult: 1.25, mdefMult: 1.25 }, tier: 500, icon: '💎' },
    { id: 'art_epic_10', name: 'アルケミアの叡智', rarity: 4, type: 'multiplier', effect: { matkMult: 1.25, mpMult: 1.3 }, tier: 500, icon: '🧪' },
    
    // ★3 - 100円/500円/1000円ガチャ
    { id: 'art_rare_01', name: '鋼の意志', rarity: 3, type: 'multiplier', effect: { atkMult: 1.2 }, tier: 100, icon: '⚔️' },
    { id: 'art_rare_02', name: '岩のごとき硬さ', rarity: 3, type: 'multiplier', effect: { defMult: 1.2 }, tier: 100, icon: '🪨' },
    { id: 'art_rare_03', name: '炎の精霊', rarity: 3, type: 'multiplier', effect: { matkMult: 1.2 }, tier: 100, icon: '🔥' },
    { id: 'art_rare_04', name: '健康の秘訣', rarity: 3, type: 'multiplier', effect: { hpMult: 1.2 }, tier: 100, icon: '💪' },
    { id: 'art_rare_05', name: '魔力の欠片', rarity: 3, type: 'multiplier', effect: { mpMult: 1.2 }, tier: 100, icon: '✨' },
    { id: 'art_rare_06', name: 'マーチャントの手腕', rarity: 3, type: 'multiplier', effect: { goldMult: 1.3 }, tier: 100, icon: '💼' },
    { id: 'art_rare_07', name: '成長の実', rarity: 3, type: 'multiplier', effect: { expMult: 1.3 }, tier: 100, icon: '🍎' },
    { id: 'art_rare_08', name: '攻守の均衡', rarity: 3, type: 'multiplier', effect: { atkMult: 1.15, defMult: 1.15 }, tier: 100, icon: '⚖️' },
    { id: 'art_rare_09', name: '魔導の工夫', rarity: 3, type: 'multiplier', effect: { matkMult: 1.15, mpMult: 1.15 }, tier: 100, icon: '🪄' },
    { id: 'art_rare_10', name: '護衛の盾', rarity: 3, type: 'multiplier', effect: { defMult: 1.15, hpMult: 1.15 }, tier: 100, icon: '🛡️' },
    
    // ★2（ノーマルレア） - 100円/500円/1000円ガチャ
    { id: 'art_uncommon_01', name: '旅人の行動', rarity: 2, type: 'multiplier', effect: { atkMult: 1.1 }, tier: 100, icon: '🚶' },
    { id: 'art_uncommon_02', name: '防衛の基本', rarity: 2, type: 'multiplier', effect: { defMult: 1.1 }, tier: 100, icon: '🏰' },
    { id: 'art_uncommon_03', name: '魔法の基礎', rarity: 2, type: 'multiplier', effect: { matkMult: 1.1 }, tier: 100, icon: '📚' },
    { id: 'art_uncommon_04', name: 'HP強化', rarity: 2, type: 'multiplier', effect: { hpMult: 1.1 }, tier: 100, icon: '❤️' },
    { id: 'art_uncommon_05', name: 'MP強化', rarity: 2, type: 'multiplier', effect: { mpMult: 1.1 }, tier: 100, icon: '💙' },
    { id: 'art_uncommon_06', name: 'ショップの味方', rarity: 2, type: 'multiplier', effect: { goldMult: 1.15 }, tier: 100, icon: '🪙' },
    { id: 'art_uncommon_07', name: '修行の成果', rarity: 2, type: 'multiplier', effect: { expMult: 1.15 }, tier: 100, icon: '📈' },
    { id: 'art_uncommon_08', name: '均衡の取れた鍛錬', rarity: 2, type: 'multiplier', effect: { atkMult: 1.08, defMult: 1.08 }, tier: 100, icon: '⚙️' },
    { id: 'art_uncommon_09', name: '魔法修行', rarity: 2, type: 'multiplier', effect: { matkMult: 1.08, mpMult: 1.08 }, tier: 100, icon: '✍️' },
    { id: 'art_uncommon_10', name: 'ファイターの道', rarity: 2, type: 'multiplier', effect: { atkMult: 1.12, hpMult: 1.08 }, tier: 100, icon: '🤝' },
    { id: 'art_uncommon_11', name: 'ウィザードの修養', rarity: 2, type: 'multiplier', effect: { matkMult: 1.12, mpMult: 1.1 }, tier: 100, icon: '🧙' },
    { id: 'art_uncommon_12', name: '盾の守人', rarity: 2, type: 'multiplier', effect: { defMult: 1.12, hpMult: 1.08 }, tier: 100, icon: '🛡️' },
    { id: 'art_uncommon_13', name: '商人の手腕', rarity: 2, type: 'multiplier', effect: { goldMult: 1.2 }, tier: 100, icon: '💼' },
    { id: 'art_uncommon_14', name: '学者の知恵', rarity: 2, type: 'multiplier', effect: { expMult: 1.2 }, tier: 100, icon: '🎓' },
    { id: 'art_uncommon_15', name: '魔力回復', rarity: 2, type: 'multiplier', effect: { mpMult: 1.15, matkMult: 1.08 }, tier: 100, icon: '✨' },
    
    // ★1（コモン） - 100円/500円/1000円ガチャ
    { id: 'art_common_01', name: '木の剣', rarity: 1, type: 'multiplier', effect: { atkMult: 1.05 }, tier: 100, icon: '🪵' },
    { id: 'art_common_02', name: '布の盾', rarity: 1, type: 'multiplier', effect: { defMult: 1.05 }, tier: 100, icon: '🧵' },
    { id: 'art_common_03', name: '魔力の欠片', rarity: 1, type: 'multiplier', effect: { matkMult: 1.05 }, tier: 100, icon: '✨' },
    { id: 'art_common_04', name: 'パン', rarity: 1, type: 'multiplier', effect: { hpMult: 1.05 }, tier: 100, icon: '🍞' },
    { id: 'art_common_05', name: '水のしぶき', rarity: 1, type: 'multiplier', effect: { mpMult: 1.05 }, tier: 100, icon: '💧' },
    { id: 'art_common_06', name: '1ゴールド', rarity: 1, type: 'multiplier', effect: { goldMult: 1.08 }, tier: 100, icon: '🪙' },
    { id: 'art_common_07', name: '経験', rarity: 1, type: 'multiplier', effect: { expMult: 1.08 }, tier: 100, icon: '📚' },
    { id: 'art_common_08', name: '初心者の装備', rarity: 1, type: 'multiplier', effect: { atkMult: 1.03, defMult: 1.03 }, tier: 100, icon: '⚡' },
    { id: 'art_common_09', name: '修行中', rarity: 1, type: 'multiplier', effect: { matkMult: 1.03, mpMult: 1.03 }, tier: 100, icon: '🎯' },
    { id: 'art_common_10', name: '毎日の鍛錬', rarity: 1, type: 'multiplier', effect: { defMult: 1.04, hpMult: 1.04 }, tier: 100, icon: '💪' },
    { id: 'art_common_11', name: '銅のコイン', rarity: 1, type: 'multiplier', effect: { goldMult: 1.05 }, tier: 100, icon: '🪙' },
    { id: 'art_common_12', name: '学びの時間', rarity: 1, type: 'multiplier', effect: { expMult: 1.05 }, tier: 100, icon: '📖' },
    { id: 'art_common_13', name: '元気な気分', rarity: 1, type: 'multiplier', effect: { hpMult: 1.06 }, tier: 100, icon: '😊' },
    { id: 'art_common_14', name: '気合い', rarity: 1, type: 'multiplier', effect: { atkMult: 1.04 }, tier: 100, icon: '🔥' },
    { id: 'art_common_15', name: '守りの心', rarity: 1, type: 'multiplier', effect: { defMult: 1.06 }, tier: 100, icon: '🛡️' },
    
    // 追加の★4/★5級（特殊効果）
    { id: 'art_special_01', name: 'クリティカルの秘訣', rarity: 4, type: 'special', effect: { critRate: 0.15 }, tier: 500, icon: '⚡' },
    { id: 'art_special_02', name: '回避の極意', rarity: 4, type: 'special', effect: { dodgeRate: 0.1 }, tier: 500, icon: '🗡️' },
    { id: 'art_special_03', name: 'ドロップ率UP', rarity: 4, type: 'special', effect: { dropRateBonus: 0.2 }, tier: 500, icon: '🎁' },
    { id: 'art_special_04', name: '運の加護', rarity: 5, type: 'special', effect: { luckBonus: 0.3 }, tier: 1000, icon: '🍀' },
    { id: 'art_special_05', name: '会心一撃', rarity: 5, type: 'special', effect: { critDamage: 2.5 }, tier: 1000, icon: '💥' },
    
    // 追加の職業特化アーティファクト
    { id: 'art_warrior_01', name: '戦士の本能', rarity: 3, type: 'job', job: 'warrior', effect: { atkMult: 1.25, defMult: 1.15 }, tier: 100, icon: '🗡️' },
    { id: 'art_mage_01', name: '魔法使いの知識', rarity: 3, type: 'job', job: 'mage', effect: { matkMult: 1.25, mpMult: 1.2 }, tier: 100, icon: '📖' },
    { id: 'art_paladin_01', name: '聖騎士の輝き', rarity: 3, type: 'job', job: 'paladin', effect: { defMult: 1.25, mdefMult: 1.25 }, tier: 100, icon: '✨' },
    { id: 'art_assassin_01', name: '暗殺者の息吹', rarity: 3, type: 'job', job: 'assassin', effect: { atkMult: 1.3, hpMult: 0.9 }, tier: 100, icon: '🗡️' },
    { id: 'art_bishop_01', name: 'ビショップの祝福', rarity: 3, type: 'job', job: 'bishop', effect: { mpMult: 1.35, atkMult: 1.1 }, tier: 100, icon: '✙' }
];

// ガチャの確率設定
const gachaRates = {
    100: {
        // 100円ガチャ：★1-★3のみ
        1: 0.60,  // 60%
        2: 0.30,  // 30%
        3: 0.10   // 10%
    },
    500: {
        // 500円ガチャ：★1-★4
        1: 0.40,  // 40%
        2: 0.30,  // 30%
        3: 0.20,  // 20%
        4: 0.10   // 10%
    },
    1000: {
        // 1000円ガチャ：全て（★1-★5）
        1: 0.20,  // 20%
        2: 0.20,  // 20%
        3: 0.30,  // 30%
        4: 0.25,  // 25%
        5: 0.05   // 5%
    }
};

// 装備枠解放費用
const artifactSlotUnlockCosts = [
    2000,      // 1スロット目：2000G
    5000,      // 2スロット目：5000G
    15000,     // 3スロット目：15000G
    30000,     // 4スロット目：30000G
    50000      // 5スロット目：50000G
];

// アーティファクト取得関数
function getArtifactById(id) {
    return artifacts.find(a => a.id === id);
}

// ガチャ用：レアリティからアーティファクトを絞り込み
function getArtifactsByRarityAndTier(rarity, tier) {
    return artifacts.filter(a => a.rarity === rarity && a.tier <= tier);
}
