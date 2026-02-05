// 敵データ管理
class Enemy {
    constructor(enemyData) {
        this.name = enemyData.name;
        this.maxHp = enemyData.maxHp;
        this.hp = enemyData.maxHp;
        this.atk = enemyData.atk;
        this.def = enemyData.def;
        this.mdef = enemyData.mdef;
        this.exp = enemyData.exp;
        this.gold = enemyData.gold;
        this.type = enemyData.type || 'normal';
        this.dropItems = enemyData.dropItems || [];
        this.isBoss = enemyData.isBoss || false;
    }

    // ダメージを受ける
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    // HP回復
    recoverHp(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    // 死亡判定
    isDead() {
        return this.hp <= 0;
    }

    // 残りHPの割合を取得（0.0～1.0）
    getHpRatio() {
        return this.hp / this.maxHp;
    }

    // レアドロップ判定
    hasDropItem() {
        if (!this.dropItems || this.dropItems.length === 0) return false;
        
        let dropRate = 0;
        if (this.type === 'rare') {
            dropRate = 30;
        } else if (this.type === 'boss') {
            dropRate = 100;
        } else {
            dropRate = 5;
        }
        
        return Math.floor(Math.random() * 100) < dropRate;
    }

    // ドロップアイテムを取得
    getDropItem() {
        if (!this.hasDropItem() || this.dropItems.length === 0) return null;
        return this.dropItems[Math.floor(Math.random() * this.dropItems.length)];
    }

    // 敵パーティを生成（複数体出現用）
    static generateParty(enemies, count) {
        const party = [];
        for (let i = 0; i < count; i++) {
            const selectedEnemy = enemies[Math.floor(Math.random() * enemies.length)];
            party.push(new Enemy(selectedEnemy));
        }
        return party;
    }

    // ランダムに敵を選出
    static selectRandom(enemies) {
        const rand = Math.floor(Math.random() * 100);
        let rateSum = 0;
        
        for (const e of enemies) {
            rateSum += e.rate;
            if (rand < rateSum) {
                return new Enemy(e);
            }
        }
        
        return new Enemy(enemies[enemies.length - 1]);
    }
}
