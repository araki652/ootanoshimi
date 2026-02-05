// プレイヤーデータ管理
class Player {
    constructor() {
        this.name = "転生勇者";
        this.level = 1;
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 15;
        this.maxMp = 15;
        this.baseAtk = 20;
        this.atk = 20;
        this.baseDef = 0;
        this.def = 0;
        this.baseMatk = 30;
        this.matk = 30;
        this.exp = 0;
        this.nextExp = 20;
        this.gold = 0;
        this.job = null;
        this.skillLevel = [0, 0, 0];
        this.ailments = [];
        this.consecutiveWins = 0;
    }

    // ステータス異常を付与
    applyAilment(ailmentType) {
        if (!this.ailments.includes(ailmentType)) {
            this.ailments.push(ailmentType);
        }
    }

    // ステータス異常を解除
    cureAilment(ailmentType) {
        this.ailments = this.ailments.filter(a => a !== ailmentType);
    }

    // ステータス異常を持っているか判定
    hasAilment(ailmentType) {
        return this.ailments.includes(ailmentType);
    }

    // すべての状態異常を解除
    clearAllAilments() {
        this.ailments = [];
    }

    // レベルアップ処理
    levelUp(job) {
        this.level++;
        this.exp -= this.nextExp;
        this.nextExp = Math.floor(this.nextExp * 1.3) + 10;
        
        if (job === 'warrior') {
            this.maxHp += 25;
            this.maxMp += 5;
            this.baseAtk += 7;
            this.baseDef += 5;
            this.baseMatk += 2;
        } else if (job === 'mage') {
            this.maxHp += 15;
            this.maxMp += 15;
            this.baseAtk += 2;
            this.baseDef += 1;
            this.baseMatk += 10;
        } else if (job === 'paladin') {
            this.maxHp += 22;
            this.maxMp += 10;
            this.baseAtk += 5;
            this.baseDef += 6;
            this.baseMatk += 4;
        } else if (job === 'assassin') {
            this.maxHp += 18;
            this.maxMp += 6;
            this.baseAtk += 8;
            this.baseDef += 2;
            this.baseMatk += 2;
        } else if (job === 'bishop') {
            this.maxHp += 16;
            this.maxMp += 18;
            this.baseAtk += 3;
            this.baseDef += 2;
            this.baseMatk += 8;
        }
        
        this.hp = this.maxHp;
        this.mp = this.maxMp;
    }

    // 職業を設定
    setJob(jobKey, jobData) {
        this.job = jobKey;
        this.name = jobData.name;
        this.maxHp = jobData.hp;
        this.hp = jobData.hp;
        this.maxMp = jobData.mp;
        this.mp = jobData.mp;
        this.baseAtk = jobData.atk;
        this.baseDef = jobData.def;
        this.baseMatk = jobData.matk;
    }

    // ゲームオーバー時のリセット
    reset() {
        this.level = 1;
        this.maxHp = 100;
        this.hp = 100;
        this.maxMp = 15;
        this.mp = 15;
        this.baseAtk = 20;
        this.baseDef = 0;
        this.baseMatk = 30;
        this.exp = 0;
        this.nextExp = 20;
        this.gold = 0;
        this.ailments = [];
        this.consecutiveWins = 0;
    }

    // HP回復
    recoverHp(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    // MP回復
    recoverMp(amount) {
        this.mp = Math.min(this.mp + amount, this.maxMp);
    }

    // ダメージを受ける
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    // 残りHPの割合を取得（0.0～1.0）
    getHpRatio() {
        return this.hp / this.maxHp;
    }

    // 残りMPの割合を取得（0.0～1.0）
    getMpRatio() {
        return this.mp / this.maxMp;
    }

    // 死亡判定
    isDead() {
        return this.hp <= 0;
    }
}
