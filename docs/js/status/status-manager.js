// ステータス管理システム
class StatusManager {
    constructor(player) {
        this.player = player;
    }

    // ステータスを再計算（装備の効果を反映）
    recalculateStats() {
        let addAtk = 0;
        let addDef = 0;
        let addMatk = 0;
        let addMp = 0;

        // 装備による能力値加算
        shopItems.forEach(item => {
            if (item.bought) {
                if (item.type === 'atk') addAtk += item.val;
                if (item.type === 'def') addDef += item.val;
                if (item.type === 'matk') addMatk += item.val;
                if (item.type === 'mpUp') addMp += item.val;
            }
        });

        // 装備セット効果を反映
        Object.keys(equipmentSets).forEach(setName => {
            const set = equipmentSets[setName];
            let matchCount = 0;
            
            set.items.forEach(itemId => {
                const item = shopItems.find(i => i.id === itemId && i.bought);
                if (item) matchCount++;
            });
            
            // すべてのセットアイテムを装備している場合のみボーナス
            if (matchCount === set.items.length) {
                if (set.bonusAtk) addAtk += set.bonusAtk;
                if (set.bonusDef) addDef += set.bonusDef;
                if (set.bonusMatk) addMatk += set.bonusMatk;
                if (set.bonusMp) addMp += set.bonusMp;
            }
        });

        this.player.atk = this.player.baseAtk + addAtk;
        this.player.def = this.player.baseDef + addDef;
        this.player.matk = this.player.baseMatk + addMatk;
        this.player.maxMp += addMp;
    }

    // HP比率を取得（パーセンテージ）
    getHpPercentage() {
        return Math.floor((this.player.hp / this.player.maxHp) * 100);
    }

    // MP比率を取得（パーセンテージ）
    getMpPercentage() {
        return Math.floor((this.player.mp / this.player.maxMp) * 100);
    }

    // 低HPか判定（20%以下）
    isLowHp() {
        return this.player.getHpRatio() <= 0.2;
    }

    // 低MPか判定（20%以下）
    isLowMp() {
        return this.player.getMpRatio() <= 0.2;
    }

    // レベルアップ可能か判定
    canLevelUp() {
        return this.player.exp >= this.player.nextExp;
    }

    // 次のレベルアップまでの経験値
    getExpToNextLevel() {
        const remain = this.player.nextExp - this.player.exp;
        return remain > 0 ? remain : 0;
    }

    // ステータス表示用テキスト
    getStatusText() {
        return {
            name: this.player.name,
            level: this.player.level,
            hp: `${this.player.hp}/${this.player.maxHp}`,
            mp: `${this.player.mp}/${this.player.maxMp}`,
            atk: this.player.atk,
            def: this.player.def,
            matk: this.player.matk,
            exp: this.player.exp,
            nextExp: this.player.nextExp,
            gold: this.player.gold,
            ailments: this.player.ailments.map(a => statusAilment[a]?.name || a)
        };
    }

    // 敵ステータス表示用テキスト
    getEnemyStatusText(enemy) {
        return {
            name: enemy.name,
            hp: `${enemy.hp}/${enemy.maxHp}`,
            hpPercentage: Math.floor((enemy.hp / enemy.maxHp) * 100),
            type: enemy.type,
            isBoss: enemy.isBoss
        };
    }

    // ステータス異常の表示
    getAilmentDisplay() {
        if (this.player.ailments.length === 0) return "異常なし";
        
        return this.player.ailments
            .map(a => statusAilment[a]?.name || a)
            .join("、");
    }

    // 装備統計
    getEquipmentStats() {
        let totalAtk = 0;
        let totalDef = 0;
        let totalMatk = 0;

        shopItems.forEach(item => {
            if (item.bought && (item.type === 'atk' || item.type === 'def' || item.type === 'matk')) {
                if (item.type === 'atk') totalAtk += item.val;
                if (item.type === 'def') totalDef += item.val;
                if (item.type === 'matk') totalMatk += item.val;
            }
        });

        return {
            totalAtk,
            totalDef,
            totalMatk,
            equipmentCount: shopItems.filter(i => i.bought && (i.type === 'atk' || i.type === 'def' || i.type === 'matk')).length
        };
    }

    // ステータス異常数
    getAilmentCount() {
        return this.player.ailments.length;
    }

    // 状態表示（デバッグ用）
    debugStatus() {
        console.log(`=== ${this.player.name} (Lv${this.player.level}) ===`);
        console.log(`HP: ${this.player.hp}/${this.player.maxHp}`);
        console.log(`MP: ${this.player.mp}/${this.player.maxMp}`);
        console.log(`攻撃力: ${this.player.atk} (基本: ${this.player.baseAtk})`);
        console.log(`防御力: ${this.player.def} (基本: ${this.player.baseDef})`);
        console.log(`魔力: ${this.player.matk} (基本: ${this.player.baseMatk})`);
        console.log(`経験値: ${this.player.exp}/${this.player.nextExp}`);
        console.log(`ゴールド: ${this.player.gold}`);
        console.log(`状態異常: ${this.getAilmentDisplay()}`);
    }
}
